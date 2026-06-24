import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import {
  User,
  WorkoutType,
  RoutePoint,
} from "@/types";
import {
  getTodayDateString,
  getYesterdayDateString,
} from "@/lib/utils";
import { resolveUserAttendanceRules } from "@/lib/attendanceRules";
import { getUser, updateUserStats } from "./userService";
import { checkAndAwardBadges } from "./badgeService";
import { syncUserLevel } from "./levelService";

function checkEligibility(
  rules: ReturnType<typeof resolveUserAttendanceRules>,
  type: WorkoutType,
  duration: number,
  distance: number
): boolean {
  const rule = rules[type];
  return duration >= rule.minDuration || distance >= rule.minDistance;
}

async function calculateStreak(userId: string): Promise<number> {
  const snapshot = await getDocs(
    query(collection(getFirebaseDb(), "attendance"), where("userId", "==", userId))
  );
  const dates = new Set(
    snapshot.docs.filter((d) => d.data().status).map((d) => d.data().date as string)
  );
  if (dates.size === 0) return 0;

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const checkDate = dates.has(today)
    ? today
    : dates.has(yesterday)
      ? yesterday
      : null;
  if (!checkDate) return 0;

  let streak = 0;
  const current = new Date(checkDate);
  while (true) {
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    if (dates.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else break;
  }
  return streak;
}

export interface CompleteWorkoutInput {
  userId: string;
  type: WorkoutType;
  distance: number;
  duration: number;
  pace: number;
  calories: number;
  memo: string;
  route: RoutePoint[];
}

export interface CompleteWorkoutResult {
  workoutId: string;
  attended: boolean;
  updatedUser: User;
}

export async function completeWorkout(
  input: CompleteWorkoutInput
): Promise<CompleteWorkoutResult> {
  const db = getFirebaseDb();
  const today = getTodayDateString();
  const attDocId = `${input.userId}_${today}`;
  const workoutRef = doc(collection(db, "workouts"));
  const userRef = doc(db, "users", input.userId);
  const attRef = doc(db, "attendance", attDocId);

  let attended = false;

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw new Error("사용자 정보를 찾을 수 없습니다.");

    const userData = userSnap.data() as User;
    const attendanceRules = resolveUserAttendanceRules(userData);
    const attSnap = await transaction.get(attRef);

    const eligible = checkEligibility(
      attendanceRules,
      input.type,
      input.duration,
      input.distance
    );

    transaction.set(workoutRef, {
      userId: input.userId,
      type: input.type,
      distance: input.distance,
      duration: input.duration,
      pace: input.pace,
      calories: input.calories,
      memo: input.memo,
      route: input.route,
      createdAt: serverTimestamp(),
    });

    if (eligible && !attSnap.exists()) {
      transaction.set(attRef, {
        userId: input.userId,
        date: today,
        status: true,
        createdAt: serverTimestamp(),
      });
      attended = true;
    }

    transaction.update(userRef, {
      totalDistance: userData.totalDistance + input.distance,
      totalDuration: userData.totalDuration + input.duration,
      totalWorkoutCount: userData.totalWorkoutCount + 1,
    });
  });

  if (attended) {
    const newStreak = await calculateStreak(input.userId);
    await updateUserStats(input.userId, { streak: newStreak });
  }

  await checkAndAwardBadges(input.userId);
  await syncUserLevel(input.userId);

  const finalUser = await getUser(input.userId);
  if (!finalUser) throw new Error("사용자 정보를 불러오지 못했습니다.");

  return { workoutId: workoutRef.id, attended, updatedUser: finalUser };
}

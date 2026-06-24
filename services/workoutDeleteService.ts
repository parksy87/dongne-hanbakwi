import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { User, Workout } from "@/types";
import {
  checkAttendanceEligibility,
  resolveUserAttendanceRules,
} from "@/lib/attendanceRules";
import { calculateLevel, getTodayDateString, getYesterdayDateString } from "@/lib/utils";
import { getUser } from "./userService";

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
    const dateStr = toDateString(current);
    if (dates.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else break;
  }
  return streak;
}

async function syncAttendanceForDate(
  userId: string,
  dateStr: string,
  rules: ReturnType<typeof resolveUserAttendanceRules>
): Promise<void> {
  const db = getFirebaseDb();
  const dayStart = new Date(dateStr);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dateStr);
  dayEnd.setHours(23, 59, 59, 999);

  const { Timestamp } = await import("firebase/firestore");
  const workoutsSnap = await getDocs(
    query(
      collection(db, "workouts"),
      where("userId", "==", userId),
      where("createdAt", ">=", Timestamp.fromDate(dayStart)),
      where("createdAt", "<=", Timestamp.fromDate(dayEnd))
    )
  );

  const hasEligible = workoutsSnap.docs.some((d) => {
    const w = d.data();
    return checkAttendanceEligibility(w.type, w.duration, w.distance, rules);
  });

  const attQuery = query(
    collection(db, "attendance"),
    where("userId", "==", userId),
    where("date", "==", dateStr)
  );
  const attSnap = await getDocs(attQuery);
  const attDocId = `${userId}_${dateStr}`;
  const attRef = doc(db, "attendance", attDocId);

  if (hasEligible) {
    if (attSnap.empty) {
      await runTransaction(db, async (tx) => {
        const existing = await tx.get(attRef);
        if (!existing.exists()) {
          tx.set(attRef, {
            userId,
            date: dateStr,
            status: true,
            createdAt: serverTimestamp(),
          });
        }
      });
    }
  } else {
    for (const d of attSnap.docs) {
      await deleteDoc(d.ref);
    }
    const legacy = await getDoc(attRef);
    if (legacy.exists()) await deleteDoc(attRef);
  }
}

export async function deleteUserWorkout(
  workoutId: string,
  userId: string
): Promise<User> {
  const db = getFirebaseDb();
  const workoutRef = doc(db, "workouts", workoutId);
  const workoutSnap = await getDoc(workoutRef);

  if (!workoutSnap.exists()) throw new Error("운동 기록을 찾을 수 없습니다.");
  const workout = { id: workoutSnap.id, ...workoutSnap.data() } as Workout;
  if (workout.userId !== userId) throw new Error("삭제 권한이 없습니다.");

  const workoutDate = workout.createdAt?.toDate?.();
  const dateStr = workoutDate ? toDateString(workoutDate) : getTodayDateString();

  const userRef = doc(db, "users", userId);

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) throw new Error("사용자 정보를 찾을 수 없습니다.");
    const userData = userSnap.data() as User;

    tx.delete(workoutRef);
    tx.update(userRef, {
      totalDistance: Math.max(0, userData.totalDistance - workout.distance),
      totalDuration: Math.max(0, userData.totalDuration - workout.duration),
      totalWorkoutCount: Math.max(0, userData.totalWorkoutCount - 1),
      level: calculateLevel(
        Math.max(0, userData.totalDistance - workout.distance)
      ),
    });
  });

  const user = await getUser(userId);
  const rules = resolveUserAttendanceRules(user);
  await syncAttendanceForDate(userId, dateStr, rules);

  const newStreak = await calculateStreak(userId);
  const { updateDoc } = await import("firebase/firestore");
  await updateDoc(userRef, { streak: newStreak });

  const updated = await getUser(userId);
  if (!updated) throw new Error("사용자 정보를 불러오지 못했습니다.");
  return updated;
}

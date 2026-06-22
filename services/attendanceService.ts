import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Attendance } from "@/types";
import { getTodayDateString, getYesterdayDateString } from "@/lib/utils";
import { updateUserStats } from "./userService";
import { ATTENDANCE_RULES } from "@/lib/constants";
import { AttendanceRules, WorkoutType } from "@/types";

export function checkAttendanceEligibility(
  type: WorkoutType,
  duration: number,
  distance: number,
  rules?: AttendanceRules
): boolean {
  const activeRules = rules ?? ATTENDANCE_RULES;
  const rule = activeRules[type];
  return duration >= rule.minDuration || distance >= rule.minDistance;
}

export async function getTodayAttendance(userId: string): Promise<Attendance | null> {
  const today = getTodayDateString();
  const q = query(
    collection(getFirebaseDb(), "attendance"),
    where("userId", "==", userId),
    where("date", "==", today)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as Attendance;
}

export async function getUserAttendance(userId: string): Promise<Attendance[]> {
  const q = query(
    collection(getFirebaseDb(), "attendance"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Attendance);
}

export async function getAttendanceInRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Attendance[]> {
  const all = await getUserAttendance(userId);
  return all.filter((a) => a.date >= startDate && a.date <= endDate);
}

export async function markAttendance(
  userId: string,
  type: WorkoutType,
  duration: number,
  distance: number
): Promise<boolean> {
  if (!checkAttendanceEligibility(type, duration, distance)) {
    return false;
  }

  const today = getTodayDateString();
  const existing = await getTodayAttendance(userId);
  if (existing) return false;

  await addDoc(collection(getFirebaseDb(), "attendance"), {
    userId,
    date: today,
    status: true,
    createdAt: serverTimestamp(),
  });

  const newStreak = await calculateStreak(userId);
  await updateUserStats(userId, { streak: newStreak });

  return true;
}

export async function calculateStreak(userId: string): Promise<number> {
  const allAttendance = await getUserAttendance(userId);
  if (allAttendance.length === 0) return 0;

  const dates = new Set(allAttendance.filter((a) => a.status).map((a) => a.date));
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  let checkDate: string;
  if (dates.has(today)) {
    checkDate = today;
  } else if (dates.has(yesterday)) {
    checkDate = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  const current = new Date(checkDate);

  while (true) {
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
    if (dates.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function isAttendedToday(userId: string): Promise<boolean> {
  const attendance = await getTodayAttendance(userId);
  return attendance !== null && attendance.status;
}

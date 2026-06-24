import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Attendance } from "@/types";
import { getTodayDateString } from "@/lib/utils";

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

export async function isAttendedToday(userId: string): Promise<boolean> {
  const attendance = await getTodayAttendance(userId);
  return attendance !== null && attendance.status;
}

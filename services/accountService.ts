import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { getUserWorkouts } from "./workoutService";
import { getUserAttendance } from "./attendanceService";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";

async function deleteCollectionWhere(
  collectionName: string,
  field: string,
  value: string
) {
  const snap = await getDocs(
    query(collection(getFirebaseDb(), collectionName), where(field, "==", value))
  );
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

export async function deleteUserAccount(uid: string): Promise<void> {
  await Promise.all([
    deleteCollectionWhere("workouts", "userId", uid),
    deleteCollectionWhere("attendance", "userId", uid),
    deleteCollectionWhere("badges", "userId", uid),
    deleteCollectionWhere("inquiries", "userId", uid),
  ]);
  await deleteDoc(doc(getFirebaseDb(), "users", uid));

  const auth = getFirebaseAuth();
  if (auth.currentUser?.uid === uid) {
    await deleteUser(auth.currentUser);
  }
}

export async function exportUserDataCsv(uid: string): Promise<string> {
  const [workouts, attendance] = await Promise.all([
    getUserWorkouts(uid),
    getUserAttendance(uid),
  ]);

  const workoutRows = [
    ["날짜", "종류", "거리(m)", "시간(초)", "칼로리", "메모"].join(","),
    ...workouts.map((w) => {
      const date = w.createdAt?.toDate?.();
      const dateStr = date
        ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        : "";
      const memo = (w.memo || "").replace(/"/g, '""');
      return [
        dateStr,
        WORKOUT_TYPE_LABELS[w.type] || w.type,
        w.distance,
        w.duration,
        w.calories,
        `"${memo}"`,
      ].join(",");
    }),
  ];

  const attendanceRows = [
    "",
    "출석 기록",
    "날짜,출석",
    ...attendance.map((a) => `${a.date},${a.status ? "O" : "X"}`),
  ];

  return [...workoutRows, ...attendanceRows].join("\n");
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

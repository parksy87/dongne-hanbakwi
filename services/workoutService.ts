import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  doc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Workout, WorkoutType, RoutePoint } from "@/types";

export async function saveWorkout(data: {
  userId: string;
  type: WorkoutType;
  distance: number;
  duration: number;
  pace: number;
  calories: number;
  memo: string;
  route: RoutePoint[];
}): Promise<string> {
  const docRef = await addDoc(collection(getFirebaseDb(), "workouts"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getWorkout(id: string): Promise<Workout | null> {
  const workoutDoc = await getDoc(doc(getFirebaseDb(), "workouts", id));
  if (!workoutDoc.exists()) return null;
  return { id: workoutDoc.id, ...workoutDoc.data() } as Workout;
}

export async function getUserWorkouts(userId: string): Promise<Workout[]> {
  const q = query(
    collection(getFirebaseDb(), "workouts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Workout);
}

export async function getWorkoutsInRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Workout[]> {
  const q = query(
    collection(getFirebaseDb(), "workouts"),
    where("userId", "==", userId),
    where("createdAt", ">=", Timestamp.fromDate(startDate)),
    where("createdAt", "<=", Timestamp.fromDate(endDate)),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Workout);
}

export async function getWeeklyWorkouts(userId: string): Promise<Workout[]> {
  const now = new Date();
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return getWorkoutsInRange(userId, weekStart, now);
}

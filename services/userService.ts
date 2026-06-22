import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { User } from "@/types";
import { calculateLevel } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";

export async function getUser(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(getFirebaseDb(), "users", uid));
  if (!userDoc.exists()) return null;
  return userDoc.data() as User;
}

export async function createUser(firebaseUser: FirebaseUser): Promise<User> {
  const nickname =
    firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "동네주민";

  const newUser: Omit<User, "createdAt"> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    nickname,
    profileImage: firebaseUser.photoURL || "",
    level: 1,
    streak: 0,
    totalDistance: 0,
    totalDuration: 0,
    totalWorkoutCount: 0,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(getFirebaseDb(), "users", firebaseUser.uid), newUser);

  return {
    ...newUser,
    createdAt: Timestamp.now(),
  } as User;
}

export async function getOrCreateUser(firebaseUser: FirebaseUser): Promise<User> {
  const existing = await getUser(firebaseUser.uid);
  if (existing) return existing;
  return createUser(firebaseUser);
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<User, "nickname" | "profileImage">>
) {
  await updateDoc(doc(getFirebaseDb(), "users", uid), data);
}

export async function updateUserStats(
  uid: string,
  stats: {
    totalDistance?: number;
    totalDuration?: number;
    totalWorkoutCount?: number;
    streak?: number;
    level?: number;
  }
) {
  const updateData: Record<string, number> = {};
  if (stats.totalDistance !== undefined) updateData.totalDistance = stats.totalDistance;
  if (stats.totalDuration !== undefined) updateData.totalDuration = stats.totalDuration;
  if (stats.totalWorkoutCount !== undefined)
    updateData.totalWorkoutCount = stats.totalWorkoutCount;
  if (stats.streak !== undefined) updateData.streak = stats.streak;
  if (stats.level !== undefined) {
    updateData.level = stats.level;
  } else if (stats.totalDistance !== undefined) {
    updateData.level = calculateLevel(stats.totalDistance);
  }

  await updateDoc(doc(getFirebaseDb(), "users", uid), updateData);
}

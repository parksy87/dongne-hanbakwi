import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  collection,
  deleteDoc,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { DashboardStats, User } from "@/types";
import { getTodayDateString, getWeekStart } from "@/lib/utils";

export async function checkIsAdmin(uid: string): Promise<boolean> {
  const adminDoc = await getDoc(doc(getFirebaseDb(), "admins", uid));
  return adminDoc.exists();
}

export async function bootstrapAdmin(uid: string, email: string): Promise<boolean> {
  const isAdmin = await checkIsAdmin(uid);
  if (isAdmin) return true;

  const allowedEmail = process.env.NEXT_PUBLIC_BOOTSTRAP_ADMIN_EMAIL || "psyr7805@gmail.com";
  if (email !== allowedEmail) return false;

  const { setDoc, serverTimestamp } = await import("firebase/firestore");
  await setDoc(doc(getFirebaseDb(), "admins", uid), {
    email,
    role: "admin",
    createdAt: serverTimestamp(),
  });
  return true;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = getFirebaseDb();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    usersCount,
    todayAttendanceCount,
    pendingInquiriesCount,
    todayWorkoutsSnap,
    weeklyWorkoutsSnap,
  ] = await Promise.all([
    getCountFromServer(collection(db, "users")),
    getCountFromServer(
      query(collection(db, "attendance"), where("date", "==", getTodayDateString()))
    ),
    getCountFromServer(
      query(collection(db, "inquiries"), where("status", "==", "pending"))
    ),
    getDocs(
      query(
        collection(db, "workouts"),
        where("createdAt", ">=", Timestamp.fromDate(todayStart))
      )
    ),
    getDocs(
      query(
        collection(db, "workouts"),
        where("createdAt", ">=", Timestamp.fromDate(getWeekStart()))
      )
    ),
  ]);

  let totalDistance = 0;
  weeklyWorkoutsSnap.docs.forEach((d) => {
    totalDistance += d.data().distance || 0;
  });

  return {
    totalUsers: usersCount.data().count,
    todayAttendance: todayAttendanceCount.data().count,
    todayWorkouts: todayWorkoutsSnap.size,
    pendingInquiries: pendingInquiriesCount.data().count,
    weeklyWorkouts: weeklyWorkoutsSnap.size,
    totalDistance,
  };
}

export async function getAllUsers(limitCount = 100): Promise<User[]> {
  const snapshot = await getDocs(
    query(collection(getFirebaseDb(), "users"), limit(limitCount))
  );
  return snapshot.docs.map((d) => d.data() as User);
}

export async function searchUsers(keyword: string): Promise<User[]> {
  const all = await getAllUsers(200);
  const lower = keyword.toLowerCase();
  return all.filter(
    (u) =>
      u.nickname.toLowerCase().includes(lower) ||
      u.email.toLowerCase().includes(lower) ||
      u.uid.includes(keyword)
  );
}

export async function suspendUser(
  uid: string,
  suspended: boolean,
  reason?: string
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    isSuspended: suspended,
    suspendedReason: reason || "",
  });
}

async function deleteUserCollection(collectionName: string, userId: string) {
  const snap = await getDocs(
    query(
      collection(getFirebaseDb(), collectionName),
      where("userId", "==", userId)
    )
  );
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

/** 운동·출석·배지·통계 초기화 (계정·문의는 유지) */
export async function resetUserActivity(uid: string): Promise<void> {
  await Promise.all([
    deleteUserCollection("workouts", uid),
    deleteUserCollection("attendance", uid),
    deleteUserCollection("badges", uid),
  ]);

  await updateDoc(doc(getFirebaseDb(), "users", uid), {
    level: 1,
    streak: 0,
    totalDistance: 0,
    totalDuration: 0,
    totalWorkoutCount: 0,
  });
}

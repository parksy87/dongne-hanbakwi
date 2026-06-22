import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Badge } from "@/types";
import { BADGE_DEFINITIONS } from "@/lib/constants";

export async function getUserBadges(userId: string): Promise<Badge[]> {
  const q = query(collection(getFirebaseDb(), "badges"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Badge);
}

export async function hasBadge(userId: string, badgeType: string): Promise<boolean> {
  const badges = await getUserBadges(userId);
  return badges.some((b) => b.badgeType === badgeType);
}

export async function awardBadge(userId: string, badgeType: string): Promise<void> {
  const exists = await hasBadge(userId, badgeType);
  if (exists) return;

  await addDoc(collection(getFirebaseDb(), "badges"), {
    userId,
    badgeType,
    createdAt: serverTimestamp(),
  });
}

export async function checkAndAwardBadges(
  userId: string,
  stats: {
    totalDistance: number;
    totalWorkoutCount: number;
    streak: number;
    isFirstAttendance?: boolean;
  }
): Promise<string[]> {
  const awarded: string[] = [];

  const checks: { type: string; condition: boolean }[] = [
    { type: "first_step", condition: stats.totalWorkoutCount >= 1 },
    { type: "first_attendance", condition: stats.isFirstAttendance === true },
    { type: "steady_7", condition: stats.streak >= 7 },
    { type: "walker_30", condition: stats.totalDistance >= 30000 },
    { type: "runner_100", condition: stats.totalDistance >= 100000 },
    { type: "marathoner_500", condition: stats.totalDistance >= 500000 },
  ];

  for (const check of checks) {
    if (check.condition) {
      const exists = await hasBadge(userId, check.type);
      if (!exists) {
        await awardBadge(userId, check.type);
        awarded.push(check.type);
      }
    }
  }

  return awarded;
}

export function getBadgeInfo(badgeType: string) {
  return BADGE_DEFINITIONS.find((b) => b.type === badgeType);
}

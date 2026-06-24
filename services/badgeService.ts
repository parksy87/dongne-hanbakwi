import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { Badge, WorkoutType } from "@/types";
import {
  BADGE_DEFINITIONS,
  BadgeDefinition,
  BadgeProgressStats,
  getBadgeDefinition,
  getStatForCategory,
} from "@/lib/badges";

export async function getUserBadges(userId: string): Promise<Badge[]> {
  const q = query(collection(getFirebaseDb(), "badges"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as Badge);
}

export async function getAllBadges(limitCount = 500): Promise<(Badge & { id: string })[]> {
  const snapshot = await getDocs(
    query(collection(getFirebaseDb(), "badges"), orderBy("createdAt", "desc"), limit(limitCount))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Badge & { id: string });
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

export async function gatherBadgeStats(userId: string): Promise<BadgeProgressStats> {
  const [attendanceSnap, workoutsSnap, userSnap] = await Promise.all([
    getDocs(
      query(collection(getFirebaseDb(), "attendance"), where("userId", "==", userId))
    ),
    getDocs(
      query(collection(getFirebaseDb(), "workouts"), where("userId", "==", userId))
    ),
    getDoc(doc(getFirebaseDb(), "users", userId)),
  ]);

  const attendanceDays = new Set(
    attendanceSnap.docs
      .filter((d) => d.data().status === true)
      .map((d) => d.data().date as string)
  ).size;

  let walkingCount = 0;
  let strollingCount = 0;
  let runningCount = 0;

  workoutsSnap.docs.forEach((d) => {
    const type = d.data().type as WorkoutType;
    if (type === "walking") walkingCount += 1;
    else if (type === "strolling") strollingCount += 1;
    else if (type === "running") runningCount += 1;
  });

  const userData = userSnap.exists() ? userSnap.data() : null;
  const totalDistance = userData?.totalDistance ?? 0;

  return {
    attendanceDays,
    totalDistance,
    walkingCount,
    strollingCount,
    runningCount,
  };
}

function meetsThreshold(definition: BadgeDefinition, stats: BadgeProgressStats): boolean {
  return getStatForCategory(definition.category, stats) >= definition.threshold;
}

export async function checkAndAwardBadges(
  userId: string,
  stats?: BadgeProgressStats
): Promise<string[]> {
  const progress = stats ?? (await gatherBadgeStats(userId));
  const existing = await getUserBadges(userId);
  const earnedTypes = new Set(existing.map((b) => b.badgeType));
  const awarded: string[] = [];

  for (const definition of BADGE_DEFINITIONS) {
    if (!meetsThreshold(definition, progress)) continue;
    if (earnedTypes.has(definition.type)) continue;
    await awardBadge(userId, definition.type);
    awarded.push(definition.type);
  }

  return awarded;
}

export function getBadgeInfo(badgeType: string) {
  return getBadgeDefinition(badgeType);
}

export { BADGE_DEFINITIONS };

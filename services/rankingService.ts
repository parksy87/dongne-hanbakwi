import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { RankingEntry } from "@/types";
import { getWeekStart, getMonthStart } from "@/lib/utils";
import { doc, getDoc } from "firebase/firestore";

import { getExcludedUserIds } from "./rankingExclusionService";

type Period = "weekly" | "monthly";

async function getUserInfo(userId: string) {
  const userDoc = await getDoc(doc(getFirebaseDb(), "users", userId));
  if (!userDoc.exists()) return { nickname: "익명", profileImage: "" };
  const data = userDoc.data();
  return { nickname: data.nickname, profileImage: data.profileImage };
}

export async function getRanking(period: Period): Promise<RankingEntry[]> {
  const startDate =
    period === "weekly" ? getWeekStart() : getMonthStart();

  const q = query(
    collection(getFirebaseDb(), "workouts"),
    where("createdAt", ">=", Timestamp.fromDate(startDate))
  );
  const snapshot = await getDocs(q);

  const distanceMap = new Map<string, number>();
  snapshot.docs.forEach((d) => {
    const data = d.data();
    const current = distanceMap.get(data.userId) || 0;
    distanceMap.set(data.userId, current + (data.distance || 0));
  });

  const excludedIds = await getExcludedUserIds();

  const entries: RankingEntry[] = [];
  for (const [userId, totalDistance] of distanceMap) {
    if (excludedIds.has(userId)) continue;
    const userInfo = await getUserInfo(userId);
    entries.push({
      userId,
      nickname: userInfo.nickname,
      profileImage: userInfo.profileImage,
      totalDistance,
      rank: 0,
    });
  }

  entries.sort((a, b) => b.totalDistance - a.totalDistance);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

export async function getMyRank(
  userId: string,
  period: Period
): Promise<RankingEntry | null> {
  const ranking = await getRanking(period);
  return ranking.find((r) => r.userId === userId) || null;
}

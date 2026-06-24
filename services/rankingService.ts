import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { RankingEntry, RankingQuery, UserRegion } from "@/types";
import { getPeriodStartDate, getPeriodStartDateString } from "@/lib/utils";
import { getExcludedUserIds } from "./rankingExclusionService";
import { getUserIdsByRegion } from "./regionService";
import { getGroupMemberIds } from "./groupService";

async function resolveAllowedUserIds(
  scope: RankingQuery["scope"],
  region?: UserRegion,
  groupId?: string
): Promise<Set<string> | null> {
  if (scope === "region" && region) {
    return getUserIdsByRegion(region);
  }
  if (scope === "group" && groupId) {
    const memberIds = await getGroupMemberIds(groupId);
    return new Set(memberIds);
  }
  return null;
}

function passesScopeFilter(
  userId: string,
  allowedIds: Set<string> | null
): boolean {
  if (!allowedIds) return true;
  return allowedIds.has(userId);
}

async function aggregateDistanceScores(
  period: RankingQuery["period"],
  allowedIds: Set<string> | null
): Promise<Map<string, number>> {
  const startDate = getPeriodStartDate(period);
  const q = query(
    collection(getFirebaseDb(), "workouts"),
    where("createdAt", ">=", Timestamp.fromDate(startDate))
  );
  const snapshot = await getDocs(q);

  const scoreMap = new Map<string, number>();
  snapshot.docs.forEach((d) => {
    const data = d.data();
    const userId = data.userId as string;
    if (!passesScopeFilter(userId, allowedIds)) return;
    scoreMap.set(userId, (scoreMap.get(userId) || 0) + (data.distance || 0));
  });

  return scoreMap;
}

async function aggregateAttendanceScores(
  period: RankingQuery["period"],
  allowedIds: Set<string> | null
): Promise<Map<string, number>> {
  const startDateStr = getPeriodStartDateString(period);
  const q = query(
    collection(getFirebaseDb(), "attendance"),
    where("date", ">=", startDateStr)
  );
  const snapshot = await getDocs(q);

  const scoreMap = new Map<string, number>();
  snapshot.docs.forEach((d) => {
    const data = d.data();
    if (!data.status) return;
    const userId = data.userId as string;
    if (!passesScopeFilter(userId, allowedIds)) return;
    scoreMap.set(userId, (scoreMap.get(userId) || 0) + 1);
  });

  return scoreMap;
}

async function buildRankingEntries(
  scoreMap: Map<string, number>,
  metric: RankingQuery["metric"]
): Promise<RankingEntry[]> {
  const excludedIds = await getExcludedUserIds();
  const entries: RankingEntry[] = [];

  for (const [userId, score] of scoreMap) {
    if (excludedIds.has(userId)) continue;

    const userDoc = await getDoc(doc(getFirebaseDb(), "users", userId));
    if (!userDoc.exists() || userDoc.data().excludeFromRanking) continue;

    const data = userDoc.data();
    entries.push({
      userId,
      nickname: data.nickname || "익명",
      profileImage: data.profileImage || "",
      totalDistance: metric === "distance" ? score : 0,
      attendanceCount: metric === "attendance" ? score : 0,
      rank: 0,
    });
  }

  entries.sort((a, b) => {
    const aScore = metric === "distance" ? a.totalDistance : a.attendanceCount;
    const bScore = metric === "distance" ? b.totalDistance : b.attendanceCount;
    return bScore - aScore;
  });

  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

export async function getRanking(options: RankingQuery): Promise<RankingEntry[]> {
  const scope = options.scope ?? "global";
  const allowedIds = await resolveAllowedUserIds(
    scope,
    options.region,
    options.groupId
  );

  if (scope === "region" && options.region && allowedIds?.size === 0) {
    return [];
  }
  if (scope === "group" && options.groupId && allowedIds?.size === 0) {
    return [];
  }

  const scoreMap =
    options.metric === "distance"
      ? await aggregateDistanceScores(options.period, allowedIds)
      : await aggregateAttendanceScores(options.period, allowedIds);

  return buildRankingEntries(scoreMap, options.metric);
}

export async function getMyRank(
  userId: string,
  options: RankingQuery
): Promise<RankingEntry | null> {
  const ranking = await getRanking(options);
  return ranking.find((r) => r.userId === userId) || null;
}

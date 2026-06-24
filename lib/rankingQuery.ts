import { RankingMetric, RankingPeriod, RankingQuery, UserRegion } from "@/types";

export function buildGlobalRankingQuery(
  metric: RankingMetric,
  period: RankingPeriod
): RankingQuery {
  return { metric, period, scope: "global" };
}

/** 지역 랭킹 UI 연동 전 백엔드용 */
export function buildRegionRankingQuery(
  metric: RankingMetric,
  period: RankingPeriod,
  region: UserRegion
): RankingQuery {
  return { metric, period, scope: "region", region };
}

/** 그룹 랭킹 UI 연동 전 백엔드용 */
export function buildGroupRankingQuery(
  metric: RankingMetric,
  period: RankingPeriod,
  groupId: string
): RankingQuery {
  return { metric, period, scope: "group", groupId };
}

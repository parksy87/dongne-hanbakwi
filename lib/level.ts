import {
  BadgeCategory,
  BadgeProgressStats,
  getBadgesByCategory,
  isBadgeEarned,
} from "@/lib/badges";

export interface LevelBreakdown {
  level: number;
  attendanceTier: number;
  distanceTier: number;
  workoutTier: number;
  tierSum: number;
  progressPercent: number;
  pointsToNextLevel: number;
  isMaxLevel: boolean;
}

export function getCategoryTier(
  category: BadgeCategory,
  stats: BadgeProgressStats
): number {
  const badges = getBadgesByCategory(category);
  let tier = 0;
  for (const badge of badges) {
    if (isBadgeEarned(badge, stats)) {
      tier = Math.max(tier, badge.tier);
    }
  }
  return tier;
}

export function getWorkoutCombinedTier(stats: BadgeProgressStats): number {
  return Math.max(
    getCategoryTier("walking", stats),
    getCategoryTier("strolling", stats),
    getCategoryTier("running", stats)
  );
}

export function getTierSum(stats: BadgeProgressStats): number {
  return (
    getCategoryTier("attendance", stats) +
    getCategoryTier("distance", stats) +
    getWorkoutCombinedTier(stats)
  );
}

/** 출석 tier + 거리 tier + max(걷기·산책·러닝 tier) 합을 3으로 나눈 종합 레벨 (1~10) */
export function calculateCompositeLevel(stats: BadgeProgressStats): number {
  const sum = getTierSum(stats);
  return Math.min(10, Math.max(1, Math.ceil(sum / 3)));
}

function minTierSumForLevel(level: number): number {
  if (level <= 1) return 0;
  return (level - 1) * 3 + 1;
}

function minTierSumForNextLevel(level: number): number {
  if (level >= 10) return 30;
  return level * 3 + 1;
}

export function getLevelBreakdown(stats: BadgeProgressStats): LevelBreakdown {
  const attendanceTier = getCategoryTier("attendance", stats);
  const distanceTier = getCategoryTier("distance", stats);
  const workoutTier = getWorkoutCombinedTier(stats);
  const tierSum = attendanceTier + distanceTier + workoutTier;
  const level = calculateCompositeLevel(stats);
  const isMaxLevel = level >= 10;

  const currentMin = minTierSumForLevel(level);
  const nextMin = minTierSumForNextLevel(level);
  const span = nextMin - currentMin;
  const progressPercent = isMaxLevel
    ? 100
    : span > 0
      ? Math.min(100, Math.round(((tierSum - currentMin) / span) * 100))
      : 0;
  const pointsToNextLevel = isMaxLevel ? 0 : Math.max(0, nextMin - tierSum);

  return {
    level,
    attendanceTier,
    distanceTier,
    workoutTier,
    tierSum,
    progressPercent,
    pointsToNextLevel,
    isMaxLevel,
  };
}

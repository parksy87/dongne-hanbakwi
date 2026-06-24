export type BadgeCategory =
  | "attendance"
  | "distance"
  | "walking"
  | "strolling"
  | "running";

export interface BadgeDefinition {
  type: string;
  category: BadgeCategory;
  tier: number;
  threshold: number;
  name: string;
  description: string;
  icon: string;
}

export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  attendance: "출석",
  distance: "누적 거리",
  walking: "걷기",
  strolling: "산책",
  running: "러닝",
};

export const BADGE_CATEGORY_ORDER: BadgeCategory[] = [
  "attendance",
  "distance",
  "walking",
  "strolling",
  "running",
];

const ATTENDANCE_THRESHOLDS = [1, 3, 7, 14, 30, 50, 75, 100, 200, 365];
const DISTANCE_THRESHOLDS = [
  1_000, 5_000, 10_000, 30_000, 50_000, 100_000, 200_000, 300_000, 500_000,
  1_000_000,
];
const WORKOUT_COUNT_THRESHOLDS = [1, 3, 5, 10, 20, 30, 50, 75, 100, 200];

const ATTENDANCE_ICONS = ["✅", "📅", "🔥", "⭐", "🌟", "💫", "🏅", "🎖️", "👑", "🏆"];
const DISTANCE_ICONS = [
  "👣",
  "🚶",
  "🚶‍♂️",
  "🌳",
  "🛤️",
  "🏃",
  "🏃‍♂️",
  "🗺️",
  "⛰️",
  "🏆",
];

function formatKm(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    return Number.isInteger(km) ? `${km}km` : `${km}km`;
  }
  return `${meters}m`;
}

function buildAttendanceBadges(): BadgeDefinition[] {
  return ATTENDANCE_THRESHOLDS.map((threshold, i) => ({
    type: `attend_${threshold}`,
    category: "attendance" as const,
    tier: i + 1,
    threshold,
    name: threshold === 1 ? "첫 출석" : `${threshold}일 출석`,
    description: `누적 출석 ${threshold}일 달성`,
    icon: ATTENDANCE_ICONS[i],
  }));
}

function buildDistanceBadges(): BadgeDefinition[] {
  return DISTANCE_THRESHOLDS.map((threshold, i) => ({
    type: `dist_${threshold}`,
    category: "distance" as const,
    tier: i + 1,
    threshold,
    name: `${formatKm(threshold)} 돌파`,
    description: `누적 거리 ${formatKm(threshold)} 달성`,
    icon: DISTANCE_ICONS[i],
  }));
}

function buildWorkoutTypeBadges(
  category: "walking" | "strolling" | "running",
  prefix: string,
  label: string,
  icons: string[]
): BadgeDefinition[] {
  return WORKOUT_COUNT_THRESHOLDS.map((threshold, i) => ({
    type: `${prefix}_${threshold}`,
    category,
    tier: i + 1,
    threshold,
    name: threshold === 1 ? `첫 ${label}` : `${label} ${threshold}회`,
    description: `${label} ${threshold}회 완료`,
    icon: icons[i],
  }));
}

const WALKING_ICONS = ["👣", "🚶", "🚶‍♂️", "🚶‍♀️", "🌿", "🌲", "🛤️", "🏘️", "🌄", "🏆"];
const STROLLING_ICONS = ["🐾", "🌸", "🌼", "🌻", "🍃", "🌳", "🪴", "☀️", "🌈", "🏆"];
const RUNNING_ICONS = ["🏃", "💨", "⚡", "🔥", "🎯", "📈", "💪", "🚀", "⭐", "🏆"];

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  ...buildAttendanceBadges(),
  ...buildDistanceBadges(),
  ...buildWorkoutTypeBadges("walking", "walk", "걷기", WALKING_ICONS),
  ...buildWorkoutTypeBadges("strolling", "stroll", "산책", STROLLING_ICONS),
  ...buildWorkoutTypeBadges("running", "run", "러닝", RUNNING_ICONS),
];

export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((b) => b.category === category);
}

export function getBadgeDefinition(type: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.type === type);
}

export interface BadgeProgressStats {
  attendanceDays: number;
  totalDistance: number;
  walkingCount: number;
  strollingCount: number;
  runningCount: number;
}

export function getStatForCategory(
  category: BadgeCategory,
  stats: BadgeProgressStats
): number {
  switch (category) {
    case "attendance":
      return stats.attendanceDays;
    case "distance":
      return stats.totalDistance;
    case "walking":
      return stats.walkingCount;
    case "strolling":
      return stats.strollingCount;
    case "running":
      return stats.runningCount;
  }
}

export function isBadgeEarned(
  definition: BadgeDefinition,
  stats: BadgeProgressStats
): boolean {
  return getStatForCategory(definition.category, stats) >= definition.threshold;
}

export function formatProgressLabel(
  definition: BadgeDefinition,
  stats: BadgeProgressStats
): string {
  const current = getStatForCategory(definition.category, stats);
  const target = definition.threshold;

  if (definition.category === "distance") {
    return `${formatKm(current)} / ${formatKm(target)}`;
  }
  if (definition.category === "attendance") {
    return `${Math.min(current, target)} / ${target}일`;
  }
  return `${Math.min(current, target)} / ${target}회`;
}

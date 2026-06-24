import { ATTENDANCE_RULES, ATTENDANCE_RULE_LIMITS } from "@/lib/constants";
import { AttendanceRules, User, WorkoutType } from "@/types";

export function getDefaultAttendanceRules(): AttendanceRules {
  return {
    walking: { ...ATTENDANCE_RULES.walking },
    strolling: { ...ATTENDANCE_RULES.strolling },
    running: { ...ATTENDANCE_RULES.running },
  };
}

export function resolveUserAttendanceRules(user: User | null | undefined): AttendanceRules {
  if (user?.attendanceRules) return user.attendanceRules;
  return getDefaultAttendanceRules();
}

export function clampAttendanceRules(rules: AttendanceRules): AttendanceRules {
  const clamp = (type: WorkoutType) => ({
    minDuration: Math.min(
      ATTENDANCE_RULE_LIMITS.maxDurationSec,
      Math.max(ATTENDANCE_RULE_LIMITS.minDurationSec, rules[type].minDuration)
    ),
    minDistance: Math.min(
      ATTENDANCE_RULE_LIMITS.maxDistanceM,
      Math.max(ATTENDANCE_RULE_LIMITS.minDistanceM, rules[type].minDistance)
    ),
  });

  return {
    walking: clamp("walking"),
    strolling: clamp("strolling"),
    running: clamp("running"),
  };
}

export function formatAttendanceRuleSummary(rules: AttendanceRules): string {
  const walking = rules.walking;
  const running = rules.running;
  const walkMin = Math.round(walking.minDuration / 60);
  const runMin = Math.round(running.minDuration / 60);
  return `걷기/산책: ${walkMin}분 또는 ${walking.minDistance}m\n러닝: ${runMin}분 또는 ${running.minDistance}m\n조건을 충족하면 자동 출석!`;
}

export function checkAttendanceEligibility(
  type: WorkoutType,
  duration: number,
  distance: number,
  rules: AttendanceRules
): boolean {
  const rule = rules[type];
  return duration >= rule.minDuration || distance >= rule.minDistance;
}

export interface AttendancePreview {
  eligible: boolean;
  alreadyAttended: boolean;
  willAttend: boolean;
  durationMet: boolean;
  distanceMet: boolean;
  remainingDuration: number;
  remainingDistance: number;
  goalDuration: number;
  goalDistance: number;
}

export function getAttendancePreview(
  type: WorkoutType,
  duration: number,
  distance: number,
  rules: AttendanceRules,
  alreadyAttended: boolean
): AttendancePreview {
  const rule = rules[type];
  const durationMet = duration >= rule.minDuration;
  const distanceMet = distance >= rule.minDistance;
  const eligible = durationMet || distanceMet;

  return {
    eligible,
    alreadyAttended,
    willAttend: eligible && !alreadyAttended,
    durationMet,
    distanceMet,
    remainingDuration: Math.max(0, rule.minDuration - duration),
    remainingDistance: Math.max(0, rule.minDistance - distance),
    goalDuration: rule.minDuration,
    goalDistance: rule.minDistance,
  };
}

export function formatGoalLabel(type: WorkoutType, rules: AttendanceRules): string {
  const rule = rules[type];
  const min = Math.round(rule.minDuration / 60);
  return `${min}분 또는 ${rule.minDistance}m`;
}

export const DEFAULT_WEEKLY_ATTENDANCE_GOAL = 5;

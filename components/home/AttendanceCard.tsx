"use client";

import Card from "@/components/ui/Card";
import { AttendanceRules, WorkoutType } from "@/types";
import {
  getAttendancePreview,
  formatGoalLabel,
} from "@/lib/attendanceRules";
import { formatDistance, formatDuration, getWeekStart } from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";

interface AttendanceCardProps {
  isAttended: boolean;
  streak: number;
  rules: AttendanceRules;
  weeklyAttendanceCount: number;
  weeklyGoal: number;
  todayBest?: {
    type: WorkoutType;
    duration: number;
    distance: number;
  } | null;
}

export default function AttendanceCard({
  isAttended,
  streak,
  rules,
  weeklyAttendanceCount,
  weeklyGoal,
  todayBest,
}: AttendanceCardProps) {
  const preview = todayBest
    ? getAttendancePreview(
        todayBest.type,
        todayBest.duration,
        todayBest.distance,
        rules,
        isAttended
      )
    : null;

  return (
    <Card className="mb-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">오늘 출석</p>
          <p className="text-xl font-bold text-secondary">
            {isAttended ? (
              <span className="text-success">✅ 출석 완료</span>
            ) : (
              <span>아직 미출석</span>
            )}
          </p>
        </div>
        {streak > 0 && (
          <div className="bg-primary/20 px-4 py-2 rounded-2xl shrink-0">
            <p className="text-sm font-bold text-secondary">
              🔥 {streak}일 연속
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>이번 주 출석</span>
          <span>
            {weeklyAttendanceCount}/{weeklyGoal}일
          </span>
        </div>
        <div className="h-2 bg-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{
              width: `${Math.min(100, (weeklyAttendanceCount / weeklyGoal) * 100)}%`,
            }}
          />
        </div>
      </div>

      {!isAttended && todayBest && preview && !preview.eligible && (
        <div className="text-sm text-gray-600 bg-gray/60 rounded-xl p-3">
          <p className="font-medium text-secondary mb-1">
            오늘 {WORKOUT_TYPE_LABELS[todayBest.type]} 기록 기준
          </p>
          <p>
            목표: {formatGoalLabel(todayBest.type, rules)}
          </p>
          {!preview.durationMet && (
            <p>시간 {formatDuration(preview.remainingDuration)} 더 필요</p>
          )}
          {!preview.distanceMet && (
            <p>거리 {formatDistance(preview.remainingDistance)} 더 필요</p>
          )}
          <p className="text-xs text-gray-500 mt-1">시간 또는 거리 중 하나만 충족하면 됩니다.</p>
        </div>
      )}

      {!isAttended && !todayBest && (
        <p className="text-sm text-gray-500">
          운동을 시작하면 출석 목표까지 진행 상황이 표시됩니다.
        </p>
      )}
    </Card>
  );
}

export function countWeeklyAttendance(
  attendance: { date: string; status: boolean }[],
  weekStart = getWeekStart(new Date())
): number {
  const startStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
  return attendance.filter((a) => a.status && a.date >= startStr).length;
}

export function getTodayBestWorkout(
  workouts: {
    type: WorkoutType;
    duration: number;
    distance: number;
    createdAt?: { toDate?: () => Date };
  }[]
) {
  if (workouts.length === 0) return null;
  return workouts.reduce((best, w) =>
    w.duration > best.duration || w.distance > best.distance ? w : best
  );
}

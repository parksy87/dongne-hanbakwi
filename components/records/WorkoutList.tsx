"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PendingWorkout, Workout } from "@/types";
import {
  formatDistance,
  formatPace,
  formatDate,
  formatWorkoutTimer,
} from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

const PERIOD_LABELS: Record<string, string> = {
  weekly: "이번 주",
  monthly: "이번 달",
  yearly: "올해",
};

interface WorkoutListProps {
  workouts: Workout[];
  totalCount?: number;
  period?: string;
  pendingWorkout?: PendingWorkout | null;
}

function WorkoutEmptyState({
  totalCount = 0,
  period = "weekly",
  pendingWorkout,
}: {
  totalCount?: number;
  period?: string;
  pendingWorkout?: PendingWorkout | null;
}) {
  const router = useRouter();
  const periodLabel = PERIOD_LABELS[period] ?? "이 기간";
  const hasOtherRecords = totalCount > 0;

  return (
    <Card className="text-center py-8 px-4">
      <p className="font-bold text-secondary">
        {hasOtherRecords
          ? `${periodLabel} 운동 기록이 없어요`
          : "아직 운동 기록이 없어요"}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {hasOtherRecords
          ? "다른 기간을 선택하거나 오늘 동네 한 바퀴 돌아보세요!"
          : "오늘 동네 한 바퀴 돌아보세요!"}
      </p>

      <p className="text-3xl font-bold text-secondary tabular-nums tracking-wide mt-6">
        {formatWorkoutTimer(pendingWorkout?.duration ?? 0)}
      </p>
      <p className="text-xs text-gray-500 mt-1">운동 시간</p>

      <div className="mt-6 flex flex-col gap-2">
        {pendingWorkout && (
          <Button
            size="lg"
            fullWidth
            onClick={() =>
              router.push(`/workout?type=${pendingWorkout.type}&resume=1`)
            }
          >
            이어하기
          </Button>
        )}
        <Button
          variant={pendingWorkout ? "outline" : "primary"}
          size="lg"
          fullWidth
          onClick={() => router.push("/")}
        >
          운동 시작하기
        </Button>
      </div>
    </Card>
  );
}

export default function WorkoutList({
  workouts,
  totalCount = 0,
  period = "weekly",
  pendingWorkout,
}: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <WorkoutEmptyState
        totalCount={totalCount}
        period={period}
        pendingWorkout={pendingWorkout}
      />
    );
  }

  return (
    <div className="space-y-3">
      {workouts.map((workout) => {
        const date = workout.createdAt?.toDate?.();
        const dateStr = date
          ? formatDate(
              `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
            )
          : "";

        return (
          <Link key={workout.id} href={`/records/${workout.id}`}>
            <Card className="flex items-center justify-between hover:bg-gray/50 transition-colors">
              <div>
                <p className="font-bold text-secondary">
                  {WORKOUT_TYPE_LABELS[workout.type]}
                </p>
                <p className="text-sm text-gray-500">{dateStr}</p>
                <p className="text-lg font-bold text-secondary tabular-nums tracking-wide mt-1">
                  {formatWorkoutTimer(workout.duration)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold text-secondary">
                    {formatDistance(workout.distance)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPace(workout.pace)}
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

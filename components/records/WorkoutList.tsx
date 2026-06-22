"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { Workout } from "@/types";
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatDate,
} from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";

interface WorkoutListProps {
  workouts: Workout[];
}

export default function WorkoutList({ workouts }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">
          아직 운동 기록이 없습니다.
          <br />
          오늘 동네 한 바퀴 돌아보세요!
        </p>
      </Card>
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-xl">
                  {workout.type === "running"
                    ? "🏃"
                    : workout.type === "strolling"
                      ? "🌳"
                      : "🚶"}
                </div>
                <div>
                  <p className="font-bold text-secondary">
                    {WORKOUT_TYPE_LABELS[workout.type]}
                  </p>
                  <p className="text-sm text-gray-500">{dateStr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-semibold text-secondary">
                    {formatDistance(workout.distance)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDuration(workout.duration)} ·{" "}
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

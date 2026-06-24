"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PendingWorkout } from "@/types";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { formatDistance, formatWorkoutTimer } from "@/lib/utils";

interface PendingWorkoutBannerProps {
  pending: PendingWorkout;
  onDiscard?: () => void;
}

export default function PendingWorkoutBanner({
  pending,
  onDiscard,
}: PendingWorkoutBannerProps) {
  const router = useRouter();

  return (
    <Card className="mb-4 space-y-3">
      <div>
        <p className="text-sm font-bold text-secondary">이어할 운동이 있어요</p>
        <p className="text-xs text-gray-500 mt-1">
          {WORKOUT_TYPE_LABELS[pending.type]} · 출석 목표 미달
        </p>
      </div>
      <p className="text-2xl font-bold text-secondary tabular-nums tracking-wide">
        {formatWorkoutTimer(pending.duration)}
      </p>
      <p className="text-xs text-gray-500 -mt-2">
        {formatDistance(pending.distance)} 기록됨
      </p>
      <div className="flex gap-2">
        <Button
          size="md"
          className="flex-1"
          onClick={() =>
            router.push(`/workout?type=${pending.type}&resume=1`)
          }
        >
          이어하기
        </Button>
        {onDiscard && (
          <Button variant="outline" size="md" onClick={onDiscard}>
            삭제
          </Button>
        )}
      </div>
    </Card>
  );
}

"use client";

import Card from "@/components/ui/Card";
import { AttendancePreview } from "@/lib/attendanceRules";
import { formatDistance, formatDuration } from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { WorkoutType } from "@/types";

interface WorkoutAttendancePreviewProps {
  type: WorkoutType;
  preview: AttendancePreview;
}

export default function WorkoutAttendancePreview({
  type,
  preview,
}: WorkoutAttendancePreviewProps) {
  if (preview.alreadyAttended) {
    return (
      <Card className="mb-4 bg-success/10 border-2 border-success/30">
        <p className="font-bold text-success">✅ 오늘 출석은 이미 완료했어요</p>
        <p className="text-sm text-gray-600 mt-1">운동 기록만 저장됩니다.</p>
      </Card>
    );
  }

  if (preview.willAttend) {
    return (
      <Card className="mb-4 bg-success/10 border-2 border-success/30">
        <p className="font-bold text-success">✅ 저장 시 오늘 출석 완료!</p>
        <p className="text-sm text-gray-600 mt-1">
          {WORKOUT_TYPE_LABELS[type]} 목표를 충족했습니다.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mb-4 bg-primary/10 border-2 border-primary/30">
      <p className="font-bold text-secondary">출석까지 조금 더!</p>
      <p className="text-sm text-gray-600 mt-2">
        {WORKOUT_TYPE_LABELS[type]} 목표:{" "}
        {formatDuration(preview.goalDuration)} 또는{" "}
        {formatDistance(preview.goalDistance)}
      </p>
      <ul className="text-sm text-gray-600 mt-2 space-y-1">
        {!preview.durationMet && (
          <li>· 시간 {formatDuration(preview.remainingDuration)} 더 필요</li>
        )}
        {!preview.distanceMet && (
          <li>· 거리 {formatDistance(preview.remainingDistance)} 더 필요</li>
        )}
      </ul>
      <p className="text-xs text-gray-500 mt-2">
        시간 또는 거리 중 하나만 충족하면 출석됩니다. 기록은 저장할 수 있어요.
      </p>
    </Card>
  );
}

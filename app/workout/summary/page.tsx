"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import WorkoutMap from "@/components/map/WorkoutMap";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useAttendanceRules } from "@/hooks/useAppSettings";
import { completeWorkout } from "@/services/workoutCompleteService";
import { toastSuccess, toastError } from "@/stores/toastStore";
import {
  formatDistance,
  formatDuration,
  formatPace,
} from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { WorkoutType, RoutePoint } from "@/types";

interface SummaryData {
  type: WorkoutType;
  route: RoutePoint[];
  distance: number;
  duration: number;
  pace: number;
  calories: number;
}

export default function WorkoutSummaryPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { reset } = useWorkoutStore();
  const attendanceRules = useAttendanceRules();
  const [memo, setMemo] = useState("");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("workoutSummary");
    if (stored) {
      setSummary(JSON.parse(stored));
    } else {
      router.replace("/");
    }
  }, [router]);

  const handleSave = async () => {
    if (!summary || !user) return;
    setIsSaving(true);

    try {
      const result = await completeWorkout({
        userId: user.uid,
        type: summary.type,
        distance: summary.distance,
        duration: summary.duration,
        pace: summary.pace,
        calories: summary.calories,
        memo,
        route: summary.route,
        attendanceRules,
      });

      setUser(result.updatedUser);

      if (result.attended) {
        toastSuccess("출석 완료! 오늘도 수고하셨어요.");
      } else {
        toastSuccess("운동 기록이 저장되었습니다.");
      }

      sessionStorage.removeItem("workoutSummary");
      reset();
      router.replace("/");
    } catch (error) {
      console.error("Save failed:", error);
      toastError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!summary) return null;

  const stats = [
    { label: "총 거리", value: formatDistance(summary.distance) },
    { label: "총 운동시간", value: formatDuration(summary.duration) },
    { label: "평균 페이스", value: formatPace(summary.pace) },
    { label: "칼로리", value: `${summary.calories}kcal` },
  ];

  return (
    <AuthGuard>
      <div className="page-container">
        <h1 className="text-2xl font-bold text-secondary mb-2">운동 완료!</h1>
        <p className="text-gray-500 mb-6">
          {WORKOUT_TYPE_LABELS[summary.type]} · 수고하셨습니다 👏
        </p>

        <Card className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-secondary">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <WorkoutMap
          route={summary.route}
          className="h-48 mb-4"
          showCurrentPosition={false}
        />

        <Card className="mb-6">
          <label className="text-sm font-bold text-secondary mb-2 block">
            메모
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 운동은 어땠나요?"
            className="w-full p-3 bg-gray rounded-xl text-secondary resize-none h-20 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </Card>

        <Button
          size="xl"
          fullWidth
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </AuthGuard>
  );
}

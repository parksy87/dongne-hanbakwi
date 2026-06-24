"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import WorkoutStats from "@/components/workout/WorkoutStats";
import WorkoutMap from "@/components/map/WorkoutMap";
import Button from "@/components/ui/Button";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useAuthStore } from "@/stores/authStore";
import { useGeolocationTracking } from "@/hooks/useGeolocation";
import { useWorkoutSessionNative } from "@/hooks/useWorkoutSessionNative";
import { useTodayAttendance } from "@/hooks/useWorkouts";
import {
  getAttendancePreview,
  resolveUserAttendanceRules,
} from "@/lib/attendanceRules";
import { formatDistance, formatWorkoutTimer } from "@/lib/utils";
import { getPendingWorkout, clearPendingWorkout } from "@/lib/pendingWorkout";
import { WorkoutType } from "@/types";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import WorkoutGpsNotice from "@/components/workout/WorkoutGpsNotice";
import { Pause, Play, Square } from "lucide-react";

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as WorkoutType;
  const isResume = searchParams.get("resume") === "1";

  const { user } = useAuthStore();
  const {
    route,
    distance,
    duration,
    pace,
    calories,
    isPaused,
    isActive,
    startWorkout,
    resumeWorkout,
    pause,
    resume,
    stop,
  } = useWorkoutStore();

  const rules = resolveUserAttendanceRules(user);
  const { data: isAttendedToday = false } = useTodayAttendance(user?.uid);
  const attendancePreview =
    type && !isAttendedToday
      ? getAttendancePreview(type, duration, distance, rules, isAttendedToday)
      : null;

  useGeolocationTracking(isActive && !isPaused);
  useWorkoutSessionNative(isActive);

  useEffect(() => {
    if (!type || isActive) return;

    if (isResume && user?.uid) {
      const pending = getPendingWorkout(user.uid);
      if (pending && pending.type === type) {
        resumeWorkout(pending);
        return;
      }
    }

    if (user?.uid) {
      clearPendingWorkout(user.uid);
    }
    startWorkout(type);
  }, [type, isActive, isResume, user?.uid, startWorkout, resumeWorkout]);

  const handleStop = () => {
    stop();
    sessionStorage.setItem(
      "workoutSummary",
      JSON.stringify({
        type,
        route,
        distance,
        duration,
        pace,
        calories,
      })
    );
    router.push("/workout/summary");
  };

  if (!type) {
    router.replace("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray">
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-secondary">
          {WORKOUT_TYPE_LABELS[type]}
        </h1>
        <span className="text-sm text-gray-500">
          {isPaused ? "일시정지" : isResume ? "이어하기" : "운동 중"}
        </span>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <WorkoutGpsNotice />
        {attendancePreview && !attendancePreview.eligible && (
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-3 text-sm">
            <p className="font-medium text-secondary">
              출석 목표: {formatWorkoutTimer(attendancePreview.goalDuration)} 또는{" "}
              {formatDistance(attendancePreview.goalDistance)}
            </p>
            <p className="text-gray-600 mt-1">
              {!attendancePreview.durationMet &&
                `시간 ${formatWorkoutTimer(attendancePreview.remainingDuration)} 더 · `}
              {!attendancePreview.distanceMet &&
                `거리 ${formatDistance(attendancePreview.remainingDistance)} 더`}
            </p>
          </div>
        )}
        {attendancePreview?.eligible && (
          <div className="bg-success/10 border border-success/30 rounded-2xl p-3 text-sm font-medium text-success">
            출석 목표 충족! 운동 종료 후 저장하면 출석됩니다.
          </div>
        )}
        <WorkoutStats
          duration={duration}
          distance={distance}
          pace={pace}
          calories={calories}
        />

        <WorkoutMap route={route} className="h-[40vh]" />
      </div>

      <div className="bg-white px-4 py-6 safe-bottom flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 flex items-center gap-2"
          onClick={isPaused ? resume : pause}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          {isPaused ? "재개" : "일시정지"}
        </Button>
        <Button
          variant="danger"
          size="lg"
          className="flex-1 flex items-center gap-2"
          onClick={handleStop}
        >
          <Square size={20} />
          운동종료
        </Button>
      </div>
    </div>
  );
}

export default function WorkoutPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩...</div>}>
        <WorkoutContent />
      </Suspense>
    </AuthGuard>
  );
}

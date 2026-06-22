"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import WorkoutStats from "@/components/workout/WorkoutStats";
import WorkoutMap from "@/components/map/WorkoutMap";
import Button from "@/components/ui/Button";
import { useWorkoutStore } from "@/stores/workoutStore";
import { useGeolocationTracking } from "@/hooks/useGeolocation";
import { WorkoutType } from "@/types";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { Pause, Play, Square } from "lucide-react";

function WorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as WorkoutType;

  const {
    route,
    distance,
    duration,
    pace,
    calories,
    isPaused,
    isActive,
    startWorkout,
    pause,
    resume,
    stop,
  } = useWorkoutStore();

  useGeolocationTracking(isActive && !isPaused);

  useEffect(() => {
    if (type && !isActive) {
      startWorkout(type);
    }
  }, [type, isActive, startWorkout]);

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
          {isPaused ? "일시정지" : "운동 중"}
        </span>
      </div>

      <div className="flex-1 p-4 space-y-4">
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

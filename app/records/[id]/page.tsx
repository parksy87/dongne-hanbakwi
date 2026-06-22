"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import WorkoutMap from "@/components/map/WorkoutMap";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getWorkout } from "@/services/workoutService";
import { Workout } from "@/types";
import {
  formatDistance,
  formatDuration,
  formatPace,
  formatDate,
} from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getWorkout(params.id as string);
      setWorkout(data);
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">운동 기록을 찾을 수 없습니다.</p>
        <Button onClick={() => router.back()}>돌아가기</Button>
      </div>
    );
  }

  const date = workout.createdAt?.toDate?.();
  const dateStr = date
    ? formatDate(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      )
    : "";

  const stats = [
    { label: "총 거리", value: formatDistance(workout.distance) },
    { label: "총 시간", value: formatDuration(workout.duration) },
    { label: "평균 페이스", value: formatPace(workout.pace) },
    { label: "칼로리", value: `${workout.calories}kcal` },
  ];

  return (
    <AuthGuard>
      <div className="page-container">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-secondary mb-4 -ml-1"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">뒤로</span>
        </button>

        <h1 className="text-2xl font-bold text-secondary mb-1">
          {WORKOUT_TYPE_LABELS[workout.type]}
        </h1>
        <p className="text-gray-500 mb-6">{dateStr}</p>

        <WorkoutMap
          route={workout.route}
          className="h-56 mb-4"
          showCurrentPosition={false}
        />

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

        {workout.memo && (
          <Card>
            <h3 className="text-sm font-bold text-secondary mb-2">메모</h3>
            <p className="text-secondary leading-relaxed">{workout.memo}</p>
          </Card>
        )}
      </div>
    </AuthGuard>
  );
}

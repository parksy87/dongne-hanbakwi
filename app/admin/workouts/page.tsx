"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllWorkouts } from "@/services/workoutService";
import { useDeleteWorkoutAdmin } from "@/hooks/useAdmin";
import { Workout } from "@/types";
import { formatDistance, formatDuration, formatPace } from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";

export default function AdminWorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const deleteMutation = useDeleteWorkoutAdmin();

  useEffect(() => {
    getAllWorkouts(100).then((data) => {
      setWorkouts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("이 운동 기록을 삭제하시겠습니까?")) return;
    await deleteMutation.mutateAsync(id);
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div>
      <AdminHeader title="운동 기록 관리" description="전체 운동 기록 조회 및 삭제" />

      {loading ? (
        <p className="text-center text-gray-500 py-12">로딩 중...</p>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => (
            <Card key={w.id} padding="sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-secondary">
                    {WORKOUT_TYPE_LABELS[w.type]} · {formatDistance(w.distance)}
                  </p>
                  <p className="text-xs text-gray-500">
                    UID: {w.userId.slice(0, 8)}... · {formatDuration(w.duration)} · {formatPace(w.pace)}
                  </p>
                </div>
                <Button size="sm" variant="danger" onClick={() => handleDelete(w.id)}>
                  삭제
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminUsers, useAdminUserDetail } from "@/hooks/useAdmin";
import { formatDistance, formatDuration, formatPace } from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";

export default function AdminUserDetailPage() {
  const params = useParams();
  const uid = params.uid as string;
  const { data: users = [] } = useAdminUsers(true);
  const { data: detail, isLoading } = useAdminUserDetail(uid, true);
  const user = users.find((u) => u.uid === uid);

  if (isLoading) return <p className="text-gray-500 py-12 text-center">로딩 중...</p>;

  return (
    <div>
      <AdminHeader
        title={user?.nickname || "사용자"}
        description={`${user?.email || ""} · ${uid}`}
      />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card padding="sm">
          <p className="text-xs text-gray-500">총 거리</p>
          <p className="font-bold">{formatDistance(user?.totalDistance || 0)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">총 운동</p>
          <p className="font-bold">{user?.totalWorkoutCount || 0}회</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">연속 출석</p>
          <p className="font-bold">{user?.streak || 0}일</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">총 시간</p>
          <p className="font-bold">{formatDuration(user?.totalDuration || 0)}</p>
        </Card>
      </div>

      <h3 className="font-bold text-secondary mb-3">운동 기록 ({detail?.workouts.length ?? 0})</h3>
      <div className="space-y-2 mb-6">
        {detail?.workouts.slice(0, 10).map((w) => (
          <Card key={w.id} padding="sm">
            <p className="font-medium">{WORKOUT_TYPE_LABELS[w.type]} · {formatDistance(w.distance)}</p>
            <p className="text-xs text-gray-500">{formatDuration(w.duration)} · {formatPace(w.pace)}</p>
          </Card>
        ))}
      </div>

      <h3 className="font-bold text-secondary mb-3">출석 ({detail?.attendance.length ?? 0}일)</h3>
      <Card padding="sm" className="mb-6">
        <p className="text-sm text-gray-600">
          {detail?.attendance.filter((a) => a.status).map((a) => a.date).slice(0, 20).join(", ") || "없음"}
        </p>
      </Card>

      <h3 className="font-bold text-secondary mb-3">배지 ({detail?.badges.length ?? 0})</h3>
      <Card padding="sm">
        <p className="text-sm">{detail?.badges.map((b) => b.badgeType).join(", ") || "없음"}</p>
      </Card>
    </div>
  );
}

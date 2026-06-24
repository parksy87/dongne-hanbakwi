"use client";

import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminUsers, useAdminUserDetail, useResetUserActivity } from "@/hooks/useAdmin";
import { formatDistance, formatDuration, formatPace } from "@/lib/utils";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { toastSuccess, toastError } from "@/stores/toastStore";

export default function AdminUserDetailPage() {
  const params = useParams();
  const uid = params.uid as string;
  const { data: users = [] } = useAdminUsers(true);
  const { data: detail, isLoading } = useAdminUserDetail(uid, true);
  const resetMutation = useResetUserActivity();
  const user = users.find((u) => u.uid === uid);

  const handleReset = async () => {
    if (
      !confirm(
        "운동 기록, 출석, 배지, 거리·레벨·스트릭을 모두 초기화합니다.\n계정과 문의는 유지됩니다.\n계속하시겠습니까?"
      )
    ) {
      return;
    }

    try {
      await resetMutation.mutateAsync(uid);
      toastSuccess("활동 데이터가 초기화되었습니다.");
    } catch {
      toastError("초기화에 실패했습니다.");
    }
  };

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
          <p className="text-xs text-gray-500">레벨</p>
          <p className="font-bold">Lv.{user?.level || 1}</p>
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
        {(detail?.workouts.length ?? 0) === 0 && (
          <Card padding="sm"><p className="text-sm text-gray-500">없음</p></Card>
        )}
      </div>

      <h3 className="font-bold text-secondary mb-3">출석 ({detail?.attendance.filter((a) => a.status).length ?? 0}일)</h3>
      <Card padding="sm" className="mb-6">
        <p className="text-sm text-gray-600">
          {detail?.attendance.filter((a) => a.status).map((a) => a.date).slice(0, 20).join(", ") || "없음"}
        </p>
      </Card>

      <h3 className="font-bold text-secondary mb-3">배지 ({detail?.badges.length ?? 0})</h3>
      <Card padding="sm" className="mb-8">
        <p className="text-sm">{detail?.badges.map((b) => b.badgeType).join(", ") || "없음"}</p>
      </Card>

      <Card className="border-2 border-red-200 space-y-3">
        <div>
          <p className="text-sm font-bold text-secondary">활동 데이터 초기화</p>
          <p className="text-xs text-gray-500 mt-1">
            불법·부정 이용 제재용. 운동·출석·배지·통계만 삭제하고 계정은 유지합니다.
          </p>
        </div>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={handleReset}
          disabled={resetMutation.isPending}
        >
          {resetMutation.isPending ? "초기화 중..." : "기록·배지 초기화"}
        </Button>
      </Card>
    </div>
  );
}

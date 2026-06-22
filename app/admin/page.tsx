"use client";

import Card from "@/components/ui/Card";
import { useDashboardStats } from "@/hooks/useAdmin";
import { formatDistance } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats(true);

  if (isLoading) {
    return <p className="text-gray-500 py-12 text-center">로딩 중...</p>;
  }

  const cards = [
    { label: "전체 사용자", value: `${stats?.totalUsers ?? 0}명` },
    { label: "오늘 출석", value: `${stats?.todayAttendance ?? 0}명` },
    { label: "오늘 운동", value: `${stats?.todayWorkouts ?? 0}건` },
    { label: "미답변 문의", value: `${stats?.pendingInquiries ?? 0}건` },
    { label: "이번주 운동", value: `${stats?.weeklyWorkouts ?? 0}건` },
    {
      label: "이번주 총 거리",
      value: formatDistance(stats?.totalDistance ?? 0),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">대시보드</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-secondary">{card.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

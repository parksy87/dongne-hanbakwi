"use client";

import Card from "@/components/ui/Card";
import { formatDistance, formatDuration } from "@/lib/utils";

interface WeeklyStatsCardProps {
  distance: number;
  duration: number;
  count: number;
}

export default function WeeklyStatsCard({
  distance,
  duration,
  count,
}: WeeklyStatsCardProps) {
  const stats = [
    { label: "이번주 거리", value: formatDistance(distance) },
    { label: "이번주 운동시간", value: formatDuration(duration) },
    { label: "이번주 운동횟수", value: `${count}회` },
  ];

  return (
    <Card className="mb-6">
      <h3 className="text-base font-bold text-secondary mb-4">주간 통계</h3>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-secondary">{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

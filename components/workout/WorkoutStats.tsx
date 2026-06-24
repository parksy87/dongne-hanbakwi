"use client";

import { formatDistance, formatWorkoutTimer, formatPace } from "@/lib/utils";

interface WorkoutStatsProps {
  duration: number;
  distance: number;
  pace: number;
  calories: number;
}

export default function WorkoutStats({
  duration,
  distance,
  pace,
  calories,
}: WorkoutStatsProps) {
  const stats = [
    { label: "운동시간", value: formatWorkoutTimer(duration) },
    { label: "거리", value: formatDistance(distance) },
    { label: "평균 페이스", value: formatPace(pace) },
    { label: "칼로리", value: `${calories}kcal` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl p-4 text-center shadow-card"
        >
          <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-secondary">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

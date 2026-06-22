"use client";

import { useState, useMemo } from "react";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import Tabs from "@/components/ui/Tabs";
import Card from "@/components/ui/Card";
import AttendanceCalendar from "@/components/records/AttendanceCalendar";
import WorkoutList from "@/components/records/WorkoutList";
import { useAuthStore } from "@/stores/authStore";
import { useUserWorkouts, useAttendance } from "@/hooks/useWorkouts";
import {
  formatDistance,
  formatDuration,
  getWeekStart,
  getMonthStart,
  getYearStart,
} from "@/lib/utils";

const periodTabs = [
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
  { key: "yearly", label: "연간" },
];

export default function RecordsPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState("weekly");

  const { data: workouts = [] } = useUserWorkouts(user?.uid);
  const { data: attendance = [] } = useAttendance(user?.uid);

  const filteredWorkouts = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "weekly":
        startDate = getWeekStart(now);
        break;
      case "monthly":
        startDate = getMonthStart(now);
        break;
      case "yearly":
        startDate = getYearStart(now);
        break;
      default:
        startDate = getWeekStart(now);
    }

    return workouts.filter((w) => {
      const date = w.createdAt?.toDate?.();
      return date && date >= startDate;
    });
  }, [workouts, period]);

  const stats = filteredWorkouts.reduce(
    (acc, w) => ({
      distance: acc.distance + w.distance,
      duration: acc.duration + w.duration,
      count: acc.count + 1,
      calories: acc.calories + w.calories,
    }),
    { distance: 0, duration: 0, count: 0, calories: 0 }
  );

  const statCards = [
    { label: "총 거리", value: formatDistance(stats.distance) },
    { label: "총 운동시간", value: formatDuration(stats.duration) },
    { label: "총 운동 횟수", value: `${stats.count}회` },
    { label: "총 칼로리", value: `${stats.calories}kcal` },
  ];

  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="기록" showNotification={false} />

        <Tabs
          items={periodTabs}
          activeKey={period}
          onChange={setPeriod}
          className="mb-6"
        />

        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map((stat) => (
            <Card key={stat.label} padding="sm">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-secondary">{stat.value}</p>
            </Card>
          ))}
        </div>

        <AttendanceCalendar attendance={attendance} />

        <h3 className="text-base font-bold text-secondary mb-3">운동 기록</h3>
        <WorkoutList workouts={filteredWorkouts} />
      </div>
    </AuthGuard>
  );
}

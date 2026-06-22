"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import AttendanceCard from "@/components/home/AttendanceCard";
import WeeklyStatsCard from "@/components/home/WeeklyStatsCard";
import DailyQuoteCard from "@/components/home/DailyQuoteCard";
import AnnouncementBanner from "@/components/home/AnnouncementBanner";
import WorkoutTypeModal from "@/components/home/WorkoutTypeModal";
import { useAuthStore } from "@/stores/authStore";
import { useWeeklyWorkouts, useTodayAttendance } from "@/hooks/useWorkouts";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { WorkoutType } from "@/types";
import { APP_SUB_SLOGAN } from "@/lib/constants";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  const { data: weeklyWorkouts = [] } = useWeeklyWorkouts(user?.uid);
  const { data: isAttended = false } = useTodayAttendance(user?.uid);
  const { data: announcements = [] } = useAnnouncements();

  const weeklyStats = weeklyWorkouts.reduce(
    (acc, w) => ({
      distance: acc.distance + w.distance,
      duration: acc.duration + w.duration,
      count: acc.count + 1,
    }),
    { distance: 0, duration: 0, count: 0 }
  );

  const handleWorkoutSelect = (type: WorkoutType) => {
    setShowModal(false);
    router.push(`/workout?type=${type}`);
  };

  return (
    <AuthGuard>
      <div className="page-container">
        <Header />
        <p className="text-sm text-gray-500 mb-4 -mt-2">{APP_SUB_SLOGAN}</p>

        <AnnouncementBanner announcements={announcements} />

        <AttendanceCard
          isAttended={isAttended}
          streak={user?.streak || 0}
        />

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="w-48 h-48 bg-primary rounded-full flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="text-4xl mb-2">🚶</span>
            <span className="text-xl font-bold text-secondary">운동 시작</span>
          </button>
        </div>

        <WeeklyStatsCard
          distance={weeklyStats.distance}
          duration={weeklyStats.duration}
          count={weeklyStats.count}
        />

        <DailyQuoteCard />

        <WorkoutTypeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleWorkoutSelect}
        />
      </div>
    </AuthGuard>
  );
}

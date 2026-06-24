"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import AttendanceCard, {
  countWeeklyAttendance,
  getTodayBestWorkout,
} from "@/components/home/AttendanceCard";
import WeeklyStatsCard from "@/components/home/WeeklyStatsCard";
import DailyQuoteCard from "@/components/home/DailyQuoteCard";
import AnnouncementBanner from "@/components/home/AnnouncementBanner";
import WorkoutTypeModal from "@/components/home/WorkoutTypeModal";
import { useAuthStore } from "@/stores/authStore";
import {
  useWeeklyWorkouts,
  useTodayAttendance,
  useTodayWorkouts,
  useAttendance,
} from "@/hooks/useWorkouts";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useSlogans } from "@/hooks/useAppSettings";
import {
  resolveUserAttendanceRules,
  DEFAULT_WEEKLY_ATTENDANCE_GOAL,
} from "@/lib/attendanceRules";
import { usePendingWorkout } from "@/hooks/usePendingWorkout";
import PendingWorkoutBanner from "@/components/workout/PendingWorkoutBanner";
import { WorkoutType } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { sub: subSlogan } = useSlogans();
  const [showModal, setShowModal] = useState(false);

  const { data: weeklyWorkouts = [] } = useWeeklyWorkouts(user?.uid);
  const { data: isAttended = false } = useTodayAttendance(user?.uid);
  const { data: todayWorkouts = [] } = useTodayWorkouts(user?.uid);
  const { data: attendance = [] } = useAttendance(user?.uid);
  const { data: announcements = [] } = useAnnouncements();

  const { pending, clear: clearPending } = usePendingWorkout(user?.uid);

  const rules = resolveUserAttendanceRules(user);
  const weeklyGoal = user?.weeklyAttendanceGoal ?? DEFAULT_WEEKLY_ATTENDANCE_GOAL;
  const weeklyAttendanceCount = countWeeklyAttendance(attendance);
  const todayBest = getTodayBestWorkout(todayWorkouts);

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
        <p className="text-sm text-gray-500 mb-4 -mt-2">{subSlogan}</p>

        <AnnouncementBanner announcements={announcements} />

        <AttendanceCard
          isAttended={isAttended}
          streak={user?.streak || 0}
          rules={rules}
          weeklyAttendanceCount={weeklyAttendanceCount}
          weeklyGoal={weeklyGoal}
          todayBest={todayBest}
        />

        {pending && (
          <PendingWorkoutBanner
            pending={pending}
            onDiscard={() => {
              if (confirm("이어하기 기록을 삭제할까요?")) clearPending();
            }}
          />
        )}

        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-48 h-48 bg-logo rounded-full flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <Image
              src="/icons/icon-mark.png"
              alt=""
              width={72}
              height={72}
              className="mb-2"
              priority
            />
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
          rules={rules}
        />
      </div>
    </AuthGuard>
  );
}

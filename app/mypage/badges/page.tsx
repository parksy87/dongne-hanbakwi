"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import BadgeCodex from "@/components/mypage/BadgeCodex";
import { useAuthStore } from "@/stores/authStore";
import {
  useBadgeProgress,
  useSyncBadges,
  useUserBadges,
  useLevelBreakdown,
} from "@/hooks/useWorkouts";
import LevelCard from "@/components/mypage/LevelCard";

export default function BadgeCodexPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: badges = [], isLoading: badgesLoading } = useUserBadges(user?.uid);
  const { data: progress, isLoading: progressLoading } = useBadgeProgress(user?.uid);
  const { data: levelBreakdown, isLoading: levelLoading } = useLevelBreakdown(user?.uid);
  const syncBadges = useSyncBadges(user?.uid);

  useEffect(() => {
    if (!user?.uid) return;
    syncBadges.mutate();
  }, [user?.uid]);

  const isLoading = badgesLoading || progressLoading || !progress;

  return (
    <AuthGuard>
      <div className="page-container">
        <button
          type="button"
          onClick={() => router.push("/mypage")}
          className="text-sm text-gray-500 hover:text-secondary mb-2"
        >
          ← 마이페이지
        </button>
        <Header title="배지 도감" showNotification={false} />
        <p className="text-sm text-gray-500 mb-6 -mt-2">
          출석·거리·운동 종목별 배지를 모아보세요.
        </p>

        {isLoading ? (
          <p className="text-center text-gray-500 py-12">로딩 중...</p>
        ) : (
          <>
            <div className="mb-6">
              <LevelCard
                breakdown={
                  levelBreakdown ?? {
                    level: 1,
                    attendanceTier: 0,
                    distanceTier: 0,
                    workoutTier: 0,
                    tierSum: 0,
                    progressPercent: 0,
                    pointsToNextLevel: 1,
                    isMaxLevel: false,
                  }
                }
                isLoading={levelLoading || !levelBreakdown}
                showCodexLink={false}
              />
            </div>
            <BadgeCodex badges={badges} progress={progress} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}

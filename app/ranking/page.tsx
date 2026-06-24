"use client";

import { useState } from "react";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import Tabs from "@/components/ui/Tabs";
import Card from "@/components/ui/Card";
import RankingList from "@/components/ranking/RankingList";
import { useAuthStore } from "@/stores/authStore";
import { useRanking } from "@/hooks/useWorkouts";

const periodTabs = [
  { key: "weekly", label: "주간" },
  { key: "monthly", label: "월간" },
];

export default function RankingPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const { data: ranking = [], isLoading } = useRanking(period);

  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="랭킹" showNotification={false} />

        <Tabs
          items={periodTabs}
          activeKey={period}
          onChange={(key) => setPeriod(key as "weekly" | "monthly")}
          className="mb-6"
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : user?.excludeFromRanking ? (
          <Card className="mb-4">
            <p className="text-sm text-gray-600 text-center py-6">
              랭킹 참여를 끈 상태입니다. 설정에서 다시 참여할 수 있어요.
            </p>
          </Card>
        ) : (
          <RankingList entries={ranking} currentUserId={user?.uid} />
        )}
      </div>
    </AuthGuard>
  );
}

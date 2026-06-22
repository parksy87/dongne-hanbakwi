"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import {
  useAdminRanking,
  useRankingExclusionsAdmin,
  useAddRankingExclusion,
  useRemoveRankingExclusion,
  useAdminUsers,
} from "@/hooks/useAdmin";
import { useAuthStore } from "@/stores/authStore";
import { formatDistance } from "@/lib/utils";

export default function AdminRankingPage() {
  const { firebaseUser } = useAuthStore();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const { data: ranking = [] } = useAdminRanking(period, true);
  const { data: exclusions = [] } = useRankingExclusionsAdmin(true);
  const { data: users = [] } = useAdminUsers(true);
  const addExclusion = useAddRankingExclusion();
  const removeExclusion = useRemoveRankingExclusion();

  const [excludeUid, setExcludeUid] = useState("");
  const [excludeReason, setExcludeReason] = useState("");

  const handleExclude = async () => {
    if (!firebaseUser || !excludeUid) return;
    const user = users.find((u) => u.uid === excludeUid);
    await addExclusion.mutateAsync({
      userId: excludeUid,
      nickname: user?.nickname || "익명",
      reason: excludeReason || "관리자 제외",
      excludedBy: firebaseUser.uid,
    });
    setExcludeUid("");
    setExcludeReason("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">랭킹 관리</h1>

      <Tabs
        items={[
          { key: "weekly", label: "주간" },
          { key: "monthly", label: "월간" },
        ]}
        activeKey={period}
        onChange={(k) => setPeriod(k as "weekly" | "monthly")}
        className="mb-6"
      />

      <h3 className="font-bold text-secondary mb-3">현재 랭킹 TOP 10</h3>
      <div className="space-y-2 mb-8">
        {ranking.slice(0, 10).map((entry) => (
          <Card key={entry.userId} padding="sm" className="flex justify-between">
            <span>{entry.rank}. {entry.nickname}</span>
            <span className="font-bold">{formatDistance(entry.totalDistance)}</span>
          </Card>
        ))}
      </div>

      <h3 className="font-bold text-secondary mb-3">랭킹 제외 사용자</h3>
      <Card className="mb-4 space-y-3">
        <select
          value={excludeUid}
          onChange={(e) => setExcludeUid(e.target.value)}
          className="w-full p-3 bg-gray rounded-xl"
        >
          <option value="">사용자 선택</option>
          {users.map((u) => (
            <option key={u.uid} value={u.uid}>{u.nickname} ({u.email})</option>
          ))}
        </select>
        <input
          value={excludeReason}
          onChange={(e) => setExcludeReason(e.target.value)}
          placeholder="제외 사유"
          className="w-full p-3 bg-gray rounded-xl"
        />
        <Button size="md" fullWidth onClick={handleExclude}>랭킹에서 제외</Button>
      </Card>

      <div className="space-y-2">
        {exclusions.map((e) => (
          <Card key={e.id} padding="sm" className="flex justify-between items-center">
            <div>
              <p className="font-medium">{e.nickname}</p>
              <p className="text-xs text-gray-500">{e.reason}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => removeExclusion.mutate(e.id)}>
              해제
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

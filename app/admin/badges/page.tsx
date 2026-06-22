"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getAllBadges, getBadgeInfo } from "@/services/badgeService";
import { useAwardBadgeAdmin, useDeleteBadgeAdmin, useAdminUsers } from "@/hooks/useAdmin";
import { BADGE_DEFINITIONS } from "@/lib/constants";
import { AdminBadgeRecord } from "@/types";

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<AdminBadgeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: users = [] } = useAdminUsers(true);
  const awardMutation = useAwardBadgeAdmin();
  const deleteMutation = useDeleteBadgeAdmin();

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");

  useEffect(() => {
    getAllBadges().then((data) => {
      setBadges(data);
      setLoading(false);
    });
  }, []);

  const handleAward = async () => {
    if (!selectedUser || !selectedBadge) return;
    await awardMutation.mutateAsync({ userId: selectedUser, badgeType: selectedBadge });
    const updated = await getAllBadges();
    setBadges(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("배지를 회수하시겠습니까?")) return;
    await deleteMutation.mutateAsync(id);
    setBadges((prev) => prev.filter((b) => b.id !== id));
  };

  const getNickname = (userId: string) =>
    users.find((u) => u.uid === userId)?.nickname || userId.slice(0, 8);

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">배지 관리</h1>

      <Card className="mb-6 space-y-3">
        <h3 className="font-bold text-secondary">배지 수동 지급</h3>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-3 bg-gray rounded-xl"
        >
          <option value="">사용자 선택</option>
          {users.map((u) => (
            <option key={u.uid} value={u.uid}>{u.nickname}</option>
          ))}
        </select>
        <select
          value={selectedBadge}
          onChange={(e) => setSelectedBadge(e.target.value)}
          className="w-full p-3 bg-gray rounded-xl"
        >
          <option value="">배지 선택</option>
          {BADGE_DEFINITIONS.map((b) => (
            <option key={b.type} value={b.type}>{b.icon} {b.name}</option>
          ))}
        </select>
        <Button size="md" fullWidth onClick={handleAward}>지급</Button>
      </Card>

      <h3 className="font-bold text-secondary mb-3">전체 배지 현황</h3>
      {loading ? (
        <p className="text-gray-500 text-center py-8">로딩 중...</p>
      ) : (
        <div className="space-y-2">
          {badges.map((b) => {
            const info = getBadgeInfo(b.badgeType);
            return (
              <Card key={b.id} padding="sm" className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{info?.icon} {info?.name} · {getNickname(b.userId)}</p>
                  <p className="text-xs text-gray-500">{info?.description}</p>
                </div>
                <Button size="sm" variant="danger" onClick={() => handleDelete(b.id!)}>
                  회수
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

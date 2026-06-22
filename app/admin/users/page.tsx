"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAdminUsers, useSuspendUser } from "@/hooks/useAdmin";
import { searchUsers } from "@/hooks/useAdmin";
import { formatDistance } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAdminUsers(true);
  const suspendMutation = useSuspendUser();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<typeof users | null>(null);

  const displayUsers = results ?? users;

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setResults(null);
      return;
    }
    const found = await searchUsers(keyword.trim());
    setResults(found);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">사용자 관리</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="닉네임, 이메일, UID 검색"
          className="flex-1 p-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button size="md" onClick={handleSearch}>검색</Button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-12">로딩 중...</p>
      ) : (
        <div className="space-y-3">
          {displayUsers.map((user) => (
            <Card key={user.uid} padding="sm">
              <div className="flex items-center justify-between gap-3">
                <Link href={`/admin/users/${user.uid}`} className="flex-1 min-w-0">
                  <p className="font-bold text-secondary">{user.nickname}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Lv.{user.level} · 출석 {user.streak}일 · {formatDistance(user.totalDistance)}
                  </p>
                  {user.isSuspended && (
                    <span className="text-xs text-red-500 font-bold">정지됨</span>
                  )}
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant={user.isSuspended ? "primary" : "danger"}
                    onClick={() =>
                      suspendMutation.mutate({
                        uid: user.uid,
                        suspended: !user.isSuspended,
                        reason: user.isSuspended ? "" : "관리자 정지",
                      })
                    }
                  >
                    {user.isSuspended ? "해제" : "정지"}
                  </Button>
                  <Link href={`/admin/users/${user.uid}`}>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

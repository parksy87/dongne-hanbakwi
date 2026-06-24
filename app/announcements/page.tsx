"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useIsAdmin, useDeleteAnnouncement } from "@/hooks/useAdmin";
import { useAuthStore } from "@/stores/authStore";
import { toastError } from "@/stores/toastStore";

export default function AnnouncementsPage() {
  const { firebaseUser } = useAuthStore();
  const { data: announcements = [], isLoading } = useAnnouncements();
  const { data: isAdmin } = useIsAdmin(firebaseUser?.uid);
  const deleteMutation = useDeleteAnnouncement();

  const handleDelete = async (id: string) => {
    if (!confirm("이 공지를 삭제하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      toastError("삭제에 실패했습니다.");
    }
  };

  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="공지사항" showNotification={false} />

        <p className="text-sm text-gray-500 mb-6 -mt-2">
          서비스 공지와 안내를 확인하세요.
        </p>

        {isLoading ? (
          <p className="text-center text-gray-500 py-12">불러오는 중...</p>
        ) : announcements.length === 0 ? (
          <EmptyState
            emoji="📢"
            title="등록된 공지가 없어요"
            description="새 공지가 올라오면 여기에 표시됩니다."
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <Card key={a.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2 mb-1">
                      {a.isPinned && (
                        <span className="text-xs bg-primary px-2 py-0.5 rounded-full font-bold">
                          고정
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-secondary">{a.title}</p>
                    <p className="text-sm text-secondary/80 mt-2 leading-relaxed whitespace-pre-wrap">
                      {a.content}
                    </p>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="danger"
                      className="shrink-0"
                      onClick={() => handleDelete(a.id)}
                      disabled={deleteMutation.isPending}
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

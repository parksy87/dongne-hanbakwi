"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  useAdminAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "@/hooks/useAdmin";
import { useAuthStore } from "@/stores/authStore";

export default function AdminAnnouncementsPage() {
  const { firebaseUser } = useAuthStore();
  const { data: announcements = [], isLoading } = useAdminAnnouncements(true);
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const openCreate = () => {
    setEditId(null);
    setTitle("");
    setContent("");
    setIsPinned(false);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (a: typeof announcements[0]) => {
    setEditId(a.id);
    setTitle(a.title);
    setContent(a.content);
    setIsPinned(a.isPinned);
    setIsActive(a.isActive);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!firebaseUser || !title.trim() || !content.trim()) return;
    try {
      if (editId) {
        await updateMutation.mutateAsync({
          id: editId,
          data: { title: title.trim(), content: content.trim(), isPinned, isActive },
        });
      } else {
        await createMutation.mutateAsync({
          title: title.trim(),
          content: content.trim(),
          isPinned,
          isActive,
          createdBy: firebaseUser.uid,
        });
      }
      setModalOpen(false);
    } catch {
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <AdminHeader title="공지 관리" description="앱 공지사항을 작성하고 관리합니다." />
      <div className="flex justify-end mb-6">
        <Button size="md" onClick={openCreate}>공지 작성</Button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 py-12">로딩 중...</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex gap-2 mb-1">
                    {a.isPinned && <span className="text-xs bg-primary px-2 py-0.5 rounded-full font-bold">고정</span>}
                    {!a.isActive && <span className="text-xs bg-gray px-2 py-0.5 rounded-full">비활성</span>}
                  </div>
                  <p className="font-bold text-secondary">{a.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.content}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(a)}>수정</Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm("삭제하시겠습니까?")) deleteMutation.mutate(a.id);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "공지 수정" : "공지 작성"}>
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full p-3 bg-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            className="w-full p-3 bg-gray rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
            <span className="text-sm">상단 고정</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <span className="text-sm">활성화</span>
          </label>
          <Button size="lg" fullWidth onClick={handleSave}>저장</Button>
        </div>
      </Modal>
    </div>
  );
}

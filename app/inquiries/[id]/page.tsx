"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useDeleteInquiry } from "@/hooks/useInquiries";
import { getInquiry } from "@/services/inquiryService";
import { Inquiry } from "@/types";
import { INQUIRY_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const deleteInquiry = useDeleteInquiry();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getInquiry(params.id as string);
      if (data && data.userId !== user?.uid) {
        setInquiry(null);
      } else {
        setInquiry(data);
      }
      setLoading(false);
    };
    if (user) load();
  }, [params.id, user]);

  const handleDelete = async () => {
    if (!inquiry || !user) return;
    if (!confirm("이 문의를 삭제하시겠습니까?")) return;

    try {
      await deleteInquiry.mutateAsync({ id: inquiry.id, userId: user.uid });
      router.replace("/inquiries");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">문의를 찾을 수 없습니다.</p>
        <Button onClick={() => router.replace("/inquiries")}>목록으로</Button>
      </div>
    );
  }

  const createdDate = inquiry.createdAt?.toDate?.();
  const dateStr = createdDate
    ? `${createdDate.getFullYear()}년 ${createdDate.getMonth() + 1}월 ${createdDate.getDate()}일`
    : "";

  const answeredDate = inquiry.answeredAt?.toDate?.();
  const answeredStr = answeredDate
    ? `${answeredDate.getFullYear()}년 ${answeredDate.getMonth() + 1}월 ${answeredDate.getDate()}일`
    : "";

  return (
    <AuthGuard>
      <div className="page-container">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-secondary mb-4 -ml-1"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">뒤로</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              inquiry.status === "answered"
                ? "bg-success/20 text-success"
                : "bg-gray text-gray-500"
            )}
          >
            {INQUIRY_STATUS_LABELS[inquiry.status]}
          </span>
          <span className="text-sm text-gray-400">{dateStr}</span>
        </div>

        <h1 className="text-xl font-bold text-secondary mb-6">{inquiry.title}</h1>

        <Card className="mb-4">
          <h3 className="text-sm font-bold text-secondary mb-2">문의 내용</h3>
          <p className="text-secondary leading-relaxed whitespace-pre-wrap">
            {inquiry.content}
          </p>
        </Card>

        {inquiry.status === "answered" && inquiry.answer && (
          <Card className="mb-6 bg-primary/10 border-2 border-primary/30">
            <h3 className="text-sm font-bold text-secondary mb-1">답변</h3>
            {answeredStr && (
              <p className="text-xs text-gray-500 mb-2">{answeredStr}</p>
            )}
            <p className="text-secondary leading-relaxed whitespace-pre-wrap">
              {inquiry.answer}
            </p>
          </Card>
        )}

        {inquiry.status === "pending" && (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleDelete}
            disabled={deleteInquiry.isPending}
          >
            {deleteInquiry.isPending ? "삭제 중..." : "문의 삭제"}
          </Button>
        )}
      </div>
    </AuthGuard>
  );
}

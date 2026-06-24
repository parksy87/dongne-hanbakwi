"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AdminHeader from "@/components/admin/AdminHeader";
import { getInquiry } from "@/services/inquiryService";
import { useAnswerInquiry, useAdminDeleteInquiry } from "@/hooks/useAdmin";
import { toastSuccess, toastError } from "@/stores/toastStore";
import { Inquiry } from "@/types";
import { INQUIRY_STATUS_LABELS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default function AdminInquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const answerMutation = useAnswerInquiry();
  const deleteMutation = useAdminDeleteInquiry();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInquiry(params.id as string).then((data) => {
      setInquiry(data);
      setAnswer(data?.answer || "");
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async () => {
    if (!inquiry || !answer.trim()) {
      toastError("답변을 입력해주세요.");
      return;
    }
    try {
      await answerMutation.mutateAsync({ id: inquiry.id, answer: answer.trim() });
      toastSuccess("답변이 등록되었습니다.");
      router.push("/admin/inquiries");
    } catch {
      toastError("답변 등록에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!inquiry) return;
    if (!confirm("이 문의를 삭제하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync(inquiry.id);
      toastSuccess("문의가 삭제되었습니다.");
      router.push("/admin/inquiries");
    } catch {
      toastError("삭제에 실패했습니다.");
    }
  };

  if (loading) return <p className="text-gray-500 py-12 text-center">로딩 중...</p>;
  if (!inquiry) return <p className="text-gray-500 py-12 text-center">문의를 찾을 수 없습니다.</p>;

  return (
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-1 text-secondary mb-4 text-sm hover:underline">
        <ArrowLeft size={16} /><span>목록으로</span>
      </button>

      <AdminHeader
        title={inquiry.title}
        description={`${INQUIRY_STATUS_LABELS[inquiry.status]} · ${inquiry.nickname} · ${inquiry.email}`}
      />

      <Card className="mb-4">
        <h3 className="text-sm font-bold mb-2">문의 내용</h3>
        <p className="leading-relaxed whitespace-pre-wrap">{inquiry.content}</p>
      </Card>

      <Card className="mb-6">
        <h3 className="text-sm font-bold mb-2">답변 작성</h3>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 bg-gray rounded-xl h-40 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="답변을 입력하세요"
        />
      </Card>

      <div className="flex flex-col gap-3">
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={answerMutation.isPending}>
          {answerMutation.isPending ? "저장 중..." : "답변 저장"}
        </Button>
        <Button
          size="lg"
          fullWidth
          variant="danger"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "삭제 중..." : "문의 삭제"}
        </Button>
      </div>
    </div>
  );
}

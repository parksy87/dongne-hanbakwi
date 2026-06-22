"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
import { useCreateInquiry } from "@/hooks/useInquiries";
import { toastSuccess, toastError } from "@/stores/toastStore";
import { ArrowLeft } from "lucide-react";

export default function NewInquiryPage() {
  const router = useRouter();
  const { user, firebaseUser } = useAuthStore();
  const createInquiry = useCreateInquiry();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!user || !firebaseUser) return;
    if (!title.trim()) {
      toastError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      toastError("내용을 입력해주세요.");
      return;
    }

    try {
      await createInquiry.mutateAsync({
        userId: firebaseUser.uid,
        nickname: user.nickname,
        email: user.email,
        title: title.trim(),
        content: content.trim(),
      });
      toastSuccess("문의가 등록되었습니다.");
      router.replace("/inquiries");
    } catch (error) {
      console.error("Inquiry create failed:", error);
      toastError("문의 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

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

        <h1 className="text-2xl font-bold text-secondary mb-2">새 문의 작성</h1>
        <p className="text-sm text-gray-500 mb-6">
          답변은 문의 내역에서 확인할 수 있습니다.
        </p>

        <Card className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-bold text-secondary mb-2 block">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력하세요"
              maxLength={50}
              className="w-full p-3 bg-gray rounded-xl text-secondary text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-secondary mb-2 block">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 자세히 입력해주세요"
              maxLength={1000}
              className="w-full p-3 bg-gray rounded-xl text-secondary text-base resize-none h-48 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {content.length}/1000
            </p>
          </div>
        </Card>

        <Button
          size="xl"
          fullWidth
          onClick={handleSubmit}
          disabled={createInquiry.isPending}
        >
          {createInquiry.isPending ? "등록 중..." : "문의 등록"}
        </Button>
      </div>
    </AuthGuard>
  );
}

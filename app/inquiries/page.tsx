"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import InquiryList from "@/components/inquiries/InquiryList";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useUserInquiries } from "@/hooks/useInquiries";
import { PenLine } from "lucide-react";

export default function InquiriesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: inquiries = [], isLoading } = useUserInquiries(user?.uid);

  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="문의하기" showNotification={false} />

        <p className="text-sm text-gray-500 mb-6 -mt-2">
          서비스 이용 중 궁금한 점을 남겨주세요.
        </p>

        <Button
          size="lg"
          fullWidth
          className="mb-6 flex items-center gap-2"
          onClick={() => router.push("/inquiries/new")}
        >
          <PenLine size={20} />
          새 문의 작성
        </Button>

        <h3 className="text-base font-bold text-secondary mb-3">내 문의 내역</h3>

        {isLoading ? (
          <p className="text-center text-gray-500 py-12">로딩 중...</p>
        ) : (
          <InquiryList inquiries={inquiries} />
        )}
      </div>
    </AuthGuard>
  );
}

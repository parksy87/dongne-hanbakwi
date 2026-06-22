"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import InquiryList from "@/components/inquiries/InquiryList";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useAuthStore } from "@/stores/authStore";
import { useUserInquiries } from "@/hooks/useInquiries";
import { PenLine } from "lucide-react";

export default function InquiriesPage() {
  const router = useRouter();
  const { firebaseUser } = useAuthStore();
  const {
    data: inquiries,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserInquiries(firebaseUser?.uid);

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
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-xl">💬</span>
            </div>
            <p className="text-gray-500">문의 내역을 불러오는 중...</p>
          </div>
        ) : isError ? (
          <ErrorState
            message={(error as Error)?.message || "잠시 후 다시 시도해주세요."}
            onRetry={() => refetch()}
          />
        ) : inquiries?.length === 0 ? (
          <EmptyState
            emoji="💬"
            title="아직 문의 내역이 없어요"
            description="궁금한 점이 있으면 새 문의를 작성해 주세요."
            action={
              <Button size="md" onClick={() => router.push("/inquiries/new")}>
                문의 작성하기
              </Button>
            }
          />
        ) : (
          <InquiryList inquiries={inquiries ?? []} />
        )}
      </div>
    </AuthGuard>
  );
}

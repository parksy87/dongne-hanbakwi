"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function TermsPage() {
  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="이용약관" showNotification={false} />
        <Card className="space-y-4 text-sm text-secondary leading-relaxed">
          <section>
            <h2 className="font-bold text-base mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 동네한바퀴(이하 &quot;서비스&quot;)의 이용 조건 및 절차,
              이용자와 운영자의 권리·의무를 규정합니다.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">제2조 (서비스 내용)</h2>
            <p>
              서비스는 걷기·산책·러닝 기록, 출석 인증, 통계 및 랭킹 등 습관
              형성을 위한 기능을 제공합니다.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">제3조 (회원)</h2>
            <p>
              회원은 Google 계정으로 로그인하며, 정확한 정보를 유지할 책임이
              있습니다. 부정 이용 시 이용 제한될 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">제4조 (위치 정보)</h2>
            <p>
              운동 기록을 위해 GPS 위치 정보가 수집·저장됩니다. 브라우저
              설정에서 권한을 거부할 수 있으나 일부 기능이 제한됩니다.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">제5조 (면책)</h2>
            <p>
              GPS 오차, 네트워크 장애, 기기 상태 등으로 인한 기록 오류에 대해
              서비스는 법령이 허용하는 범위 내에서 책임을 제한합니다.
            </p>
          </section>
          <p className="text-xs text-gray-500 pt-2">
            시행일: 2026년 6월 24일 · 문의: 마이페이지 &gt; 문의하기
          </p>
          <Link href="/mypage/settings" className="text-sm underline block">
            설정으로 돌아가기
          </Link>
        </Card>
      </div>
    </AuthGuard>
  );
}

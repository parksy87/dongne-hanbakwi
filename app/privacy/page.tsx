"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="개인정보처리방침" showNotification={false} />
        <Card className="space-y-4 text-sm text-secondary leading-relaxed">
          <section>
            <h2 className="font-bold text-base mb-2">1. 수집 항목</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Google 로그인: 이메일, 닉네임</li>
              <li>프로필: 선택한 십이지 동물 아바타, 닉네임</li>
              <li>운동 기록: GPS 경로, 거리, 시간, 칼로리, 메모</li>
              <li>출석·배지·랭킹·문의 내역</li>
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">2. 이용 목적</h2>
            <p>운동 기록 제공, 출석 인증, 통계·랭킹, 고객 문의 응대</p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">3. 보관 및 파기</h2>
            <p>
              데이터는 Firebase(Firestore)에 저장됩니다. 회원 탈퇴 시 관련
              데이터를 삭제합니다. 법령상 보관 의무가 있는 경우 해당 기간
              보관합니다.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">4. 제3자 제공</h2>
            <p>
              원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 서비스
              운영을 위해 Google(Firebase) 인프라를 사용합니다.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-base mb-2">5. 이용자 권리</h2>
            <p>
              설정 &gt; 데이터 내보내기(CSV) 및 회원 탈퇴를 통해 기록 열람·
              삭제를 요청할 수 있습니다.
            </p>
          </section>
          <p className="text-xs text-gray-500 pt-2">시행일: 2026년 6월 24일</p>
          <Link href="/mypage/settings" className="text-sm underline block">
            설정으로 돌아가기
          </Link>
        </Card>
      </div>
    </AuthGuard>
  );
}

"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import Header from "@/components/layout/Header";
import AttendanceRulesSettings from "@/components/mypage/AttendanceRulesSettings";
import UserPreferencesSettings from "@/components/mypage/UserPreferencesSettings";

export default function MyPageSettingsPage() {
  return (
    <AuthGuard>
      <div className="page-container">
        <Header title="설정" showNotification={false} />
        <p className="text-sm text-gray-500 mb-6 -mt-2">
          출석 목표, 랭킹, 데이터 관리를 설정하세요.
        </p>
        <AttendanceRulesSettings />
        <UserPreferencesSettings />
      </div>
    </AuthGuard>
  );
}

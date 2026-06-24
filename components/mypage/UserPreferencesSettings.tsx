"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { updateUserPreferences } from "@/services/userService";
import { downloadCsv, exportUserDataCsv, deleteUserAccount } from "@/services/accountService";
import { toastSuccess, toastError } from "@/stores/toastStore";
import { DEFAULT_WEEKLY_ATTENDANCE_GOAL } from "@/lib/attendanceRules";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserPreferencesSettings() {
  const router = useRouter();
  const { user, setUser, reset } = useAuthStore();
  const [excludeFromRanking, setExcludeFromRanking] = useState(
    user?.excludeFromRanking ?? false
  );
  const [weeklyGoal, setWeeklyGoal] = useState(
    user?.weeklyAttendanceGoal ?? DEFAULT_WEEKLY_ATTENDANCE_GOAL
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setExcludeFromRanking(user?.excludeFromRanking ?? false);
    setWeeklyGoal(user?.weeklyAttendanceGoal ?? DEFAULT_WEEKLY_ATTENDANCE_GOAL);
  }, [user]);

  const handleSavePrefs = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserPreferences(user.uid, {
        excludeFromRanking,
        weeklyAttendanceGoal: weeklyGoal,
      });
      setUser({ ...user, excludeFromRanking, weeklyAttendanceGoal: weeklyGoal });
      toastSuccess("설정이 저장되었습니다.");
    } catch {
      toastError("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
      const csv = await exportUserDataCsv(user.uid);
      downloadCsv(csv, `동네한바퀴_기록_${user.nickname}.csv`);
      toastSuccess("데이터를 내보냈습니다.");
    } catch {
      toastError("내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = confirm(
      "계정과 모든 운동·출석·문의 데이터가 삭제됩니다.\n정말 탈퇴하시겠습니까?"
    );
    if (!confirmed) return;
    const typed = prompt('탈퇴를 확인하려면 "탈퇴"를 입력하세요.');
    if (typed !== "탈퇴") return;

    setIsDeleting(true);
    try {
      await deleteUserAccount(user.uid);
      reset();
      router.replace("/login");
    } catch (e) {
      console.error(e);
      toastError(
        "탈퇴에 실패했습니다. 최근 로그인이 필요할 수 있습니다. 다시 로그인 후 시도해 주세요."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="mb-6 space-y-4">
        <h3 className="text-base font-bold text-secondary">주간 출석 목표</h3>
        <p className="text-sm text-gray-500">
          이번 주 몇 일 출석할지 목표를 정하세요. (홈 화면 진행률에 표시)
        </p>
        <div>
          <label className="text-xs text-gray-500">주간 목표 (일)</label>
          <input
            type="number"
            min={1}
            max={7}
            value={weeklyGoal}
            onChange={(e) => setWeeklyGoal(Number(e.target.value))}
            className="w-full p-2 bg-gray rounded-xl mt-1"
          />
        </div>
      </Card>

      <Card className="mb-6 space-y-3">
        <h3 className="text-base font-bold text-secondary">랭킹</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeFromRanking}
            onChange={(e) => setExcludeFromRanking(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-secondary">랭킹에 참여하지 않기</span>
        </label>
        <p className="text-xs text-gray-500">
          체크하면 주간·월간 랭킹 목록에 표시되지 않습니다.
        </p>
      </Card>

      <Card className="mb-6 space-y-3">
        <h3 className="text-base font-bold text-secondary">푸시 알림</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          출석 리마인더 등 푸시 알림은 하이브리드 앱 출시 후 제공 예정입니다.
          현재는 상단 종 아이콘으로 문의 답변을 확인할 수 있습니다.
        </p>
      </Card>

      <Card className="mb-6 space-y-3">
        <h3 className="text-base font-bold text-secondary">데이터</h3>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "내보내는 중..." : "운동·출석 기록 CSV 내보내기"}
        </Button>
      </Card>

      <Card className="mb-6 space-y-3">
        <h3 className="text-base font-bold text-secondary">약관 및 정책</h3>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/terms" className="text-secondary underline">
            이용약관
          </Link>
          <Link href="/privacy" className="text-secondary underline">
            개인정보처리방침
          </Link>
        </div>
      </Card>

      <Button size="lg" fullWidth onClick={handleSavePrefs} disabled={isSaving} className="mb-4">
        {isSaving ? "저장 중..." : "설정 저장"}
      </Button>

      <Button
        variant="danger"
        size="lg"
        fullWidth
        onClick={handleDeleteAccount}
        disabled={isDeleting}
      >
        {isDeleting ? "처리 중..." : "회원 탈퇴"}
      </Button>
    </>
  );
}

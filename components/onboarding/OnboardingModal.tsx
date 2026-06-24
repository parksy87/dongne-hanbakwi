"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import {
  formatAttendanceRuleSummary,
  resolveUserAttendanceRules,
} from "@/lib/attendanceRules";

const STORAGE_KEY = "onboarding_done_v1";

export default function OnboardingModal() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const attendanceSummary = useMemo(
    () => formatAttendanceRuleSummary(resolveUserAttendanceRules(user)),
    [user]
  );

  const steps = useMemo(
    () => [
      {
        emoji: "🚶",
        title: "동네한바퀴에 오신 것을\n환영합니다!",
        desc: "걷기·산책·러닝을 기록하고\n매일 밖에 나가는 습관을 만들어 보세요.",
      },
      {
        emoji: "✅",
        title: "출석 인증 방법",
        desc: `${attendanceSummary}\n\n출석 기준은 마이페이지에서 설정해 주세요.`,
      },
      {
        emoji: "📍",
        title: "GPS 허용이 필요해요",
        desc: "운동 기록을 위해\n위치 접근 권한을 허용해 주세요.\n(설정에서 변경 가능)",
      },
    ],
    [attendanceSummary]
  );

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setIsOpen(true);
  }, []);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const handleGoToSettings = () => {
    handleComplete();
    router.push("/mypage/settings");
  };

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const isAttendanceStep = step === 1;

  return (
    <Modal isOpen={isOpen} onClose={handleComplete} title="시작하기">
      <div className="text-center py-4">
        <div className="text-6xl mb-6">{current.emoji}</div>
        <h3 className="text-xl font-bold text-secondary mb-4 whitespace-pre-line">
          {current.title}
        </h3>
        <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line mb-8">
          {current.desc}
        </p>
        <div className="flex gap-2 justify-center mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i === step ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {isAttendanceStep && (
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleGoToSettings}
            >
              설정하러 가기
            </Button>
          )}
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep((s) => s - 1)}
              >
                이전
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1"
              onClick={() => (isLast ? handleComplete() : setStep((s) => s + 1))}
            >
              {isLast ? "시작하기" : "다음"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

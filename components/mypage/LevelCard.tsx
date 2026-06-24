"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { LevelBreakdown } from "@/lib/level";
import { ChevronRight } from "lucide-react";

interface LevelCardProps {
  breakdown: LevelBreakdown;
  isLoading?: boolean;
  showCodexLink?: boolean;
}

function TierChip({
  label,
  tier,
  max = 10,
}: {
  label: string;
  tier: number;
  max?: number;
}) {
  return (
    <div className="flex-1 min-w-0 text-center px-2 py-2 rounded-xl bg-gray/60">
      <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-secondary">
        T{tier}
        <span className="text-[10px] font-normal text-gray-400">/{max}</span>
      </p>
    </div>
  );
}

export default function LevelCard({
  breakdown,
  isLoading,
  showCodexLink = true,
}: LevelCardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card>
        <p className="text-sm text-gray-500 text-center py-4">레벨 정보 로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">종합 레벨</p>
          <p className="text-3xl font-bold text-secondary">
            Lv.{breakdown.level}
            {breakdown.isMaxLevel && (
              <span className="ml-2 text-sm font-normal text-primary">MAX</span>
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">티어 합계</p>
          <p className="text-lg font-bold text-secondary">
            {breakdown.tierSum}
            <span className="text-sm font-normal text-gray-400">/30</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <TierChip label="출석" tier={breakdown.attendanceTier} />
        <TierChip label="거리" tier={breakdown.distanceTier} />
        <TierChip label="운동" tier={breakdown.workoutTier} />
      </div>

      {!breakdown.isMaxLevel && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>다음 레벨까지</span>
            <span>
              {breakdown.pointsToNextLevel > 0
                ? `티어 ${breakdown.pointsToNextLevel} 더 필요`
                : "곧 레벨업!"}
            </span>
          </div>
          <div className="h-2 bg-gray rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${breakdown.progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
        출석·거리·운동(걷기/산책/러닝 중 최고) 배지 티어 합을 기준으로 레벨이
        올라갑니다. 배지 도감과 같은 기준입니다.
      </p>

      {showCodexLink && (
        <button
          type="button"
          onClick={() => router.push("/mypage/badges")}
          className="w-full flex items-center justify-center gap-1 text-sm font-medium text-secondary hover:text-primary transition-colors"
        >
          배지 도감에서 티어 올리기
          <ChevronRight size={16} />
        </button>
      )}
    </Card>
  );
}

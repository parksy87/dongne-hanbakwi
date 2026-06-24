"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { Badge } from "@/types";
import { BADGE_DEFINITIONS, getBadgeDefinition } from "@/lib/badges";
import { ChevronRight } from "lucide-react";

interface BadgeGridProps {
  badges: Badge[];
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  const router = useRouter();
  const earnedCount = badges.filter((b) =>
    BADGE_DEFINITIONS.some((d) => d.type === b.badgeType)
  ).length;

  const recentEarned = badges
    .slice()
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    })
    .slice(0, 6)
    .map((b) => getBadgeDefinition(b.badgeType))
    .filter(Boolean);

  return (
    <Card>
      <button
        type="button"
        onClick={() => router.push("/mypage/badges")}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-secondary">배지 도감</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {earnedCount} / {BADGE_DEFINITIONS.length} 획득
            </p>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </div>

        {recentEarned.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {recentEarned.map((badge) => (
              <div
                key={badge!.type}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/20"
                title={badge!.name}
              >
                <span className="text-lg">{badge!.icon}</span>
                <span className="text-xs font-medium text-secondary">{badge!.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            운동하고 출석하면 배지를 모을 수 있어요. 도감에서 전체 목록을 확인하세요.
          </p>
        )}
      </button>
    </Card>
  );
}

"use client";

import Card from "@/components/ui/Card";
import { Badge } from "@/types";
import { BADGE_DEFINITIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BadgeGridProps {
  badges: Badge[];
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  const earnedTypes = new Set(badges.map((b) => b.badgeType));

  return (
    <Card>
      <h3 className="text-base font-bold text-secondary mb-4">획득 배지</h3>
      <div className="grid grid-cols-3 gap-3">
        {BADGE_DEFINITIONS.map((badge) => {
          const earned = earnedTypes.has(badge.type);
          return (
            <div
              key={badge.type}
              className={cn(
                "text-center p-3 rounded-2xl",
                earned ? "bg-primary/20" : "bg-gray opacity-50"
              )}
            >
              <p className="text-2xl mb-1">{badge.icon}</p>
              <p className="text-xs font-bold text-secondary">{badge.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

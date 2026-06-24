"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import { Badge } from "@/types";
import {
  BADGE_CATEGORY_LABELS,
  BADGE_CATEGORY_ORDER,
  BADGE_DEFINITIONS,
  BadgeCategory,
  BadgeProgressStats,
  formatProgressLabel,
  getBadgesByCategory,
  getStatForCategory,
  isBadgeEarned,
} from "@/lib/badges";
import { cn } from "@/lib/utils";

interface BadgeCodexProps {
  badges: Badge[];
  progress: BadgeProgressStats;
}

export default function BadgeCodex({ badges, progress }: BadgeCodexProps) {
  const [category, setCategory] = useState<BadgeCategory>("attendance");
  const earnedTypes = useMemo(
    () => new Set(badges.map((b) => b.badgeType)),
    [badges]
  );

  const categoryTabs = BADGE_CATEGORY_ORDER.map((key) => ({
    key,
    label: BADGE_CATEGORY_LABELS[key],
  }));

  const categoryBadges = getBadgesByCategory(category);
  const earnedInCategory = categoryBadges.filter((b) => earnedTypes.has(b.type)).length;
  const currentStat = getStatForCategory(category, progress);

  return (
    <div>
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">전체 획득</p>
            <p className="text-2xl font-bold text-secondary">
              {badges.filter((b) => BADGE_DEFINITIONS.some((d) => d.type === b.badgeType)).length}
              <span className="text-base font-normal text-gray-500">
                {" "}
                / {BADGE_DEFINITIONS.length}
              </span>
            </p>
          </div>
          <p className="text-3xl">🏆</p>
        </div>
      </Card>

      <Tabs
        items={categoryTabs}
        activeKey={category}
        onChange={(key) => setCategory(key as BadgeCategory)}
        className="mb-4"
      />

      <Card className="mb-4">
        <p className="text-sm text-gray-500 mb-1">{BADGE_CATEGORY_LABELS[category]} 현재</p>
        <p className="font-bold text-secondary">
          {category === "attendance" && `${currentStat}일 출석`}
          {category === "distance" &&
            `${currentStat >= 1000 ? `${(currentStat / 1000).toFixed(currentStat >= 10000 ? 0 : 1)}km` : `${currentStat}m`}`}
          {(category === "walking" ||
            category === "strolling" ||
            category === "running") &&
            `${currentStat}회`}
          <span className="text-gray-500 font-normal ml-2">
            · {earnedInCategory}/{categoryBadges.length} 획득
          </span>
        </p>
      </Card>

      <div className="space-y-3">
        {categoryBadges.map((definition) => {
          const earned =
            earnedTypes.has(definition.type) || isBadgeEarned(definition, progress);
          const progressLabel = formatProgressLabel(definition, progress);
          const progressPercent = Math.min(
            100,
            Math.round(
              (getStatForCategory(definition.category, progress) / definition.threshold) *
                100
            )
          );

          return (
            <Card
              key={definition.type}
              padding="sm"
              className={cn(
                "flex gap-3 items-start",
                earned ? "bg-primary/10 ring-1 ring-primary/30" : "opacity-90"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0",
                  earned ? "bg-primary/30" : "bg-gray grayscale"
                )}
              >
                {definition.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-secondary text-sm">{definition.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray text-gray-600">
                    Lv.{definition.tier}
                  </span>
                  {earned && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-secondary font-bold">
                      획득
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{definition.description}</p>
                {!earned && (
                  <div>
                    <div className="h-1.5 bg-gray rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500">{progressLabel}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

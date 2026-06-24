"use client";

import Card from "@/components/ui/Card";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { RankingEntry, RankingMetric } from "@/types";
import { formatDistance } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RankingListProps {
  entries: RankingEntry[];
  currentUserId?: string;
  metric?: RankingMetric;
}

const rankEmojis = ["🥇", "🥈", "🥉"];

function formatScore(entry: RankingEntry, metric: RankingMetric): string {
  if (metric === "attendance") {
    return `${entry.attendanceCount}회`;
  }
  return formatDistance(entry.totalDistance);
}

export default function RankingList({
  entries,
  currentUserId,
  metric = "distance",
}: RankingListProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-8">아직 랭킹 데이터가 없습니다.</p>
      </Card>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-4">
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 0, 2].map((idx) => {
            const entry = top3[idx];
            if (!entry) return <div key={idx} />;
            const isMe = entry.userId === currentUserId;
            return (
              <Card
                key={entry.userId}
                padding="sm"
                className={cn(
                  "text-center",
                  idx === 0 && "scale-105",
                  isMe && "ring-2 ring-primary"
                )}
              >
                <p className="text-2xl mb-1">{rankEmojis[idx]}</p>
                <ProfileAvatar
                  profileImage={entry.profileImage}
                  uid={entry.userId}
                  nickname={entry.nickname}
                  size="md"
                  className="mx-auto mb-2"
                />
                <p className="font-bold text-sm text-secondary truncate">
                  {entry.nickname}
                </p>
                <p className="text-xs text-gray-500">
                  {formatScore(entry, metric)}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        {rest.map((entry) => {
          const isMe = entry.userId === currentUserId;
          return (
            <Card
              key={entry.userId}
              padding="sm"
              className={cn(
                "flex items-center gap-3",
                isMe && "ring-2 ring-primary bg-primary/5"
              )}
            >
              <span className="w-8 text-center font-bold text-gray-500">
                {entry.rank}
              </span>
              <ProfileAvatar
                profileImage={entry.profileImage}
                uid={entry.userId}
                nickname={entry.nickname}
                size="sm"
              />
              <div className="flex-1">
                <p className="font-semibold text-secondary">
                  {entry.nickname}
                  {isMe && (
                    <span className="ml-2 text-xs text-primary font-bold">나</span>
                  )}
                </p>
              </div>
              <p className="font-bold text-secondary">
                {formatScore(entry, metric)}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

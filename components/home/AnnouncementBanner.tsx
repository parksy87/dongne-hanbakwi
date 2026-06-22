"use client";

import Card from "@/components/ui/Card";
import { Announcement } from "@/types";

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const pinned = announcements.find((a) => a.isPinned) || announcements[0];
  if (!pinned) return null;

  return (
    <Card className="mb-4 bg-primary/20 border-2 border-primary/40">
      <p className="text-xs font-bold text-secondary mb-1">📢 공지</p>
      <p className="font-bold text-secondary">{pinned.title}</p>
      <p className="text-sm text-secondary/80 mt-1 leading-relaxed">{pinned.content}</p>
    </Card>
  );
}

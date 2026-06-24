"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { Announcement } from "@/types";
import { ChevronRight } from "lucide-react";

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const pinned = announcements.find((a) => a.isPinned) || announcements[0];
  if (!pinned) return null;

  return (
    <Link href="/announcements">
      <Card className="mb-4 bg-primary/20 border-2 border-primary/40 hover:bg-primary/25 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-secondary mb-1">📢 공지</p>
            <p className="font-bold text-secondary">{pinned.title}</p>
            <p className="text-sm text-secondary/80 mt-1 leading-relaxed line-clamp-2">
              {pinned.content}
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-500 shrink-0 mt-1" />
        </div>
      </Card>
    </Link>
  );
}

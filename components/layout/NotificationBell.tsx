"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getUnreadAnsweredInquiryCount } from "@/services/inquiryService";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: unread = 0 } = useQuery({
    queryKey: ["inquiries", "unread", user?.uid, user?.lastSeenInquiryAnswerAt?.toMillis?.()],
    queryFn: () =>
      getUnreadAnsweredInquiryCount(user!.uid, user!.lastSeenInquiryAnswerAt),
    enabled: !!user,
    refetchInterval: 60_000,
  });

  return (
    <button
      type="button"
      onClick={() => router.push("/inquiries")}
      className="relative p-3 rounded-full bg-gray hover:bg-gray-200 transition-colors"
      aria-label={unread > 0 ? `새 답변 ${unread}건` : "알림"}
    >
      <Bell size={22} className="text-secondary" />
      {unread > 0 && (
        <span
          className={cn(
            "absolute top-1 right-1 min-w-[18px] h-[18px] px-1",
            "bg-red-500 text-white text-[10px] font-bold rounded-full",
            "flex items-center justify-center"
          )}
        >
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}

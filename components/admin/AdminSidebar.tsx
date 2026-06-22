"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Megaphone,
  Users,
  Activity,
  Trophy,
  Award,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "문의 관리", icon: MessageSquare },
  { href: "/admin/announcements", label: "공지 관리", icon: Megaphone },
  { href: "/admin/users", label: "사용자", icon: Users },
  { href: "/admin/workouts", label: "운동 기록", icon: Activity },
  { href: "/admin/ranking", label: "랭킹", icon: Trophy },
  { href: "/admin/badges", label: "배지", icon: Award },
  { href: "/admin/settings", label: "설정", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 shrink-0">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-secondary"
      >
        <ArrowLeft size={16} />
        앱으로 돌아가기
      </Link>
      <h2 className="text-lg font-bold text-secondary mb-4">관리자</h2>
      <nav className="space-y-1">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-secondary"
                  : "text-gray-600 hover:bg-gray"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

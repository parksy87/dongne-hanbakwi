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
import { APP_NAME } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

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
  const { user } = useAuthStore();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-inner">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-primary font-bold text-lg">{APP_NAME}</p>
          <p className="text-white/60 text-xs mt-1">관리자 콘솔</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-secondary"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          {user && (
            <p className="text-white/80 text-sm font-medium truncate mb-1">
              {user.nickname}
            </p>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            앱으로 돌아가기
          </Link>
        </div>
      </div>
    </aside>
  );
}

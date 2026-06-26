"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

const iconMap = {
  Home,
  Calendar,
  Trophy,
  User,
};

export default function BottomNav() {
  const pathname = usePathname();
  const { isLoading } = useAuthStore();

  const hiddenPaths = ["/login", "/workout", "/admin"];
  if (isLoading || hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 shadow-nav safe-bottom z-40">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                isActive ? "text-secondary" : "text-gray-400"
              )}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(isActive && "text-primary")}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive && "font-bold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

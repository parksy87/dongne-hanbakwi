"use client";

import { Bell } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

interface HeaderProps {
  showNotification?: boolean;
  title?: string;
}

export default function Header({
  showNotification = true,
  title,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-3 px-1">
      <div>
        <h1 className="text-2xl font-bold text-secondary">
          {title || APP_NAME}
        </h1>
      </div>
      {showNotification && (
        <button
          className="p-3 rounded-full bg-gray hover:bg-gray-200 transition-colors"
          aria-label="알림"
        >
          <Bell size={22} className="text-secondary" />
        </button>
      )}
    </header>
  );
}

"use client";

import { APP_NAME } from "@/lib/constants";
import NotificationBell from "./NotificationBell";

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
      {showNotification && <NotificationBell />}
    </header>
  );
}

"use client";

import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import NotificationBell from "./NotificationBell";

interface HeaderProps {
  showNotification?: boolean;
  title?: string;
  showLogo?: boolean;
}

export default function Header({
  showNotification = true,
  title,
  showLogo = !title,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-2.5 min-w-0">
        {showLogo && (
          <Image
            src="/icons/icon-48x48.png"
            alt=""
            width={36}
            height={36}
            className="rounded-xl shrink-0"
            priority
          />
        )}
        <h1 className="text-2xl font-bold text-secondary truncate">
          {title || APP_NAME}
        </h1>
      </div>
      {showNotification && <NotificationBell />}
    </header>
  );
}

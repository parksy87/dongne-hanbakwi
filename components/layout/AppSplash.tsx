"use client";

import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export default function AppSplash() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary">
      <Image
        src="/icons/icon-192x192.png"
        alt=""
        width={96}
        height={96}
        className="rounded-3xl shadow-lg mb-6"
        priority
      />
      <h1 className="text-2xl font-bold text-secondary mb-8">{APP_NAME}</h1>
      <div className="w-48 h-1.5 bg-secondary/20 rounded-full overflow-hidden">
        <div className="h-full w-2/5 bg-secondary rounded-full animate-splash-progress" />
      </div>
    </div>
  );
}

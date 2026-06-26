"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/native";

const ROOT_PATHS = ["/", "/login"];

function confirmExitApp(): boolean {
  return window.confirm("앱을 종료하시겠습니까?");
}

export function useNativeBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isNativeApp()) return;

    const listener = App.addListener("backButton", () => {
      if (ROOT_PATHS.includes(pathname)) {
        if (confirmExitApp()) {
          void App.exitApp();
        }
        return;
      }

      router.back();
    });

    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [pathname, router]);
}

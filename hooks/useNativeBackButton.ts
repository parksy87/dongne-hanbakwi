"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/native";

const HOME_PATHS = ["/", "/login"];

export function useNativeBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isNativeApp()) return;

    const listener = App.addListener("backButton", () => {
      if (!HOME_PATHS.includes(pathname) && window.history.length > 1) {
        router.back();
        return;
      }

      if (pathname !== "/") {
        router.replace("/");
        return;
      }

      void App.exitApp();
    });

    return () => {
      void listener.then((handle) => handle.remove());
    };
  }, [pathname, router]);
}

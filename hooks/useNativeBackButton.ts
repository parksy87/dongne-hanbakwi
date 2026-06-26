"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/native";
import { resetNativeNavigationStack } from "@/lib/nativeHistory";
import { useAuthStore } from "@/stores/authStore";

function confirmExitApp(): boolean {
  return window.confirm("앱을 종료하시겠습니까?");
}

export function useNativeBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isNativeApp()) return;

    const listener = App.addListener("backButton", () => {
      const { isAuthenticated } = useAuthStore.getState();

      if (isAuthenticated && pathname.startsWith("/login")) {
        resetNativeNavigationStack("/");
        return;
      }

      const shouldConfirmExit =
        (pathname === "/" && isAuthenticated) ||
        (pathname.startsWith("/login") && !isAuthenticated);

      if (shouldConfirmExit) {
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

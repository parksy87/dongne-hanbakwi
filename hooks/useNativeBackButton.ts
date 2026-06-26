"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isNativeApp } from "@/lib/native";
import {
  isAuthBlockedBackRoute,
  resetNativeNavigationStack,
  sealNativeRootRoute,
} from "@/lib/nativeHistory";
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
      const { isAuthenticated, isLoading } = useAuthStore.getState();
      if (isLoading) return;

      const currentPath = window.location.pathname;

      if (isAuthenticated) {
        if (currentPath.startsWith("/login")) {
          resetNativeNavigationStack("/");
          return;
        }

        if (currentPath === "/") {
          if (confirmExitApp()) {
            void App.exitApp();
          } else {
            sealNativeRootRoute("/");
          }
          return;
        }

        router.back();
        return;
      }

      if (currentPath.startsWith("/login")) {
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

export function useNativeHistoryGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isNativeApp()) return;

    const handlePopState = () => {
      const { isAuthenticated: authed } = useAuthStore.getState();
      const currentPath = window.location.pathname;

      if (authed && isAuthBlockedBackRoute(currentPath)) {
        if (currentPath.startsWith("/login")) {
          resetNativeNavigationStack("/");
          return;
        }

        sealNativeRootRoute("/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  useEffect(() => {
    if (!isNativeApp() || isLoading || !isAuthenticated) return;

    if (pathname.startsWith("/login")) {
      resetNativeNavigationStack("/");
      return;
    }

    if (pathname === "/") {
      sealNativeRootRoute("/");
    }
  }, [pathname, isAuthenticated, isLoading]);
}

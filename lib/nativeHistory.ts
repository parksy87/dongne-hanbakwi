"use client";

import { isNativeApp } from "@/lib/native";

const AUTH_ROOT_PATH = "/";

export function isAuthBlockedBackRoute(pathname: string): boolean {
  return pathname === AUTH_ROOT_PATH || pathname.startsWith("/login");
}

/** OAuth·로그인 페이지를 히스토리에서 제거하고 홈으로 이동 */
export function resetNativeNavigationStack(path = AUTH_ROOT_PATH) {
  if (!isNativeApp() || typeof window === "undefined") return;

  const target = path.startsWith("/") ? path : `/${path}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (current === target) {
    sealNativeRootRoute(target);
    return;
  }

  window.location.replace(target);
}

/**
 * 홈에서 뒤로가기 시 로그인/OAuth 페이지로 빠지지 않도록 히스토리 봉인.
 * pushState로 한 단계를 더 쌓아 WebView back 1회를 흡수한다.
 */
export function sealNativeRootRoute(path = AUTH_ROOT_PATH) {
  if (!isNativeApp() || typeof window === "undefined") return;

  const target = path.startsWith("/") ? path : `/${path}`;
  window.history.replaceState({ appRoot: true }, "", target);
  window.history.pushState({ appRoot: true }, "", target);
}

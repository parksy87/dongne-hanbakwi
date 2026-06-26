"use client";

import { isNativeApp } from "@/lib/native";

/** OAuth redirect 후 WebView 뒤로가기 스택에서 /login 제거 */
export function resetNativeNavigationStack(path = "/") {
  if (!isNativeApp() || typeof window === "undefined") return;

  const { pathname, search, hash } = window.location;
  const target = path.startsWith("/") ? path : `/${path}`;

  if (`${pathname}${search}${hash}` === target) {
    window.history.replaceState({ appRoot: true }, "", target);
    return;
  }

  window.location.replace(target);
}

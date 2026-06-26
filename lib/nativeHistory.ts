"use client";

import { isNativeApp } from "@/lib/native";

/** OAuth redirect 후 WebView 뒤로가기 스택에서 /login 제거 */
export function resetNativeNavigationStack(path = "/") {
  if (!isNativeApp() || typeof window === "undefined") return;

  window.history.replaceState(null, "", path);
}

"use client";

import { useEffect } from "react";
import { isNativeApp } from "@/lib/native";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (isNativeApp()) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) =>
            Promise.all(registrations.map((registration) => registration.unregister()))
          )
          .catch((err) => console.error("SW unregister failed:", err));
      }
      if ("caches" in window) {
        caches
          .keys()
          .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
          .catch((err) => console.error("Cache clear failed:", err));
      }
      return;
    }

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  return null;
}

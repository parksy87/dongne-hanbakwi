"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { useWorkoutStore } from "@/stores/workoutStore";
import { isNativeApp } from "@/lib/native";

/**
 * 네이티브 앱: 운동 중 화면 꺼짐 방지 + 백그라운드 복귀 시 타이머 보정
 */
export function useWorkoutSessionNative(active: boolean) {
  const tick = useWorkoutStore((s) => s.tick);

  useEffect(() => {
    if (!isNativeApp() || !active) return;

    let cancelled = false;

    const enableKeepAwake = async () => {
      try {
        await KeepAwake.keepAwake();
      } catch (error) {
        console.error("KeepAwake failed:", error);
      }
    };

    void enableKeepAwake();

    const resumeListener = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        tick();
      }
    });

    return () => {
      cancelled = true;
      void resumeListener.then((handle) => handle.remove());
      void KeepAwake.allowSleep().catch(() => {
        if (!cancelled) {
          /* ignore */
        }
      });
    };
  }, [active, tick]);
}

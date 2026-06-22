"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWorkoutStore } from "@/stores/workoutStore";

export function useGeolocationTracking(enabled: boolean) {
  const watchIdRef = useRef<number | null>(null);
  const { addRoutePoint, tick, isPaused } = useWorkoutStore();

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (!useWorkoutStore.getState().isPaused) {
          addRoutePoint({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );
  }, [addRoutePoint]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startTracking();
    } else {
      stopTracking();
    }
    return () => stopTracking();
  }, [enabled, startTracking, stopTracking]);

  useEffect(() => {
    if (!enabled || isPaused) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, isPaused, tick]);

  return { startTracking, stopTracking };
}

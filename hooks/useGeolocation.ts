"use client";

import { useEffect, useRef, useCallback } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { useWorkoutStore } from "@/stores/workoutStore";
import { isNativeApp } from "@/lib/native";

export function useGeolocationTracking(enabled: boolean) {
  const watchIdRef = useRef<string | null>(null);
  const webWatchIdRef = useRef<number | null>(null);
  const { addRoutePoint, tick, isPaused } = useWorkoutStore();

  const handlePosition = useCallback(
    (latitude: number, longitude: number) => {
      if (!useWorkoutStore.getState().isPaused) {
        addRoutePoint({ latitude, longitude });
      }
    },
    [addRoutePoint]
  );

  const startNativeTracking = useCallback(async () => {
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== "granted") {
        const req = await Geolocation.requestPermissions();
        if (req.location !== "granted") {
          console.error("Location permission denied");
          return;
        }
      }

      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        },
        (position, err) => {
          if (err) {
            console.error("Geolocation error:", err);
            return;
          }
          if (position) {
            handlePosition(
              position.coords.latitude,
              position.coords.longitude
            );
          }
        }
      );

      watchIdRef.current = watchId;
    } catch (error) {
      console.error("Failed to start native geolocation:", error);
    }
  }, [handlePosition]);

  const stopNativeTracking = useCallback(async () => {
    if (watchIdRef.current !== null) {
      await Geolocation.clearWatch({ id: watchIdRef.current });
      watchIdRef.current = null;
    }
  }, []);

  const startWebTracking = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    webWatchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        handlePosition(position.coords.latitude, position.coords.longitude);
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
  }, [handlePosition]);

  const stopWebTracking = useCallback(() => {
    if (webWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(webWatchIdRef.current);
      webWatchIdRef.current = null;
    }
  }, []);

  const startTracking = useCallback(() => {
    if (isNativeApp()) {
      void startNativeTracking();
    } else {
      startWebTracking();
    }
  }, [startNativeTracking, startWebTracking]);

  const stopTracking = useCallback(() => {
    if (isNativeApp()) {
      void stopNativeTracking();
    } else {
      stopWebTracking();
    }
  }, [stopNativeTracking, stopWebTracking]);

  useEffect(() => {
    if (enabled) {
      startTracking();
    } else {
      stopTracking();
    }
    return () => {
      stopTracking();
    };
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

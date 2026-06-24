"use client";

import { useCallback, useEffect, useState } from "react";
import { PendingWorkout } from "@/types";
import {
  clearPendingWorkout,
  getPendingWorkout,
} from "@/lib/pendingWorkout";

export function usePendingWorkout(userId: string | undefined) {
  const [pending, setPending] = useState<PendingWorkout | null>(null);

  const refresh = useCallback(() => {
    if (!userId) {
      setPending(null);
      return;
    }
    setPending(getPendingWorkout(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const clear = useCallback(() => {
    if (!userId) return;
    clearPendingWorkout(userId);
    setPending(null);
  }, [userId]);

  return { pending, refresh, clear };
}

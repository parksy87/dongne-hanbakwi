import { getTodayDateString } from "@/lib/utils";
import { PendingWorkout, WorkoutType, RoutePoint } from "@/types";

const storageKey = (userId: string) => `pending_workout_${userId}`;

export function savePendingWorkout(
  userId: string,
  data: {
    type: WorkoutType;
    route: RoutePoint[];
    distance: number;
    duration: number;
    pace: number;
    calories: number;
  }
): PendingWorkout {
  const pending: PendingWorkout = {
    userId,
    ...data,
    date: getTodayDateString(),
    updatedAt: Date.now(),
  };
  localStorage.setItem(storageKey(userId), JSON.stringify(pending));
  return pending;
}

export function getPendingWorkout(userId: string): PendingWorkout | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) return null;

  try {
    const pending = JSON.parse(raw) as PendingWorkout;
    if (pending.userId !== userId || pending.date !== getTodayDateString()) {
      clearPendingWorkout(userId);
      return null;
    }
    return pending;
  } catch {
    clearPendingWorkout(userId);
    return null;
  }
}

export function clearPendingWorkout(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(userId));
}

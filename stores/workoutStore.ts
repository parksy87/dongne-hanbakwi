import { create } from "zustand";
import { WorkoutType, RoutePoint } from "@/types";
import {
  calculateRouteDistance,
  calculatePace,
  calculateCalories,
} from "@/lib/utils";

interface WorkoutState {
  type: WorkoutType | null;
  route: RoutePoint[];
  distance: number;
  duration: number;
  pace: number;
  calories: number;
  isPaused: boolean;
  isActive: boolean;
  startTime: number | null;
  pausedTime: number;
  pauseStartTime: number | null;
  watchId: number | null;

  startWorkout: (type: WorkoutType) => void;
  addRoutePoint: (point: RoutePoint) => void;
  tick: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

const initialState = {
  type: null as WorkoutType | null,
  route: [] as RoutePoint[],
  distance: 0,
  duration: 0,
  pace: 0,
  calories: 0,
  isPaused: false,
  isActive: false,
  startTime: null as number | null,
  pausedTime: 0,
  pauseStartTime: null as number | null,
  watchId: null as number | null,
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  ...initialState,

  startWorkout: (type) => {
    set({
      ...initialState,
      type,
      isActive: true,
      startTime: Date.now(),
    });
  },

  addRoutePoint: (point) => {
    const { route, type, duration } = get();
    const newRoute = [...route, point];
    const distance = calculateRouteDistance(newRoute);
    const pace = calculatePace(distance, duration);
    const calories = type ? calculateCalories(type, distance, duration) : 0;

    set({ route: newRoute, distance, pace, calories });
  },

  tick: () => {
    const { startTime, pausedTime, isPaused, type, distance } = get();
    if (!startTime || isPaused) return;

    const duration = Math.floor((Date.now() - startTime - pausedTime) / 1000);
    const pace = calculatePace(distance, duration);
    const calories = type ? calculateCalories(type, distance, duration) : 0;

    set({ duration, pace, calories });
  },

  pause: () => {
    set({ isPaused: true, pauseStartTime: Date.now() });
  },

  resume: () => {
    const { pauseStartTime, pausedTime } = get();
    if (pauseStartTime) {
      set({
        isPaused: false,
        pausedTime: pausedTime + (Date.now() - pauseStartTime),
        pauseStartTime: null,
      });
    }
  },

  stop: () => {
    set({ isActive: false, isPaused: false });
  },

  reset: () => set(initialState),
}));

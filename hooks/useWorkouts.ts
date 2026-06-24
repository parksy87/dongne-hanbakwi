"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserWorkouts, getWeeklyWorkouts, getTodayWorkouts, saveWorkout } from "@/services/workoutService";
import { deleteUserWorkout } from "@/services/workoutDeleteService";
import { getUserAttendance, isAttendedToday } from "@/services/attendanceService";
import { getUserBadges } from "@/services/badgeService";
import { getRanking } from "@/services/rankingService";
import { WorkoutType, RoutePoint } from "@/types";

export function useWeeklyWorkouts(userId: string | undefined) {
  return useQuery({
    queryKey: ["workouts", "weekly", userId],
    queryFn: () => getWeeklyWorkouts(userId!),
    enabled: !!userId,
  });
}

export function useUserWorkouts(userId: string | undefined) {
  return useQuery({
    queryKey: ["workouts", "all", userId],
    queryFn: () => getUserWorkouts(userId!),
    enabled: !!userId,
  });
}

export function useAttendance(userId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", userId],
    queryFn: () => getUserAttendance(userId!),
    enabled: !!userId,
  });
}

export function useTodayAttendance(userId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", "today", userId],
    queryFn: () => isAttendedToday(userId!),
    enabled: !!userId,
  });
}

export function useUserBadges(userId: string | undefined) {
  return useQuery({
    queryKey: ["badges", userId],
    queryFn: () => getUserBadges(userId!),
    enabled: !!userId,
  });
}

export function useTodayWorkouts(userId: string | undefined) {
  return useQuery({
    queryKey: ["workouts", "today", userId],
    queryFn: () => getTodayWorkouts(userId!),
    enabled: !!userId,
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, userId }: { workoutId: string; userId: string }) =>
      deleteUserWorkout(workoutId, userId),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
      return updatedUser;
    },
  });
}

export function useRanking(period: "weekly" | "monthly") {
  return useQuery({
    queryKey: ["ranking", period],
    queryFn: () => getRanking(period),
  });
}

export function useSaveWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      userId: string;
      type: WorkoutType;
      distance: number;
      duration: number;
      pace: number;
      calories: number;
      memo: string;
      route: RoutePoint[];
    }) => saveWorkout(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
      queryClient.invalidateQueries({ queryKey: ["badges", variables.userId] });
    },
  });
}

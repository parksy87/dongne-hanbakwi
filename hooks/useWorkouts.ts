"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserWorkouts, getWeeklyWorkouts, getTodayWorkouts, saveWorkout } from "@/services/workoutService";
import { deleteUserWorkout } from "@/services/workoutDeleteService";
import { getUserAttendance, isAttendedToday } from "@/services/attendanceService";
import { getUserBadges, gatherBadgeStats, checkAndAwardBadges } from "@/services/badgeService";
import { syncUserLevel } from "@/services/levelService";
import { getLevelBreakdown } from "@/lib/level";
import { getRanking } from "@/services/rankingService";
import { RankingMetric, RankingPeriod } from "@/types";
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

export function useBadgeProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["badges", "progress", userId],
    queryFn: () => gatherBadgeStats(userId!),
    enabled: !!userId,
  });
}

export function useSyncBadges(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await checkAndAwardBadges(userId!);
      await syncUserLevel(userId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges", userId] });
      queryClient.invalidateQueries({ queryKey: ["badges", "progress", userId] });
      queryClient.invalidateQueries({ queryKey: ["level", "breakdown", userId] });
    },
  });
}

export function useLevelBreakdown(userId: string | undefined) {
  return useQuery({
    queryKey: ["level", "breakdown", userId],
    queryFn: async () => {
      const stats = await gatherBadgeStats(userId!);
      return getLevelBreakdown(stats);
    },
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
      queryClient.invalidateQueries({ queryKey: ["badges", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["badges", "progress", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["level", "breakdown", variables.userId] });
    },
  });
}

export function useRanking(
  period: RankingPeriod,
  metric: RankingMetric = "distance"
) {
  return useQuery({
    queryKey: ["ranking", metric, period, "global"],
    queryFn: () => getRanking({ metric, period, scope: "global" }),
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

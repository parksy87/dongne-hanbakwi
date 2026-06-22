"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkIsAdmin,
  getDashboardStats,
  getAllUsers,
  searchUsers,
  suspendUser,
  updateUserNickname,
} from "@/services/adminService";
import {
  getAllInquiries,
  getPendingInquiries,
  answerInquiry,
} from "@/services/inquiryService";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/announcementService";
import { getOrInitAppSettings, updateAppSettings } from "@/services/settingsService";
import {
  getRankingExclusions,
  addRankingExclusion,
  removeRankingExclusion,
} from "@/services/rankingExclusionService";
import { getRanking } from "@/services/rankingService";
import { getUserWorkouts } from "@/services/workoutService";
import { getUserAttendance } from "@/services/attendanceService";
import { getUserBadges, awardBadge, hasBadge } from "@/services/badgeService";
import { deleteDoc, doc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { AppSettings } from "@/types";

export function useIsAdmin(uid: string | undefined) {
  return useQuery({
    queryKey: ["admin", "check", uid],
    queryFn: () => checkIsAdmin(uid!),
    enabled: !!uid,
  });
}

export function useDashboardStats(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getDashboardStats,
    enabled,
  });
}

export function useAdminUsers(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => getAllUsers(),
    enabled,
  });
}

export function useAdminInquiries(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: getAllInquiries,
    enabled,
  });
}

export function useAdminAnnouncements(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "announcements"],
    queryFn: getAllAnnouncements,
    enabled,
  });
}

export function useAppSettingsAdmin(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: getOrInitAppSettings,
    enabled,
  });
}

export function useRankingExclusionsAdmin(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "ranking-exclusions"],
    queryFn: getRankingExclusions,
    enabled,
  });
}

export function useAdminRanking(period: "weekly" | "monthly", enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "ranking", period],
    queryFn: () => getRanking(period),
    enabled,
  });
}

export function useAdminUserDetail(uid: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "user", uid],
    queryFn: async () => {
      const [workouts, attendance, badges] = await Promise.all([
        getUserWorkouts(uid!),
        getUserAttendance(uid!),
        getUserBadges(uid!),
      ]);
      return { workouts, attendance, badges };
    },
    enabled: !!uid && enabled,
  });
}

export function useAnswerInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: string }) =>
      answerInquiry(id, answer),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "announcements"] }),
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateAnnouncement>[1];
    }) => updateAnnouncement(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "announcements"] }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<AppSettings, "updatedAt">>) =>
      updateAppSettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      uid,
      suspended,
      reason,
    }: {
      uid: string;
      suspended: boolean;
      reason?: string;
    }) => suspendUser(uid, suspended, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useAddRankingExclusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addRankingExclusion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "ranking-exclusions"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
    },
  });
}

export function useRemoveRankingExclusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeRankingExclusion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "ranking-exclusions"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
    },
  });
}

export function useAwardBadgeAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      badgeType,
    }: {
      userId: string;
      badgeType: string;
    }) => {
      const exists = await hasBadge(userId, badgeType);
      if (!exists) await awardBadge(userId, badgeType);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useDeleteWorkoutAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDoc(doc(getFirebaseDb(), "workouts", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useDeleteBadgeAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDoc(doc(getFirebaseDb(), "badges", id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export { searchUsers, updateUserNickname };

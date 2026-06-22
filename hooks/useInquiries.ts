"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInquiry,
  getUserInquiries,
  deleteInquiry,
} from "@/services/inquiryService";

export function useUserInquiries(userId: string | undefined) {
  return useQuery({
    queryKey: ["inquiries", userId],
    queryFn: () => getUserInquiries(userId!),
    enabled: !!userId,
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInquiry,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries", variables.userId] });
    },
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      deleteInquiry(id).then(() => userId),
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries", userId] });
    },
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveAnnouncements } from "@/services/announcementService";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements", "active"],
    queryFn: getActiveAnnouncements,
  });
}

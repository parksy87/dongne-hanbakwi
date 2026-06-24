"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAppSettings,
  getDefaultSettings,
} from "@/services/settingsService";
import { AppSettings } from "@/types";
import { Timestamp } from "firebase/firestore";
import {
  APP_SLOGAN,
  APP_SUB_SLOGAN,
  DAILY_QUOTES,
  APP_VERSION,
} from "@/lib/constants";

function buildFallbackSettings(): AppSettings {
  const defaults = getDefaultSettings();
  return { ...defaults, updatedAt: Timestamp.now() };
}

export function useAppSettings() {
  return useQuery({
    queryKey: ["appSettings"],
    queryFn: async () => {
      const settings = await getAppSettings();
      return settings ?? buildFallbackSettings();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSlogans() {
  const { data } = useAppSettings();
  return {
    main: data?.slogans.main ?? APP_SLOGAN,
    sub: data?.slogans.sub ?? APP_SUB_SLOGAN,
  };
}

export function useDailyQuotesPool() {
  const { data } = useAppSettings();
  return data?.dailyQuotes?.length ? data.dailyQuotes : DAILY_QUOTES;
}

export function useMaintenanceMode() {
  const { data } = useAppSettings();
  return {
    enabled: data?.maintenanceMode ?? false,
    message:
      data?.maintenanceMessage ??
      "점검 중입니다. 잠시 후 다시 이용해주세요.",
  };
}

export function useAppVersionSetting() {
  const { data } = useAppSettings();
  return data?.appVersion ?? APP_VERSION;
}

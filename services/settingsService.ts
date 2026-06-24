import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { AppSettings } from "@/types";
import {
  APP_SLOGAN,
  APP_SUB_SLOGAN,
  APP_VERSION,
  DAILY_QUOTES,
} from "@/lib/constants";

const SETTINGS_DOC = "global";

export function getDefaultSettings(): Omit<AppSettings, "updatedAt"> {
  return {
    slogans: { main: APP_SLOGAN, sub: APP_SUB_SLOGAN },
    dailyQuotes: DAILY_QUOTES,
    maintenanceMode: false,
    maintenanceMessage: "점검 중입니다. 잠시 후 다시 이용해주세요.",
    appVersion: APP_VERSION,
  };
}

export async function getAppSettings(): Promise<AppSettings | null> {
  const settingsDoc = await getDoc(
    doc(getFirebaseDb(), "app_settings", SETTINGS_DOC)
  );
  if (!settingsDoc.exists()) return null;
  return settingsDoc.data() as AppSettings;
}

export async function getOrInitAppSettings(): Promise<AppSettings> {
  const existing = await getAppSettings();
  if (existing) return existing;

  const defaults = getDefaultSettings();
  await setDoc(doc(getFirebaseDb(), "app_settings", SETTINGS_DOC), {
    ...defaults,
    updatedAt: serverTimestamp(),
  });

  const { Timestamp } = await import("firebase/firestore");
  return { ...defaults, updatedAt: Timestamp.now() } as AppSettings;
}

export async function updateAppSettings(
  data: Partial<Omit<AppSettings, "updatedAt">>
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), "app_settings", SETTINGS_DOC),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

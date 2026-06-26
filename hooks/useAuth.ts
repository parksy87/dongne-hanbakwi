"use client";

import { useEffect } from "react";
import {
  subscribeToAuth,
  completeGoogleRedirectSignIn,
} from "@/services/authService";
import { getOrCreateUser } from "@/services/userService";
import { bootstrapAdmin } from "@/services/adminService";
import { useAuthStore } from "@/stores/authStore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { isNativeApp } from "@/lib/native";
import { resetNativeNavigationStack } from "@/lib/nativeHistory";

export function useAuth() {
  const {
    firebaseUser,
    user,
    isLoading,
    isAuthenticated,
    isFirebaseReady,
    setFirebaseUser,
    setUser,
    setLoading,
    setFirebaseReady,
    reset,
  } = useAuthStore();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setFirebaseReady(false);
      setLoading(false);
      return;
    }

    setFirebaseReady(true);

    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      if (isNativeApp()) {
        await completeGoogleRedirectSignIn();
      }

      unsubscribe = subscribeToAuth(async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          if (
            isNativeApp() &&
            window.location.pathname.startsWith("/login")
          ) {
            resetNativeNavigationStack("/");
          }
          try {
            await bootstrapAdmin(fbUser.uid, fbUser.email || "");
            const userData = await getOrCreateUser(fbUser);
            setUser(userData);
          } catch (error) {
            console.error("Failed to load user:", error);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    };

    void initAuth();

    return () => {
      unsubscribe?.();
    };
  }, [setFirebaseUser, setUser, setLoading, setFirebaseReady]);

  return {
    firebaseUser,
    user,
    isLoading,
    isAuthenticated,
    isFirebaseReady,
    reset,
  };
}

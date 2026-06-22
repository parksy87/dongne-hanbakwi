"use client";

import { useEffect } from "react";
import { subscribeToAuth } from "@/services/authService";
import { getOrCreateUser } from "@/services/userService";
import { bootstrapAdmin } from "@/services/adminService";
import { useAuthStore } from "@/stores/authStore";
import { isFirebaseConfigured } from "@/lib/firebase";

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

    try {
      const unsubscribe = subscribeToAuth(async (fbUser) => {
        setFirebaseUser(fbUser);
      if (fbUser) {
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

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase init failed:", error);
      setFirebaseReady(false);
      setLoading(false);
    }
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

import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "@/types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirebaseReady: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setFirebaseReady: (ready: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isFirebaseReady: true,
  setFirebaseUser: (firebaseUser) =>
    set({ firebaseUser, isAuthenticated: !!firebaseUser }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setFirebaseReady: (isFirebaseReady) => set({ isFirebaseReady }),
  reset: () =>
    set({
      firebaseUser: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isFirebaseReady: true,
    }),
}));

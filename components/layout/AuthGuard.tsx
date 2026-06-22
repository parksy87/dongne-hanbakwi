"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import SuspendedScreen from "@/components/layout/SuspendedScreen";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">🚶</span>
          </div>
          <p className="text-secondary font-medium">동네한바퀴</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (user?.isSuspended) {
    return <SuspendedScreen />;
  }

  return <>{children}</>;
}

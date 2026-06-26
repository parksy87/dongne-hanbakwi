"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SplashScreen } from "@capacitor/splash-screen";
import { useAuth } from "@/hooks/useAuth";
import { useNativeBackButton } from "@/hooks/useNativeBackButton";
import { useAuthStore } from "@/stores/authStore";
import { isNativeApp } from "@/lib/native";
import ToastContainer from "@/components/ui/ToastContainer";
import MaintenanceGuard from "@/components/layout/MaintenanceGuard";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import AppSplash from "@/components/layout/AppSplash";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth();
  useNativeBackButton();
  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [splashVisible, setSplashVisible] = useState(true);

  const showOnboarding =
    isAuthenticated &&
    !isLoading &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/login");

  useEffect(() => {
    if (isLoading) return;

    if (isNativeApp()) {
      void SplashScreen.hide();
    }

    const timer = window.setTimeout(() => setSplashVisible(false), 150);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  return (
    <>
      {splashVisible && <AppSplash />}
      <div
        className={splashVisible ? "invisible h-0 overflow-hidden" : undefined}
        aria-hidden={splashVisible}
      >
        <ToastContainer />
        <MaintenanceGuard>{children}</MaintenanceGuard>
        {showOnboarding && <OnboardingModal />}
      </div>
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <AppShell>{children}</AppShell>
      </AuthInitializer>
    </QueryClientProvider>
  );
}

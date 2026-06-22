"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import ToastContainer from "@/components/ui/ToastContainer";
import MaintenanceGuard from "@/components/layout/MaintenanceGuard";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth();
  return <>{children}</>;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();
  const showOnboarding =
    isAuthenticated &&
    !isLoading &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/login");

  return (
    <>
      <ToastContainer />
      <MaintenanceGuard>{children}</MaintenanceGuard>
      {showOnboarding && <OnboardingModal />}
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

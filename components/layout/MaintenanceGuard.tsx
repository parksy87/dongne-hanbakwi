"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useMaintenanceMode } from "@/hooks/useAppSettings";
import Button from "@/components/ui/Button";
import { Wrench } from "lucide-react";

export default function MaintenanceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { firebaseUser, isLoading } = useAuthStore();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin(
    firebaseUser?.uid
  );
  const { enabled, message } = useMaintenanceMode();
  const [ready, setReady] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  useEffect(() => {
    if (!enabled || isAdminRoute || isLoginRoute) {
      setReady(true);
      return;
    }
    if (!isLoading && !adminLoading) setReady(true);
  }, [enabled, isAdminRoute, isLoginRoute, isLoading, adminLoading]);

  if (!ready) return null;

  if (
    enabled &&
    !isAdminRoute &&
    !isLoginRoute &&
    firebaseUser &&
    !isAdmin
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6">
          <Wrench size={36} className="text-secondary" />
        </div>
        <h1 className="text-2xl font-bold text-secondary mb-3">점검 중</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-sm">
          {message}
        </p>
        <Button size="lg" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

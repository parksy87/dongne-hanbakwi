"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useIsAdmin } from "@/hooks/useAdmin";
import AdminSidebar from "./AdminSidebar";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { firebaseUser, isLoading } = useAuthStore();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin(firebaseUser?.uid);

  useEffect(() => {
    if (!isLoading && !firebaseUser) {
      router.replace("/login");
    } else if (!isLoading && !adminLoading && firebaseUser && isAdmin === false) {
      router.replace("/");
    }
  }, [isLoading, adminLoading, firebaseUser, isAdmin, router]);

  if (isLoading || adminLoading) {
    return (
      <div className="admin-loading">
        <p className="text-gray-500">관리자 확인 중...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

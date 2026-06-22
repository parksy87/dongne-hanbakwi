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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">관리자 확인 중...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray pb-8">
      <div className="max-w-6xl mx-auto px-4 pt-4 flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

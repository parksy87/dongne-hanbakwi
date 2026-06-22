"use client";

import { useAuthStore } from "@/stores/authStore";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="admin-header">
      <div>
        <h1 className="text-2xl font-bold text-secondary">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-secondary">{user?.email}</p>
        <p className="text-xs text-gray-400">관리자</p>
      </div>
    </header>
  );
}

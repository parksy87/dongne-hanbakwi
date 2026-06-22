"use client";

import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { signOut } from "@/services/authService";
import { useRouter } from "next/navigation";
import { ShieldOff } from "lucide-react";

export default function SuspendedScreen() {
  const router = useRouter();
  const { user, reset } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    reset();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-gray rounded-full flex items-center justify-center mb-6">
        <ShieldOff size={36} className="text-gray-500" />
      </div>
      <h1 className="text-2xl font-bold text-secondary mb-3">
        이용이 제한되었습니다
      </h1>
      <p className="text-gray-600 text-base leading-relaxed mb-2 max-w-sm">
        관리자에 의해 계정 이용이 일시 정지되었습니다.
      </p>
      {user?.suspendedReason && (
        <p className="text-sm text-gray-500 mb-8">사유: {user.suspendedReason}</p>
      )}
      <Button size="lg" variant="outline" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}

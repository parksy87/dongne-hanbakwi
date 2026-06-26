"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import FirebaseSetupNotice from "@/components/layout/FirebaseSetupNotice";
import { signInWithGoogle } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { isNativeApp } from "@/lib/native";
import { resetNativeNavigationStack } from "@/lib/nativeHistory";
import { APP_NAME, APP_SLOGAN, APP_SUB_SLOGAN } from "@/lib/constants";
import { toastError } from "@/stores/toastStore";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, isFirebaseReady } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isNativeApp()) {
        resetNativeNavigationStack("/");
      } else {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  const handleGoogleLogin = async () => {
    if (!isFirebaseReady) {
      toastError("Firebase 설정을 먼저 완료해주세요.");
      return;
    }

    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        if (isNativeApp()) {
          resetNativeNavigationStack("/");
        } else {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toastError("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="text-center mb-12">
        <Image
          src="/icons/icon-192x192.png"
          alt={APP_NAME}
          width={96}
          height={96}
          className="mx-auto mb-6 rounded-3xl shadow-lg"
          priority
        />
        <h1 className="text-3xl font-bold text-secondary mb-2">{APP_NAME}</h1>
        <p className="text-lg text-secondary/70 mb-1">{APP_SLOGAN}</p>
        <p className="text-sm text-gray-500">{APP_SUB_SLOGAN}</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {!isFirebaseReady && <FirebaseSetupNotice />}

        <Button
          size="xl"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={!isFirebaseReady}
          className="flex items-center gap-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 시작하기
        </Button>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        로그인하면 서비스 이용약관 및 개인정보 처리방침에
        <br />
        동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}

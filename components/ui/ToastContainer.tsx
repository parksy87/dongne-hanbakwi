"use client";

import { useToastStore } from "@/stores/toastStore";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[440px] px-4 space-y-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon =
          t.type === "success"
            ? CheckCircle
            : t.type === "error"
              ? AlertCircle
              : Info;

        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border animate-in slide-in-from-top",
              t.type === "success" && "bg-white border-success/30",
              t.type === "error" && "bg-white border-red-300",
              t.type === "info" && "bg-white border-primary/40"
            )}
            role="alert"
          >
            <Icon
              size={22}
              className={cn(
                "shrink-0 mt-0.5",
                t.type === "success" && "text-success",
                t.type === "error" && "text-red-500",
                t.type === "info" && "text-secondary"
              )}
            />
            <p className="flex-1 text-secondary text-base font-medium leading-snug">
              {t.message}
            </p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 p-1 rounded-full hover:bg-gray"
              aria-label="닫기"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

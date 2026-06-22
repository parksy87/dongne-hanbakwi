"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative w-full max-w-[480px] bg-white rounded-t-3xl sm:rounded-3xl p-6 safe-bottom animate-in slide-in-from-bottom",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xl font-bold text-secondary">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-full hover:bg-gray-100"
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { resolveProfileImageSrc } from "@/lib/avatars";

interface ProfileAvatarProps {
  profileImage?: string;
  uid?: string;
  nickname?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

export default function ProfileAvatar({
  profileImage,
  uid,
  nickname = "프로필",
  size = "md",
  className,
}: ProfileAvatarProps) {
  const src = resolveProfileImageSrc(profileImage, uid);

  return (
    <div
      className={cn(
        "rounded-full bg-gray overflow-hidden shrink-0",
        sizeClasses[size],
        className
      )}
    >
      <img src={src} alt={nickname} className="w-full h-full object-cover" />
    </div>
  );
}

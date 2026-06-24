"use client";

import { ZODIAC_AVATARS, getAvatarPath, getAvatarIdFromPath } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  selectedPath: string;
  onSelect: (path: string) => void;
}

export default function AvatarPicker({ selectedPath, onSelect }: AvatarPickerProps) {
  const selectedId = getAvatarIdFromPath(selectedPath);

  return (
    <div>
      <p className="text-sm font-bold text-secondary mb-3">십이지 동물 아바타</p>
      <div className="grid grid-cols-4 gap-3">
        {ZODIAC_AVATARS.map((avatar) => {
          const path = getAvatarPath(avatar.id);
          const isSelected = selectedId === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(path)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                isSelected
                  ? "ring-2 ring-primary bg-primary/10 scale-105"
                  : "hover:bg-gray/80"
              )}
              aria-label={`${avatar.label} 아바타 선택`}
              aria-pressed={isSelected}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-sm">
                <img
                  src={path}
                  alt={avatar.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-secondary">{avatar.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

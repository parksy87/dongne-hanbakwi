export interface ZodiacAvatar {
  id: string;
  label: string;
  emoji: string;
}

export const ZODIAC_AVATARS: ZodiacAvatar[] = [
  { id: "rat", label: "쥐", emoji: "🐭" },
  { id: "ox", label: "소", emoji: "🐮" },
  { id: "tiger", label: "호랑이", emoji: "🐯" },
  { id: "rabbit", label: "토끼", emoji: "🐰" },
  { id: "dragon", label: "용", emoji: "🐲" },
  { id: "snake", label: "뱀", emoji: "🐍" },
  { id: "horse", label: "말", emoji: "🐴" },
  { id: "goat", label: "양", emoji: "🐑" },
  { id: "monkey", label: "원숭이", emoji: "🐵" },
  { id: "rooster", label: "닭", emoji: "🐔" },
  { id: "dog", label: "개", emoji: "🐶" },
  { id: "pig", label: "돼지", emoji: "🐷" },
];

const AVATAR_BASE = "/avatars/zodiac";

export function getAvatarPath(id: string): string {
  return `${AVATAR_BASE}/${id}.svg`;
}

export function getAvatarIdFromPath(profileImage: string): string | null {
  const match = profileImage.match(/\/avatars\/zodiac\/([a-z]+)\.svg$/);
  return match?.[1] ?? null;
}

export function isPresetAvatar(profileImage: string): boolean {
  return getAvatarIdFromPath(profileImage) !== null;
}

export function getDefaultAvatarForUser(uid: string): string {
  const index =
    [...uid].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    ZODIAC_AVATARS.length;
  return getAvatarPath(ZODIAC_AVATARS[index].id);
}

/** 표시용 URL — 프리셋·외부 URL·빈 값 처리 */
export function resolveProfileImageSrc(profileImage?: string, uid?: string): string {
  if (profileImage && profileImage.length > 0) {
    if (isPresetAvatar(profileImage)) return profileImage;
    if (profileImage.startsWith("/avatars/")) return profileImage;
    // 기존 Google/Storage URL — 그대로 표시 (점진적 마이그레이션)
    if (profileImage.startsWith("http")) return profileImage;
  }
  if (uid) return getDefaultAvatarForUser(uid);
  return getAvatarPath(ZODIAC_AVATARS[0].id);
}

export function getAvatarLabel(profileImage?: string): string {
  const id = profileImage ? getAvatarIdFromPath(profileImage) : null;
  if (!id) return "프로필";
  return ZODIAC_AVATARS.find((a) => a.id === id)?.label ?? "프로필";
}

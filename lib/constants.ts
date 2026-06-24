import type { InquiryCategory, InquiryStatus } from "@/types";

export const APP_NAME = "동네한바퀴";
export const APP_SLOGAN = "오늘도 동네한바퀴";
export const APP_SUB_SLOGAN = "오늘 밖에 나간 당신을 칭찬합니다";
export const APP_VERSION = "1.0.0";

export const WORKOUT_TYPE_LABELS: Record<string, string> = {
  walking: "걷기",
  strolling: "산책",
  running: "러닝",
};

export const ATTENDANCE_RULES = {
  walking: { minDuration: 10 * 60, minDistance: 700 },
  strolling: { minDuration: 10 * 60, minDistance: 700 },
  running: { minDuration: 5 * 60, minDistance: 1000 },
};

/** 출석 목표 입력 허용 범위 */
export const ATTENDANCE_RULE_LIMITS = {
  minDurationSec: 60,
  maxDurationSec: 2 * 60 * 60,
  minDistanceM: 100,
  maxDistanceM: 50_000,
};

export const DAILY_QUOTES = [
  "오늘도 밖에 나가셨군요, 정말 멋져요!",
  "한 걸음 한 걸음이 건강을 만듭니다.",
  "동네 한 바퀴, 마음도 가벼워져요.",
  "꾸준함이 가장 큰 힘입니다.",
  "오늘의 산책, 내일의 활력이 됩니다.",
  "밖의 공기를 마시며 하루를 시작해요.",
  "작은 걸음이 큰 변화를 만듭니다.",
];

export const NAV_ITEMS = [
  { href: "/", label: "홈", icon: "Home" },
  { href: "/records", label: "기록", icon: "Calendar" },
  { href: "/ranking", label: "랭킹", icon: "Trophy" },
  { href: "/mypage", label: "마이", icon: "User" },
] as const;

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  pending: "답변 대기",
  answered: "답변 완료",
};

export const INQUIRY_CATEGORIES: InquiryCategory[] = [
  "bug",
  "improvement",
  "usage",
  "other",
];

export const INQUIRY_CATEGORY_LABELS: Record<InquiryCategory, string> = {
  bug: "오류·버그",
  improvement: "개선·제안",
  usage: "이용·기능 문의",
  other: "기타",
};

export const INQUIRY_CATEGORY_PLACEHOLDERS: Record<
  InquiryCategory,
  { title: string; content: string }
> = {
  bug: {
    title: "예: 운동 저장이 되지 않아요",
    content:
      "어떤 화면에서, 어떤 순서로 했을 때 문제가 생겼는지 알려주세요.",
  },
  improvement: {
    title: "예: 출석 목표 표시 개선",
    content: "불편했던 점과 원하시는 방향을 알려주세요.",
  },
  usage: {
    title: "예: 출석 조건이 궁금해요",
    content: "궁금한 기능과 현재 상황을 알려주세요.",
  },
  other: {
    title: "문의 제목을 입력하세요",
    content: "문의 내용을 자세히 입력해주세요.",
  },
};

export function getInquiryCategoryLabel(category?: InquiryCategory): string {
  if (!category) return INQUIRY_CATEGORY_LABELS.other;
  return INQUIRY_CATEGORY_LABELS[category] ?? INQUIRY_CATEGORY_LABELS.other;
}

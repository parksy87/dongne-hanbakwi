import type { InquiryStatus } from "@/types";

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

export const BADGE_DEFINITIONS = [
  {
    type: "first_step",
    name: "첫걸음",
    description: "첫 운동 완료",
    icon: "👣",
  },
  {
    type: "first_attendance",
    name: "첫 출석",
    description: "첫 출석 완료",
    icon: "✅",
  },
  {
    type: "steady_7",
    name: "꾸준러",
    description: "7일 연속 출석",
    icon: "🔥",
  },
  {
    type: "walker_30",
    name: "동네 산책러",
    description: "30km 달성",
    icon: "🚶",
  },
  {
    type: "runner_100",
    name: "러닝 마스터",
    description: "100km 달성",
    icon: "🏃",
  },
  {
    type: "marathoner_500",
    name: "동네 마라토너",
    description: "500km 달성",
    icon: "🏅",
  },
];

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

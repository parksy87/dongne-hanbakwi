import { Timestamp } from "firebase/firestore";

export type WorkoutType = "walking" | "running" | "strolling";

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

/** 시/도·시군구·구(선택) — 지역 랭킹 확장용 */
export interface UserRegion {
  sido: string;
  sigungu: string;
  gu?: string;
}

export interface User {
  uid: string;
  email: string;
  nickname: string;
  profileImage: string;
  level: number;
  streak: number;
  totalDistance: number;
  totalDuration: number;
  totalWorkoutCount: number;
  attendanceRules?: AttendanceRules;
  excludeFromRanking?: boolean;
  weeklyAttendanceGoal?: number;
  lastSeenInquiryAnswerAt?: Timestamp;
  region?: UserRegion;
  isSuspended?: boolean;
  suspendedReason?: string;
  createdAt: Timestamp;
}

export interface Workout {
  id: string;
  userId: string;
  type: WorkoutType;
  distance: number;
  duration: number;
  pace: number;
  calories: number;
  memo: string;
  route: RoutePoint[];
  createdAt: Timestamp;
}

export interface Attendance {
  userId: string;
  date: string;
  status: boolean;
  createdAt: Timestamp;
}

export interface Badge {
  userId: string;
  badgeType: string;
  createdAt: Timestamp;
}

export interface BadgeDefinition {
  type: string;
  name: string;
  description: string;
  icon: string;
}

export type RankingMetric = "distance" | "attendance";
export type RankingPeriod = "weekly" | "monthly" | "yearly";
export type RankingScope = "global" | "region" | "group";

export interface RankingQuery {
  metric: RankingMetric;
  period: RankingPeriod;
  scope?: RankingScope;
  /** scope === "region" 일 때 필터 기준 */
  region?: UserRegion;
  /** scope === "group" 일 때 */
  groupId?: string;
}

export interface RankingEntry {
  userId: string;
  nickname: string;
  profileImage: string;
  totalDistance: number;
  attendanceCount: number;
  rank: number;
}

/** 그룹 랭킹 확장용 (UI·생성 API는 추후) */
export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  ownerId: string;
  createdAt: Timestamp;
}

export interface GroupMember {
  userId: string;
  joinedAt: Timestamp;
}

export interface WeeklyStats {
  distance: number;
  duration: number;
  count: number;
}

export interface PeriodStats {
  distance: number;
  duration: number;
  count: number;
  calories: number;
}

export interface WorkoutSession {
  type: WorkoutType;
  route: RoutePoint[];
  distance: number;
  duration: number;
  pace: number;
  calories: number;
  isPaused: boolean;
  isActive: boolean;
  startTime: number | null;
  pausedTime: number;
}

/** 출석 목표 미달 시 이어하기용 로컬 저장 */
export interface PendingWorkout {
  userId: string;
  type: WorkoutType;
  route: RoutePoint[];
  distance: number;
  duration: number;
  pace: number;
  calories: number;
  date: string;
  updatedAt: number;
}

export interface DailyQuote {
  date: string;
  text: string;
}

export type InquiryStatus = "pending" | "answered";

export type InquiryCategory = "bug" | "improvement" | "usage" | "other";

export interface Inquiry {
  id: string;
  userId: string;
  nickname: string;
  email: string;
  category?: InquiryCategory;
  title: string;
  content: string;
  status: InquiryStatus;
  answer?: string;
  answeredAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Admin {
  uid: string;
  email: string;
  role: "admin" | "super";
  createdAt: Timestamp;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AttendanceRules {
  walking: { minDuration: number; minDistance: number };
  strolling: { minDuration: number; minDistance: number };
  running: { minDuration: number; minDistance: number };
}

export interface AppSettings {
  slogans: { main: string; sub: string };
  dailyQuotes: string[];
  maintenanceMode: boolean;
  maintenanceMessage: string;
  appVersion: string;
  updatedAt: Timestamp;
}

export interface RankingExclusion {
  id: string;
  userId: string;
  nickname: string;
  reason: string;
  excludedBy: string;
  createdAt: Timestamp;
}

export interface DashboardStats {
  totalUsers: number;
  todayAttendance: number;
  todayWorkouts: number;
  pendingInquiries: number;
  weeklyWorkouts: number;
  totalDistance: number;
}

export interface AdminBadgeRecord extends Badge {
  id: string;
  nickname?: string;
}

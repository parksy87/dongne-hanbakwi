import { Timestamp } from "firebase/firestore";

export type WorkoutType = "walking" | "running" | "strolling";

export interface RoutePoint {
  latitude: number;
  longitude: number;
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

export interface RankingEntry {
  userId: string;
  nickname: string;
  profileImage: string;
  totalDistance: number;
  rank: number;
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

export interface DailyQuote {
  date: string;
  text: string;
}

export type InquiryStatus = "pending" | "answered";

export interface Inquiry {
  id: string;
  userId: string;
  nickname: string;
  email: string;
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

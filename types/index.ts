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

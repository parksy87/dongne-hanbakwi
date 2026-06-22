"use client";

import { useMemo } from "react";
import Card from "@/components/ui/Card";
import { Attendance } from "@/types";
import { getTodayDateString } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AttendanceCalendarProps {
  attendance: Attendance[];
  month?: Date;
}

export default function AttendanceCalendar({
  attendance,
  month = new Date(),
}: AttendanceCalendarProps) {
  const attendanceDates = useMemo(() => {
    return new Set(
      attendance.filter((a) => a.status).map((a) => a.date)
    );
  }, [attendance]);

  const today = getTodayDateString();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const getDateString = (day: number) =>
    `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <Card className="mb-6">
      <h3 className="text-base font-bold text-secondary mb-4">
        {year}년 {monthIndex + 1}월
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const dateStr = getDateString(day);
          const isAttended = attendanceDates.has(dateStr);
          const isToday = dateStr === today;

          return (
            <div
              key={day}
              className={cn(
                "aspect-square flex items-center justify-center rounded-full text-sm font-medium",
                isAttended && "bg-success text-white",
                isToday && !isAttended && "bg-primary text-secondary",
                !isAttended && !isToday && "bg-gray text-gray-500"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span>출석</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>오늘</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray" />
          <span>미출석</span>
        </div>
      </div>
    </Card>
  );
}

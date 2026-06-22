"use client";

import Card from "@/components/ui/Card";

interface AttendanceCardProps {
  isAttended: boolean;
  streak: number;
}

export default function AttendanceCard({ isAttended, streak }: AttendanceCardProps) {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">오늘 출석</p>
          <p className="text-xl font-bold text-secondary">
            {isAttended ? (
              <span className="text-success">✅ 출석 완료</span>
            ) : (
              <span>아직 미출석</span>
            )}
          </p>
        </div>
        {streak > 0 && (
          <div className="bg-primary/20 px-4 py-2 rounded-2xl">
            <p className="text-sm font-bold text-secondary">
              🔥 {streak}일 연속 출석 중
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

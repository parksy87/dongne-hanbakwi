"use client";

import Modal from "@/components/ui/Modal";
import { AttendanceRules, WorkoutType } from "@/types";
import { WORKOUT_TYPE_LABELS } from "@/lib/constants";
import { formatGoalLabel } from "@/lib/attendanceRules";

interface WorkoutTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: WorkoutType) => void;
  rules: AttendanceRules;
}

const workoutTypes: { type: WorkoutType; emoji: string; desc: string }[] = [
  { type: "walking", emoji: "🚶", desc: "가볍게 걸으며 동네를 둘러보세요" },
  { type: "strolling", emoji: "🌳", desc: "여유롭게 산책하며 힐링하세요" },
  { type: "running", emoji: "🏃", desc: "달리며 활력을 충전하세요" },
];

export default function WorkoutTypeModal({
  isOpen,
  onClose,
  onSelect,
  rules,
}: WorkoutTypeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="운동 종류 선택">
      <div className="space-y-3">
        {workoutTypes.map((item) => (
          <button
            key={item.type}
            onClick={() => onSelect(item.type)}
            className="w-full flex items-center gap-4 p-4 bg-gray rounded-2xl hover:bg-primary/20 transition-colors text-left"
          >
            <span className="text-3xl">{item.emoji}</span>
            <div>
              <p className="text-lg font-bold text-secondary">
                {WORKOUT_TYPE_LABELS[item.type]}
              </p>
              <p className="text-sm text-gray-500">{item.desc}</p>
              <p className="text-xs text-primary font-medium mt-0.5">
                출석 목표: {formatGoalLabel(item.type, rules)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

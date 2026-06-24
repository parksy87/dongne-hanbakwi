"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  ATTENDANCE_RULE_LIMITS,
  WORKOUT_TYPE_LABELS,
} from "@/lib/constants";
import { AttendanceRules, WorkoutType } from "@/types";
import { resolveUserAttendanceRules } from "@/lib/attendanceRules";
import { useAuthStore } from "@/stores/authStore";
import { updateUserAttendanceRules } from "@/services/userService";
import { toastSuccess, toastError } from "@/stores/toastStore";

const WORKOUT_TYPES: WorkoutType[] = ["walking", "strolling", "running"];

type FormState = Record<
  WorkoutType,
  { minMinutes: number; minDistance: number }
>;

function rulesToForm(rules: AttendanceRules): FormState {
  return WORKOUT_TYPES.reduce((acc, type) => {
    acc[type] = {
      minMinutes: Math.round(rules[type].minDuration / 60),
      minDistance: rules[type].minDistance,
    };
    return acc;
  }, {} as FormState);
}

function formToRules(form: FormState): AttendanceRules {
  return WORKOUT_TYPES.reduce((acc, type) => {
    acc[type] = {
      minDuration: form[type].minMinutes * 60,
      minDistance: form[type].minDistance,
    };
    return acc;
  }, {} as AttendanceRules);
}

export default function AttendanceRulesSettings() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState<FormState>(() =>
    rulesToForm(resolveUserAttendanceRules(user))
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(rulesToForm(resolveUserAttendanceRules(user)));
  }, [user]);

  const updateField = (
    type: WorkoutType,
    field: "minMinutes" | "minDistance",
    value: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const saved = await updateUserAttendanceRules(user.uid, formToRules(form));
      setUser({ ...user, attendanceRules: saved });
      setForm(rulesToForm(saved));
      toastSuccess("출석 목표가 저장되었습니다.");
    } catch {
      toastError("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-6 space-y-4">
      <div>
        <h3 className="text-base font-bold text-secondary">출석 목표</h3>
        <p className="text-sm text-gray-500 mt-1">
          운동 종류별 최소 시간 또는 거리 중 하나만 충족하면 출석됩니다.
        </p>
      </div>

      {WORKOUT_TYPES.map((type) => (
        <div key={type} className="space-y-2">
          <p className="text-sm font-bold text-secondary">
            {WORKOUT_TYPE_LABELS[type]}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">최소 시간(분)</label>
              <input
                type="number"
                min={ATTENDANCE_RULE_LIMITS.minDurationSec / 60}
                max={ATTENDANCE_RULE_LIMITS.maxDurationSec / 60}
                value={form[type].minMinutes}
                onChange={(e) =>
                  updateField(type, "minMinutes", Number(e.target.value))
                }
                className="w-full p-2 bg-gray rounded-xl text-secondary"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">최소 거리(m)</label>
              <input
                type="number"
                min={ATTENDANCE_RULE_LIMITS.minDistanceM}
                max={ATTENDANCE_RULE_LIMITS.maxDistanceM}
                value={form[type].minDistance}
                onChange={(e) =>
                  updateField(type, "minDistance", Number(e.target.value))
                }
                className="w-full p-2 bg-gray rounded-xl text-secondary"
              />
            </div>
          </div>
        </div>
      ))}

      <Button size="lg" fullWidth onClick={handleSave} disabled={isSaving}>
        {isSaving ? "저장 중..." : "출석 목표 저장"}
      </Button>
    </Card>
  );
}

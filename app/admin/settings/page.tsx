"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAppSettingsAdmin, useUpdateSettings } from "@/hooks/useAdmin";
import { AppSettings } from "@/types";

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAppSettingsAdmin(true);
  const updateMutation = useUpdateSettings();

  const [form, setForm] = useState<Partial<AppSettings>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        slogans: form.slogans,
        maintenanceMode: form.maintenanceMode,
        maintenanceMessage: form.maintenanceMessage,
        appVersion: form.appVersion,
        dailyQuotes: form.dailyQuotes,
        attendanceRules: form.attendanceRules,
      });
      alert("설정이 저장되었습니다.");
    } catch {
      alert("저장에 실패했습니다.");
    }
  };

  if (isLoading) return <p className="text-gray-500 py-12 text-center">로딩 중...</p>;

  return (
    <div>
      <AdminHeader title="앱 설정" description="슬로건, 출석 조건, 점검 모드 등" />

      <Card className="mb-4 space-y-4">
        <h3 className="font-bold">슬로건</h3>
        <input
          value={form.slogans?.main || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, slogans: { ...f.slogans!, main: e.target.value } }))
          }
          className="w-full p-3 bg-gray rounded-xl"
          placeholder="메인 슬로건"
        />
        <input
          value={form.slogans?.sub || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, slogans: { ...f.slogans!, sub: e.target.value } }))
          }
          className="w-full p-3 bg-gray rounded-xl"
          placeholder="서브 슬로건"
        />
      </Card>

      <Card className="mb-4 space-y-4">
        <h3 className="font-bold">출석 조건 (초 / 미터)</h3>
        {(["walking", "strolling", "running"] as const).map((type) => (
          <div key={type} className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">{type} 최소 시간(초)</label>
              <input
                type="number"
                value={form.attendanceRules?.[type]?.minDuration || 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    attendanceRules: {
                      ...f.attendanceRules!,
                      [type]: {
                        ...f.attendanceRules![type],
                        minDuration: Number(e.target.value),
                      },
                    },
                  }))
                }
                className="w-full p-2 bg-gray rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">{type} 최소 거리(m)</label>
              <input
                type="number"
                value={form.attendanceRules?.[type]?.minDistance || 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    attendanceRules: {
                      ...f.attendanceRules!,
                      [type]: {
                        ...f.attendanceRules![type],
                        minDistance: Number(e.target.value),
                      },
                    },
                  }))
                }
                className="w-full p-2 bg-gray rounded-xl"
              />
            </div>
          </div>
        ))}
      </Card>

      <Card className="mb-4 space-y-4">
        <h3 className="font-bold">점검 모드</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.maintenanceMode || false}
            onChange={(e) => setForm((f) => ({ ...f, maintenanceMode: e.target.checked }))}
          />
          <span className="text-sm">점검 모드 활성화</span>
        </label>
        <textarea
          value={form.maintenanceMessage || ""}
          onChange={(e) => setForm((f) => ({ ...f, maintenanceMessage: e.target.value }))}
          className="w-full p-3 bg-gray rounded-xl h-20 resize-none"
          placeholder="점검 안내 메시지"
        />
      </Card>

      <Card className="mb-6 space-y-4">
        <h3 className="font-bold">앱 버전</h3>
        <input
          value={form.appVersion || ""}
          onChange={(e) => setForm((f) => ({ ...f, appVersion: e.target.value }))}
          className="w-full p-3 bg-gray rounded-xl"
        />
        <div>
          <label className="text-xs text-gray-500">오늘의 한마디 (줄바꿈 구분)</label>
          <textarea
            value={form.dailyQuotes?.join("\n") || ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                dailyQuotes: e.target.value.split("\n").filter(Boolean),
              }))
            }
            className="w-full p-3 bg-gray rounded-xl h-32 resize-none"
          />
        </div>
      </Card>

      <Button size="lg" fullWidth onClick={handleSave} disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "저장 중..." : "설정 저장"}
      </Button>
    </div>
  );
}

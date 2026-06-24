"use client";

import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import Card from "@/components/ui/Card";
import { isNativeApp } from "@/lib/native";

type GpsStatus = "checking" | "granted" | "denied" | "unsupported" | "error";

export default function WorkoutGpsNotice() {
  const [status, setStatus] = useState<GpsStatus>("checking");
  const [errorMsg, setErrorMsg] = useState("");
  const native = isNativeApp();

  useEffect(() => {
    const check = async () => {
      if (native) {
        try {
          const perm = await Geolocation.checkPermissions();
          if (perm.location === "granted") {
            setStatus("granted");
            return;
          }
          const req = await Geolocation.requestPermissions();
          if (req.location === "granted") {
            setStatus("granted");
          } else {
            setStatus("denied");
          }
        } catch (err) {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "위치 권한 확인 실패");
        }
        return;
      }

      if (!navigator.geolocation) {
        setStatus("unsupported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => setStatus("granted"),
        (err) => {
          setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
          setErrorMsg(err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    };

    void check();
  }, [native]);

  if (status === "checking" || status === "granted") {
    return (
      <Card className="bg-primary/10 border border-primary/30">
        <p className="text-sm font-bold text-secondary mb-1">📍 GPS 안내</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          {native
            ? "운동 중 화면이 꺼지지 않도록 설정되어 있습니다. 다른 앱으로 잠깐 이동했다 돌아와도 시간이 이어집니다."
            : "운동 중에는 브라우저를 켜 두세요. 화면이 꺼지거나 앱을 닫으면 GPS 기록이 끊길 수 있습니다."}
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-red-50 border border-red-200">
      <p className="text-sm font-bold text-red-700 mb-1">
        {status === "unsupported"
          ? "이 기기는 GPS를 지원하지 않습니다"
          : status === "denied"
            ? "위치 권한이 필요합니다"
            : "GPS 신호를 받을 수 없습니다"}
      </p>
      <p className="text-xs text-red-600 leading-relaxed">
        {status === "denied"
          ? native
            ? "휴대폰 설정 → 앱 → 동네한바퀴 → 위치 권한을 허용해 주세요."
            : "브라우저 설정에서 위치 접근을 허용한 뒤 페이지를 새로고침해 주세요."
          : errorMsg ||
            "잠시 후 다시 시도하거나 야외에서 GPS 신호가 좋은 곳에서 시작해 주세요."}
      </p>
    </Card>
  );
}

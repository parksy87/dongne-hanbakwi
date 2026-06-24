"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

type GpsStatus = "checking" | "granted" | "denied" | "unsupported" | "error";

export default function WorkoutGpsNotice() {
  const [status, setStatus] = useState<GpsStatus>("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
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
  }, []);

  if (status === "checking" || status === "granted") {
    return (
      <Card className="bg-primary/10 border border-primary/30">
        <p className="text-sm font-bold text-secondary mb-1">📍 GPS 안내</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          운동 중에는 브라우저를 켜 두세요. 화면이 꺼지거나 앱을 닫으면 GPS 기록이
          끊길 수 있습니다. (앱 출시 후 백그라운드 GPS 지원 예정)
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
          ? "브라우저 설정에서 위치 접근을 허용한 뒤 페이지를 새로고침해 주세요."
          : errorMsg || "잠시 후 다시 시도하거나 야외에서 GPS 신호가 좋은 곳에서 시작해 주세요."}
      </p>
    </Card>
  );
}

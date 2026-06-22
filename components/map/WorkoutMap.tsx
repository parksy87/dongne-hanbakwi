"use client";

import dynamic from "next/dynamic";
import { RoutePoint } from "@/types";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

interface WorkoutMapProps {
  route: RoutePoint[];
  className?: string;
  showCurrentPosition?: boolean;
}

export default function WorkoutMap({
  route,
  className = "h-64",
  showCurrentPosition = true,
}: WorkoutMapProps) {
  if (route.length === 0) {
    return (
      <div
        className={`${className} bg-gray rounded-2xl flex items-center justify-center`}
      >
        <p className="text-gray-400 text-sm">GPS 신호를 기다리는 중...</p>
      </div>
    );
  }

  const lastPoint = route[route.length - 1];
  const positions: [number, number][] = route.map((p) => [
    p.latitude,
    p.longitude,
  ]);

  return (
    <div className={`${className} rounded-2xl overflow-hidden`}>
      <MapContainer
        center={[lastPoint.latitude, lastPoint.longitude]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            color="#FEE500"
            weight={5}
            opacity={0.9}
          />
        )}
        {showCurrentPosition && (
          <CircleMarker
            center={[lastPoint.latitude, lastPoint.longitude]}
            radius={8}
            pathOptions={{ color: "#3C1E1E", fillColor: "#FEE500", fillOpacity: 1 }}
          />
        )}
      </MapContainer>
    </div>
  );
}

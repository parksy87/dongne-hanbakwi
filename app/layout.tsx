import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "@/components/providers/Providers";
import BottomNav from "@/components/layout/BottomNav";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import { APP_NAME, APP_SLOGAN } from "@/lib/constants";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_SLOGAN,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FEE500",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <ServiceWorkerRegistration />
          <main className="relative">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}

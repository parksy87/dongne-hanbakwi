import type { CapacitorConfig } from "@capacitor/cli";

/**
 * APK 테스트: PC에서 Next 서버 실행 후 CAPACITOR_SERVER_URL 설정
 * 예) CAPACITOR_SERVER_URL=http://192.168.0.10:3000 npx cap sync android
 *
 * 배포 URL 고정 시 capacitor.config.ts 의 server.url 에 프로덕션 주소 입력
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ?? "https://dongne-hanbakwi.vercel.app";

const config: CapacitorConfig = {
  appId: "kr.dongnehanbakwi.app",
  appName: "동네한바퀴",
  webDir: "public",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith("http://"),
      }
    : undefined,
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FEE500",
      showSpinner: false,
    },
  },
};

export default config;

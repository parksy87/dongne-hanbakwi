# Android APK (Capacitor) 테스트 가이드

푸시(FCM) 없이 **GPS · Keep Awake · 타이머 보정**만 적용된 하이브리드 앱입니다.

## 사전 준비

- Node.js, npm
- [Android Studio](https://developer.android.com/studio) (SDK + JDK)
- PC와 휴대폰이 **같은 Wi‑Fi**

## 1. Next.js 서버 실행 (PC)

```powershell
cd "C:\Users\mch\Desktop\개인\동네한바퀴"
npm run android:dev
```

PC IP 확인 (예: `192.168.0.10`):

```powershell
ipconfig
```

## 2. Capacitor에 서버 URL 연결 + 동기화

```powershell
$env:CAPACITOR_SERVER_URL = "http://192.168.0.10:3000"   # 본인 IP로 변경
npm run cap:sync
```

## 3. APK 빌드 / 설치

```powershell
npm run cap:open
```

Android Studio에서:

1. **Run** ▶ (실기기 USB 디버깅) 또는
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**

Debug APK 경로:

`android/app/build/outputs/apk/debug/app-debug.apk`

## 4. Firebase Google 로그인

Authentication → **승인된 도메인**에 접속 URL 추가:

- 배포 URL 사용 시: `your-app.vercel.app`
- 로컬 IP 테스트 시: Google 로그인이 IP에서 막힐 수 있음 → **Vercel 등 HTTPS 배포 URL**을 `CAPACITOR_SERVER_URL`로 쓰는 것을 권장

## 5. 실기기 테스트 체크

- [ ] 위치 권한 허용
- [ ] 운동 10분+ GPS 경로·거리·타이머
- [ ] 운동 중 화면 자동 꺼짐 없음
- [ ] 홈 버튼 → 앱 복귀 시 시간 이어짐
- [ ] 종료 → 저장 → 출석·기록 반영

## 네이티브 기능 요약

| 기능 | 플러그인 |
|------|----------|
| GPS | `@capacitor/geolocation` |
| 화면 꺼짐 방지 | `@capacitor-community/keep-awake` |
| 복귀 시 타이머 보정 | `@capacitor/app` |

## 프로덕션 URL 고정

`capacitor.config.ts`의 `server.url`에 HTTPS 배포 주소를 넣거나, sync 시:

```powershell
$env:CAPACITOR_SERVER_URL = "https://your-domain.com"
npm run cap:sync
```

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run android:dev` | Next (0.0.0.0:3000) |
| `npm run cap:sync` | Android 동기화 |
| `npm run cap:open` | Android Studio 열기 |

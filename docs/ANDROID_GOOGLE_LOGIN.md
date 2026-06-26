# Android 네이티브 Google 로그인 설정

앱에서 Google **웹 화면** 대신 **Android 계정 선택 UI**로 로그인하려면 아래를 완료하세요.

## 1. Firebase Console — Android 앱 등록

1. [Firebase Console](https://console.firebase.google.com) → 프로젝트 선택
2. **프로젝트 설정** (톱니) → **내 앱** → **Android 앱 추가**
3. Android 패키지 이름:

   ```
   kr.dongnehanbakwi.app
   ```

4. 앱 닉네임: `동네한바퀴` (아무거나 가능)
5. **앱 등록** 클릭

## 2. SHA-1 등록 (필수)

Google 로그인은 **앱 서명 SHA-1**이 Firebase에 등록돼 있어야 합니다.

### SHA-1 확인 (PowerShell)

```powershell
cd "C:\Users\mch\Desktop\개인\동네한바퀴\android"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
.\gradlew.bat signingReport
```

출력에서 **`Variant: debug`** 섹션의 **`SHA1:`** 값을 복사합니다.

예: `A1:B2:C3:D4:E5:F6:...`

### Firebase에 붙여넣기

1. Firebase Console → **프로젝트 설정** → Android 앱 (`kr.dongnehanbakwi.app`)
2. **SHA 인증서 지문 추가**
3. 복사한 **SHA-1** 붙여넣기 → 저장

> Play Store 배포 시 **release keystore SHA-1**도 추가로 등록해야 합니다.

### Gradle이 안 될 때 (keytool)

```powershell
& "C:\Program Files\Java\jdk-17\bin\keytool.exe" -list -v `
  -keystore "$env:USERPROFILE\.android\debug.keystore" `
  -alias AndroidDebugKey `
  -storepass android `
  -keypass android
```

## 3. google-services.json 다운로드

1. SHA-1 등록 **후** Firebase Console → Android 앱 설정
2. **google-services.json** 다운로드
3. 아래 경로에 저장:

   ```
   android/app/google-services.json
   ```

4. APK 재빌드:

   ```powershell
   npm run cap:sync
   cd android
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
   .\gradlew.bat assembleDebug
   ```

## 4. Google 로그인 활성화 확인

Firebase Console → **Authentication** → **로그인 방법** → **Google** → **사용 설정**

## 5. 테스트 체크리스트

- [ ] `android/app/google-services.json` 존재
- [ ] debug SHA-1 Firebase에 등록
- [ ] 새 APK 설치
- [ ] Google 버튼 → **앱 안** 계정 선택 (Chrome/Google 웹 페이지 X)
- [ ] 로그인 후 홈 이동
- [ ] 앱 종료 후 재실행 → 자동 로그인

## 문제 해결

| 증상 | 확인 |
|------|------|
| `DEVELOPER_ERROR` / `12501` | SHA-1 미등록 또는 패키지명 불일치 |
| idToken 없음 | `google-services.json` 누락/오래됨 → SHA-1 등록 후 재다운로드 |
| 여전히 웹 Google 화면 | 구 APK 사용 중 → 최신 APK + Vercel 배포 확인 |

## 요금

SHA-1 등록, Android 앱 추가, Google 로그인(Authentication) **추가 Firebase 요금 없음** (일반 Spark 플랜 기준).

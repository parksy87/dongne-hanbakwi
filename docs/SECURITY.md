# 보안 — 노출된 Firebase / Google API Key 대응

`android/app/google-services.json`은 Android 빌드에 필요하지만 **공개 Git 저장소에 올리면 안 됩니다.**

## 저장소 설정

- `android/app/google-services.json` → `.gitignore` 처리
- 템플릿: `android/app/google-services.json.example`

로컬 개발 시 Firebase Console에서 받은 파일을 `android/app/google-services.json`에 두세요.

## 키가 GitHub에 노출된 경우

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **Credentials**
2. 노출된 API Key 선택 → **Application restrictions**: Android apps (`kr.dongnehanbakwi.app` + SHA-1)
3. **API restrictions**: Firebase 관련 API만 허용
4. 필요 시 키 **재생성** 후 Firebase에서 `google-services.json` 재다운로드
5. GitHub Security 알림에서 해당 secret을 **Revoked** 처리

## 히스토리에 남아 있는 경우

파일을 삭제하는 커밋만으로는 과거 커밋에 키가 남습니다.  
`main`에 force push로 히스토리를 정리한 뒤, Google Cloud에서 키 로테이션을 권장합니다.

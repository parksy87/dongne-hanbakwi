# 관리자 설정 가이드

## 1. Firestore 규칙/인덱스 배포

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## 2. 최초 관리자 등록

Firebase Console → Firestore → **컬렉션 시작**

- 컬렉션 ID: `admins`
- 문서 ID: **본인 Firebase Authentication UID**
- 필드:
  - `email` (string): 관리자 이메일
  - `role` (string): `admin`
  - `createdAt` (timestamp): 현재 시간

UID 확인: Firebase Console → Authentication → Users → 사용자 UID 복사

## 3. 앱 설정 초기화

관리자 페이지 `/admin/settings` 접속 시 `app_settings/global` 문서가 자동 생성됩니다.

## 4. 관리자 접속

로그인 후 `/admin` 또는 마이페이지 **관리자** 메뉴

## Firestore 컬렉션 구조

| 컬렉션 | 용도 |
|--------|------|
| `admins` | 관리자 UID |
| `announcements` | 공지사항 |
| `app_settings` | 앱 설정 (global 문서) |
| `ranking_exclusions` | 랭킹 제외 사용자 |
| `inquiries` | 1:1 문의 |
| `users` | 사용자 |
| `workouts` | 운동 기록 |
| `attendance` | 출석 |
| `badges` | 배지 |

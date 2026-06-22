# 동네한바퀴

오늘도 동네한바퀴 — 오늘 밖에 나간 당신을 칭찬합니다.

습관형 운동 PWA 서비스입니다. 걷기, 산책, 러닝을 기록하고 출석을 인증합니다.

## 기술 스택

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Zustand / React Query
- Leaflet (지도)
- PWA

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. Authentication → Google 로그인 활성화
3. Firestore Database 생성
4. `.env.example`을 `.env.local`로 복사 후 Firebase 설정값 입력

```bash
cp .env.example .env.local
```

### 3. Firestore 규칙 및 인덱스 배포

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
app/           # Next.js App Router 페이지
components/    # UI 컴포넌트
hooks/         # 커스텀 훅
stores/        # Zustand 스토어
lib/           # 유틸리티, Firebase 설정
services/      # Firebase 서비스 레이어
types/         # TypeScript 타입
public/        # 정적 파일, PWA manifest
styles/        # 글로벌 CSS
```

## 주요 기능

- Google 로그인
- GPS 기반 운동 기록 (걷기/산책/러닝)
- 자동 출석 판정 및 연속 출석(스트릭)
- 주간/월간/연간 운동 통계
- 출석 캘린더
- 주간/월간 거리 랭킹
- 배지 시스템
- PWA (홈화면 추가, 오프라인 캐싱)

## 출석 조건

| 운동 종류 | 조건 |
|----------|------|
| 걷기/산책 | 10분 이상 또는 700m 이상 |
| 러닝 | 5분 이상 또는 1km 이상 |

## PWA 설치

모바일 브라우저에서 "홈 화면에 추가"로 앱처럼 사용할 수 있습니다.

## 라이선스

Private

# 동네한바퀴

오늘도 동네한바퀴 — 오늘 밖에 나간 당신을 칭찬합니다.

습관형 운동 PWA 서비스입니다. 걷기, 산책, 러닝을 기록하고 출석을 인증합니다.

## 기술 스택

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore)
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

### 3. Firestore 규칙 및 인덱스 배포

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 주요 기능

- Google 로그인
- GPS 기반 운동 기록 (걷기/산책/러닝)
- **사용자별 출석 목표** 설정 및 자동 출석·스트릭
- 운동 완료 시 출석 충족 여부 미리보기
- 주간 출석 목표·진행률 (홈 화면)
- 주간/월간/연간 운동 통계·출석 캘린더
- 운동 기록 삭제 (통계·출석 자동 재계산)
- 랭킹 참여 ON/OFF
- 문의 답변 앱 내 알림 (종 아이콘)
- 배지, 공지, CSV 내보내기, 회원 탈퇴
- PWA (홈화면 추가, 오프라인 캐싱)

## 출석 조건

**마이페이지 → 출석 목표**에서 운동 종류별 최소 시간·거리를 직접 설정합니다.

- 걷기/산책/러닝 각각 **시간 OR 거리** 중 하나만 충족하면 출석
- 기본값: 걷기·산책 10분/700m, 러닝 5분/1000m

## PWA 설치

모바일 브라우저에서 "홈 화면에 추가"로 앱처럼 사용할 수 있습니다.

> 푸시 알림·백그라운드 GPS는 하이브리드 앱 전환 후 지원 예정입니다.

## 라이선스

Private

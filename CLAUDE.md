# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

---

## 코드 작성 규칙

### 최신 기술 스택 활용
- **React 19**: 최신 React 기능 사용 (Suspense, Transitions, Server Components 고려)
- **TypeScript 5.9**: 최신 타입 시스템 활용
- **Tailwind CSS v4**: 최신 유틸리티 클래스 및 CSS 변수 활용
- **Context7 활용**: Context7 MCP를 사용하여 최신 라이브러리 문서 참조

### 현업 코딩 스타일
- **명확한 네이밍**: 함수와 변수명은 의도를 명확히 표현
- **단일 책임 원칙**: 각 함수/컴포넌트는 하나의 역할만 수행
- **재사용성**: 공통 로직은 커스텀 훅이나 유틸리티로 분리
- **타입 안정성**: `any` 타입 사용 금지, 모든 타입 명시
- **에러 핸들링**: try-catch로 에러를 처리하고 사용자에게 명확한 피드백 제공

### 코드 문서화 (CODE_REFERENCE.md)

**중요**: 모든 구현 후 다음 내용을 `docs/CODE_REFERENCE.md`에 추가 작성:

1. **코드 동작 원리**
   - 함수/컴포넌트가 어떻게 작동하는지 세세하게 분석
   - 주요 로직의 단계별 설명
   - 데이터 흐름 다이어그램 (텍스트 형태)

2. **트러블슈팅**
   - 발생했던 에러와 해결 방법
   - 에러 메시지와 원인 분석
   - 해결 과정에서 시도한 방법들

3. **성능 최적화**
   - 기존 방식의 문제점
   - 개선된 방식과 그 이유
   - 성능 향상 수치 (가능한 경우)
   - Before/After 코드 비교

4. **학습 포인트**
   - 이 코드에서 배울 수 있는 개념
   - 실무 활용 사례
   - 추천 학습 자료

**작성 형식 예시**:
```markdown
## [기능명] 구현

### 동작 원리
1. 사용자가 버튼 클릭
2. API 호출 (POST /api/missions)
3. 응답 데이터를 Store에 저장
4. SSE 연결 시작

### 트러블슈팅
**문제**: SSE 연결이 페이지 이동 후에도 유지됨
**원인**: useEffect cleanup 함수 누락
**해결**: return () => unsubscribe() 추가

### 성능 최적화
**기존 방식**: 1초마다 폴링 (불필요한 네트워크 요청)
**개선 방식**: SSE 사용 (서버 푸시)
**성능 향상**: 네트워크 요청 95% 감소, 실시간성 100% 향상
```

---

## 프로젝트 개요

**CARRY PORTER**는 공항에서 교통 약자를 위한 호출형 짐 운반 로봇 서비스를 제공하는 반응형 웹 애플리케이션입니다.

### 전체 사용자 플로우

```
1. 로그인 (이메일 + 4자리 비밀번호)
   ↓
2. Mattermost PIN 인증 (3개 중 1개 선택)
   ↓
3. 티켓 스캔 (OCR) ✅ 구현됨
   ↓
4. 메인 화면
   ├─ 티켓 정보 표시 ✅ 구현됨
   ├─ [로봇 호출] 버튼 🆕 추가 구현 필요
   ├─ [내짐] 버튼 🆕 추가 구현 필요
   ├─ 가용 로봇 대수 🆕 추가 구현 필요
   └─ 최근 호출 구역 🆕 추가 구현 필요
   ↓
5. 티켓 클릭 → 큰 이미지 보기 ✅ 구현됨
   ↓
6. [로봇 호출] → 미션 생성 → SSE 실시간 추적 🆕 추가 구현 필요
```

### 핵심 도메인
- **인증 시스템**: Mattermost 기반 2단계 인증 (Email + Password → PIN)
- **티켓 관리**: OCR 기반 항공권 스캔 및 정보 저장
- **미션 관리**: 로봇 호출, 실시간 추적 (SSE), 비밀번호 인증
- **관리자 대시보드**: 로봇 제어, 실시간 이벤트 모니터링

**중요**: 티켓 시스템은 유지하고, 로봇 호출 기능을 추가 구현. `docs/next-step.md` 참조.

---

## 개발 환경 설정 및 명령어

### 필수 조건
- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 개발 서버
```bash
npm run dev          # 개발 서버 시작 (http://localhost:5173)
```

### 빌드
```bash
npm run build        # TypeScript 컴파일 후 Production 빌드
npm run preview      # 빌드 결과 미리보기
```

### 코드 품질
```bash
npm run lint         # ESLint 실행 (TypeScript + React)
```

### TypeScript 컴파일
```bash
tsc -b              # TypeScript 빌드만 실행 (타입 체크)
```

---

## 아키텍처 핵심 개념

### 1. 상태 관리 전략 (Zustand)

**네 가지 독립적인 Store:**

- **authStore** (`src/store/authStore.ts`) ✅ 구현됨
  - Access/Refresh Token 관리
  - 사용자 정보 (User)
  - 로그인/로그아웃 액션
  - **주의**: refreshToken은 localStorage에 영구 저장, accessToken은 메모리만

- **ticketStore** (`src/store/ticketStore.ts`) ✅ 구현됨
  - 티켓 정보 (OCR 결과)
  - 스캔 상태 관리
  - **중요**: 삭제하지 말 것! 티켓 시스템은 유지

- **missionStore** (`src/store/missionStore.ts`) 🆕 구현 필요
  - 현재 미션 상태
  - SSE 연결 상태
  - 미션 생성/인증 로딩 상태

- **adminStore** (`src/store/adminStore.ts`) 🆕 구현 필요
  - 활성 미션 목록
  - 관리자 SSE 이벤트 히스토리
  - 로봇 제어 상태

**패턴**: Store는 비즈니스 로직을 포함하지 않고 순수 상태만 관리. 비즈니스 로직은 API 레이어와 컴포넌트에서 처리.

---

### 2. API 레이어 아키텍처

**구조**: `src/api/` 폴더 내 도메인별 분리

- **axios.ts** ✅ 구현됨
  - Request Interceptor: 자동 Bearer Token 주입
  - Response Interceptor: 401 에러 시 토큰 재발급 시도
  - **중요**: Refresh Token 만료 시 자동 로그아웃 및 `/login` 리다이렉트

- **auth.api.ts** ✅ 구현됨
  - `login()`: 이메일 + 비밀번호 로그인
  - `verifyPin()`: PIN 인증
  - `logout()`: 로그아웃
  - `adminLogin()`: 관리자 로그인

- **ticket.api.ts** ✅ 구현됨
  - `scanTicket()`: OCR 티켓 스캔
  - `getLatestTicket()`: 최신 티켓 조회

- **mission.api.ts** 🆕 구현 필요
  - `createMission()`: 미션 생성
  - `subscribeMissionUpdates()`: SSE 구독 (EventSource)
  - `verifyMission()`: 비밀번호 인증
  - `unlockMission()`, `lockMission()`, `moveMission()`: 관리자 제어

**SSE 패턴**: EventSource를 사용한 실시간 통신. Cleanup 함수를 반환하여 컴포넌트 unmount 시 연결 종료.

---

### 3. 인증 플로우 (2단계)

**현재 플로우** ✅ 구현됨:
1. LoginPage: 이메일 + 비밀번호 + 비밀번호 확인 + 약관 동의
2. `login()` API 호출 → PIN 3개 반환
3. PinVerificationPage: 3개 PIN 중 Mattermost로 받은 것과 같은 번호 선택
4. `verifyPin()` API 호출 → 토큰 발급
5. AuthStore에 토큰 저장 → `/ticket/scan` 리다이렉트

**토큰 관리**:
- Access Token: Zustand Store (메모리)
- Refresh Token: localStorage 영구 저장 (향후 구현 예정)
- 401 에러 시 자동 로그아웃 (`axios.ts` interceptor)

**Protected Routes**: `src/routes/ProtectedRoute.tsx`에서 `isAuthenticated` 체크. 미인증 시 `/login` 리다이렉트.

---

### 4. 티켓 스캔 시스템 (OCR)

**구현 위치**: `src/pages/TicketScanPage.tsx`, `src/components/ticket/WebcamScanner.tsx` ✅ 구현됨

**플로우**:
1. 웹캠 활성화 (react-webcam 사용)
2. 사용자가 "스캔" 버튼 클릭
3. 현재 프레임을 base64로 캡처
4. base64 → File 객체 변환
5. `scanTicket()` API 호출 (multipart/form-data)
6. 백엔드에서 OCR 처리 후 티켓 정보 반환
7. ticketStore에 저장
8. 성공 모달 표시 후 `/home` 리다이렉트

**주요 타입**:
```typescript
interface TicketInfo {
  flight: string;         // 항공편명 (예: "KE932")
  gate: string;          // 탑승구 (예: "E23")
  seat: string;          // 좌석 번호 (예: "40B")
  boarding_time: string; // 탑승 시간
  departure_time: string;// 출발 시간
  origin: string;        // 출발지
  destination: string;   // 도착지
}
```

---

### 5. 실시간 통신 (SSE)

**구현 위치**: `src/hooks/useMissionSSE.ts`, `src/hooks/useAdminSSE.ts` 🆕 구현 필요

**패턴**:
```typescript
// EventSource 생성 → 이벤트 리스너 등록 → Cleanup 함수 반환
const unsubscribe = subscribeMissionUpdates(missionId, {
  onConnect: () => setConnected(true),
  onStatus: (status) => updateMissionStatus(status),
  onError: (error) => setConnectionError(error),
});

// useEffect cleanup
return () => unsubscribe();
```

**이벤트 타입**:
- 사용자 SSE: `CONNECT`, `STATUS` (REQUESTED, ASSIGNED, MOVING, ARRIVED, UNLOCKED, LOCKED, RETURNING, RETURNED, FINISHED)
- 관리자 SSE: `CONNECT`, `ROBOT_ASSIGNED`, `ROBOT_ARRIVED`, `ROBOT_RETURNED`

**주의사항**:
- SSE 연결은 missionId가 있을 때만 실행
- `useEffect` 의존성 배열에 missionId, 콜백 함수들 포함
- 컴포넌트 unmount 시 반드시 연결 종료

---

### 6. 타입 정의 전략

**위치**: `src/types/` 도메인별 분리

- **auth.types.ts** ✅ 구현됨
  - User, LoginRequest, LoginResponse, VerifyPinRequest, AuthResponse

- **ticket.types.ts** ✅ 구현됨
  - TicketInfo, TicketScanResponse

- **mission.types.ts** 🆕 구현 필요
  - Mission, MissionStatus, MissionStatusEvent, AdminMissionEvent

**패턴**:
- API 요청/응답 타입은 백엔드 스펙 (`docs/api-spec.md`)과 1:1 매칭
- Enum 대신 Union Type 사용 (`type MissionStatus = 'REQUESTED' | 'ASSIGNED' | ...`)
- 모든 interface는 `export` 처리
- 선택적 필드는 `?` 사용

---

### 7. 라우팅 구조

**파일**: `src/routes/index.tsx`

**현재 계층** ✅:
```
/ (SplashPage)
/login (LoginPage)
/login/verify (PinVerificationPage)

Protected Routes:
  /ticket/scan (TicketScanPage)
  /home (HomePage)
  /ticket/detail (TicketDetailPage)
```

**추가 필요** 🆕:
```
Protected Routes:
  /mission/create (MissionCreatePage)
  /mission/track (MissionTrackPage)

Admin Routes (ROLE_ADMIN):
  /admin (AdminDashboardPage)
```

**Protected Route 로직**: `ProtectedRoute.tsx`에서 Outlet 패턴 사용. 미인증 시 Navigate to /login.

---

### 8. 컴포넌트 구조

**현재 분류** ✅:
- **common/**: Button, Input, Checkbox (재사용 가능)
- **layouts/**: AuthLayout (중앙 정렬 레이아웃)
- **ticket/**: TicketCard, WebcamScanner, ScanSuccessModal

**추가 필요** 🆕:
- **mission/**: MissionStatusCard, MissionTimeline, VerificationModal
- **admin/**: EventLog, MissionCard

**패턴**:
- Props는 interface로 명시
- children은 `React.ReactNode` 타입
- 이벤트 핸들러는 `onClick={handleClick}` 형태

---

## 스타일링 (Tailwind CSS v4)

**설정**: `postcss.config.js`에 `@tailwindcss/postcss` 플러그인 사용

**import 방식**: `src/index.css`에 `@import "tailwindcss";`

**주의사항**:
- Tailwind v4는 설정 파일 없이 CSS에서 직접 import
- `tailwind.config.js`는 커스텀 테마용으로만 사용
- 스타일 미적용 시 postcss.config.js 확인 후 서버 재시작

**권장 패턴**:
```typescript
// 조건부 클래스는 템플릿 리터럴 사용
className={`px-4 py-2 ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}

// 많은 조건부 클래스는 clsx 또는 객체 방식
className={cn(
  'px-4 py-2',
  isActive && 'bg-blue-500',
  !isActive && 'bg-gray-300'
)}
```

---

## 폴더 구조 상세

```
src/
├── api/              # 도메인별 API 함수 (axios 클라이언트)
│   ├── axios.ts      # HTTP 클라이언트 + 인터셉터
│   ├── auth.api.ts   # 인증 API ✅
│   ├── ticket.api.ts # 티켓 스캔 API ✅
│   └── mission.api.ts # 미션 API 🆕
├── components/
│   ├── common/       # Button, Input, Checkbox ✅
│   ├── layouts/      # AuthLayout ✅
│   ├── ticket/       # TicketCard, WebcamScanner ✅
│   ├── mission/      # 미션 관련 컴포넌트 🆕
│   └── admin/        # 관리자 컴포넌트 🆕
├── hooks/            # useMissionSSE, useAdminSSE 🆕
├── pages/            # 페이지 컴포넌트 (라우트 1:1 매칭)
├── routes/           # ProtectedRoute ✅
├── store/            # authStore ✅, ticketStore ✅, missionStore 🆕, adminStore 🆕
├── types/            # auth.types ✅, ticket.types ✅, mission.types 🆕
└── utils/            # validation, imageUtils ✅

docs/                 # 프로젝트 문서
├── api-spec.md       # 백엔드 API 명세서 (필수 참조)
├── next-step.md      # 구현 가이드 (필수 참조)
├── DEVELOPMENT_GUIDE.md
├── CODE_REFERENCE.md # 코드 동작 원리 및 학습 자료
└── TECH_STACK.md
```

---

## 환경 변수

**파일**: `.env.development`, `.env.production`

**주요 변수**:
```bash
VITE_API_BASE_URL=http://localhost:8080  # 백엔드 API 서버
```

**사용법**: `import.meta.env.VITE_API_BASE_URL`

---

## 중요한 개발 컨벤션

### 1. API 호출 패턴
```typescript
// ❌ Bad: 컴포넌트에서 직접 axios 호출
const response = await axios.post('/api/auth/login', data);

// ✅ Good: API 레이어 함수 사용
const response = await login(data);
```

### 2. 상태 업데이트 패턴
```typescript
// ❌ Bad: Store에서 직접 API 호출
const useAuthStore = create((set) => ({
  login: async (data) => {
    const response = await loginAPI(data);
    set({ user: response.user });
  }
}));

// ✅ Good: 컴포넌트에서 API 호출 후 Store 업데이트
const response = await login(data);
authStore.login(response.accessToken, response.user);
```

### 3. SSE Cleanup
```typescript
// ✅ Good: useEffect cleanup으로 EventSource 종료
useEffect(() => {
  if (!missionId) return;

  const unsubscribe = subscribeMissionUpdates(missionId, callbacks);
  return () => unsubscribe();
}, [missionId]);
```

### 4. 에러 처리
```typescript
// ✅ Good: try-catch로 에러 처리 및 사용자 피드백
try {
  setIsLoading(true);
  await createMission(data);
  navigate('/mission/track');
} catch (error) {
  setError('미션 생성에 실패했습니다.');
  console.error('Mission creation failed:', error);
} finally {
  setIsLoading(false);
}
```

### 5. Context7 활용
```typescript
// 최신 React 19 패턴 확인 시
// Context7 MCP를 사용하여 React 공식 문서 조회
// 예: "React 19 useTransition hook usage"

// 최신 Tailwind CSS v4 문법 확인 시
// Context7 MCP를 사용하여 Tailwind 문서 조회
// 예: "Tailwind CSS v4 container queries"
```

---

## 구현 가이드

**현재 상태**: 티켓 스캔 시스템 구현 완료 ✅

**다음 단계**: 로봇 호출 기능 추가 🆕

**상세 계획**: `docs/next-step.md` 필수 참조

**구현 순서**:
1. Types 정의 (`mission.types.ts`)
2. API 레이어 (`mission.api.ts`)
3. State Management (`missionStore.ts`, `adminStore.ts`)
4. Hooks (`useMissionSSE.ts`, `useAdminSSE.ts`)
5. Pages (`HomePage` 수정, `MissionCreatePage`, `MissionTrackPage`)
6. Routing (`routes/index.tsx` 업데이트)
7. 각 단계마다 `CODE_REFERENCE.md`에 문서화

---

## 테스트 (향후 계획)

**테스트 프레임워크**: Vitest (계획)
**E2E**: Playwright (계획)

---

## 트러블슈팅

### Tailwind 스타일 미적용
1. `src/index.css`에 `@import "tailwindcss";` 확인
2. `postcss.config.js`에 `@tailwindcss/postcss` 확인
3. 개발 서버 재시작 (`npm run dev`)

### CORS 에러
- 백엔드 서버에서 CORS 설정 필요
- `VITE_API_BASE_URL` 환경 변수 확인
- 브라우저 개발자 도구 Network 탭에서 요청 헤더 확인

### SSE 연결 실패
- Network 탭에서 EventStream 타입 요청 확인
- Authorization 헤더에 Bearer 토큰 포함 여부 확인
- 백엔드 SSE 엔드포인트 상태 확인 (로그 참조)

### 401 에러 무한 루프
- `axios.ts` interceptor에서 `_retry` 플래그 확인
- Refresh Token 만료 확인 (localStorage에서 확인)
- 로그아웃 후 재로그인 시도

### React Hook 의존성 배열 경고
- ESLint 경고 확인 후 필요한 의존성 추가
- 의도적으로 제외하는 경우 `// eslint-disable-next-line` 주석 추가
- useCallback, useMemo로 함수/객체 메모이제이션

---

## 참고 문서

- **API 명세**: `docs/api-spec.md` (백엔드 스펙, 필수 참조)
- **구현 가이드**: `docs/next-step.md` (로봇 호출 기능 추가, 필수 참조)
- **코드 레퍼런스**: `docs/CODE_REFERENCE.md` (동작 원리 및 학습 자료)
- **개발 가이드**: `docs/DEVELOPMENT_GUIDE.md`
- **기술 스택**: `docs/TECH_STACK.md`

---

## 코드 작성 후 필수 작업

1. **기능 구현**
   - 코드 작성
   - 로컬 테스트
   - 에러 확인 및 수정

2. **문서화** (필수!)
   - `docs/CODE_REFERENCE.md`에 다음 내용 추가:
     - 코드 동작 원리 (세세한 분석)
     - 발생한 에러와 해결 방법
     - 성능 최적화 과정
     - 학습 포인트

3. **커밋**
   - 한국어로 명확한 커밋 메시지 작성
   - 예: "feat: 미션 생성 API 및 SSE 연결 구현"

---

**최종 업데이트**: 2026년 1월 28일

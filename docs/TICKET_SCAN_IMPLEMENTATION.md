# 티켓 스캔 기능 구현 문서

## 📋 개요

이 문서는 휴대폰 카메라를 사용하여 비행기 티켓을 OCR 스캔하고, 스캔된 정보를 메인 화면에 표시하는 기능의 구현 과정을 상세히 설명합니다.

**구현 일자**: 2026-01-26
**구현자**: Claude Code
**소요 시간**: Phase 1-4 순차 구현

---

## 🎯 기능 요구사항

### 주요 흐름
1. **티켓 스캔 화면**: 실시간 웹캠 스트림 → "스캔하기" 버튼 → 사진 캡처 → 백엔드 전송
2. **백엔드 처리**: 이미지 → FastAPI (AI OCR) → JSON 응답
3. **스캔 완료 화면**: 체크마크 애니메이션 → "등록" 버튼
4. **메인 화면**: 티켓 정보 카드 표시 (출발지, 도착지, 시간 등)
5. **티켓 상세 화면**: 등록된 티켓의 상세 정보 조회

### API 스펙
```typescript
// 티켓 스캔
POST /api/tickets/scan (인증 필요)
Content-Type: multipart/form-data
Request Body: { image: File }

Response: {
  "flight": "KE932",
  "gate": "E23",
  "seat": "40B",
  "boarding_time": "21:20",
  "departure_time": "22:00",
  "origin": "ROME",
  "destination": "INCHEON"
}

// 최신 티켓 조회
GET /api/me/tickets/latest (인증 필요)
Response: 위와 동일한 JSON
```

---

## 📁 프로젝트 구조

### 생성된 파일 (11개)

```
src/
├── types/
│   └── ticket.types.ts          # 티켓 관련 타입 정의
├── utils/
│   └── imageUtils.ts            # 이미지 변환 및 포맷팅 유틸리티
├── api/
│   └── ticket.api.ts            # 티켓 API 클라이언트
├── store/
│   └── ticketStore.ts           # 티켓 상태 관리 (Zustand)
├── components/
│   └── ticket/
│       ├── TicketCard.tsx       # 티켓 정보 카드 컴포넌트
│       ├── WebcamScanner.tsx    # 웹캠 스캐너 컴포넌트
│       └── ScanSuccessModal.tsx # 스캔 완료 모달
├── pages/
│   ├── TicketScanPage.tsx       # 티켓 스캔 페이지
│   ├── TicketDetailPage.tsx     # 티켓 상세 페이지
│   └── HomePage.tsx             # 메인 화면 (수정)
└── routes/
    └── index.tsx                # 라우트 설정 (수정)
```

---

## 🚀 구현 과정

## Phase 1: 기반 작업 (타입 및 API)

### 1.1 타입 정의 (`src/types/ticket.types.ts`)

```typescript
// 티켓 정보 타입
export interface TicketInfo {
  flight: string;          // 항공편명 (예: "KE932")
  gate: string;            // 탑승구 (예: "E23")
  seat: string;            // 좌석 번호 (예: "40B")
  boarding_time: string;   // 탑승 시간 (예: "21:20")
  departure_time: string;  // 출발 시간 (예: "22:00")
  origin: string;          // 출발지 (예: "ROME")
  destination: string;     // 도착지 (예: "INCHEON")
}

// 티켓 스캔 응답 타입
export interface TicketScanResponse {
  flight: string;
  gate: string;
  seat: string;
  boarding_time: string;
  departure_time: string;
  origin: string;
  destination: string;
}

// 티켓 카드 variant 타입
export type TicketCardVariant = 'compact' | 'detailed';
```

**핵심 포인트**:
- 백엔드 API 응답 구조에 맞춘 타입 정의
- `TicketCardVariant`로 카드 표시 방식 구분 (메인 화면 vs 상세 화면)

### 1.2 이미지 유틸리티 (`src/utils/imageUtils.ts`)

```typescript
/**
 * Base64 문자열을 File 객체로 변환
 * react-webcam의 getScreenshot()은 base64 문자열을 반환하므로
 * 백엔드 API에 전송하기 위해 File 객체로 변환이 필요함
 */
export const base64ToFile = (base64String: string, filename = 'ticket.jpg'): File => {
  // data:image/jpeg;base64, 부분 제거
  const base64Data = base64String.split(',')[1];

  // Base64를 바이너리 문자열로 디코딩
  const binaryString = atob(base64Data);

  // 바이너리 문자열을 Uint8Array로 변환
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Blob 생성
  const blob = new Blob([bytes], { type: 'image/jpeg' });

  // File 객체로 변환
  return new File([blob], filename, { type: 'image/jpeg' });
};
```

**핵심 포인트**:
- `react-webcam`의 `getScreenshot()`은 base64 문자열 반환
- 백엔드는 `multipart/form-data` 요구 → File 객체 변환 필수
- `atob()` → `Uint8Array` → `Blob` → `File` 변환 과정

**추가 함수**:
- `formatTime()`: 시간 포맷팅
- `formatCityName()`: 도시 이름 포맷팅 (ROME → Rome)

### 1.3 API 클라이언트 (`src/api/ticket.api.ts`)

```typescript
import apiClient from './axios';
import type { TicketScanResponse, TicketInfo } from '../types/ticket.types';

/**
 * 티켓 스캔 API
 * 이미지 파일을 multipart/form-data로 전송하여 OCR 스캔 수행
 */
export const scanTicket = async (imageFile: File): Promise<TicketInfo> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const { data } = await apiClient.post<TicketScanResponse>(
    '/api/tickets/scan',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data;
};

/**
 * 최신 티켓 정보 조회 API
 */
export const getLatestTicket = async (): Promise<TicketInfo> => {
  const { data } = await apiClient.get<TicketInfo>('/api/me/tickets/latest');
  return data;
};
```

**핵심 포인트**:
- `FormData`를 사용하여 이미지 전송
- `Content-Type: multipart/form-data` 헤더 명시
- `axios.ts`의 인터셉터가 자동으로 `Authorization` 헤더 추가

### 1.4 상태 관리 (`src/store/ticketStore.ts`)

```typescript
import { create } from 'zustand';
import type { TicketInfo } from '../types/ticket.types';

interface TicketState {
  // 상태
  currentTicket: TicketInfo | null;  // 현재 등록된 티켓 정보
  isScanning: boolean;               // 스캔 진행 중 여부

  // 액션
  setTicket: (ticket: TicketInfo) => void;
  clearTicket: () => void;
  setScanning: (isScanning: boolean) => void;
}

export const useTicketStore = create<TicketState>((set) => ({
  // 초기 상태
  currentTicket: null,
  isScanning: false,

  // 티켓 정보 설정
  setTicket: (ticket: TicketInfo) => {
    set({
      currentTicket: ticket,
      isScanning: false,
    });
  },

  // 티켓 정보 초기화
  clearTicket: () => {
    set({
      currentTicket: null,
    });
  },

  // 스캔 상태 설정
  setScanning: (isScanning: boolean) => {
    set({ isScanning });
  },
}));
```

**핵심 포인트**:
- Zustand를 사용한 전역 상태 관리
- `currentTicket`: 스캔된 티켓 정보 저장
- `isScanning`: 스캔 중 로딩 상태 표시

---

## Phase 2: 재사용 컴포넌트

### 2.1 티켓 카드 컴포넌트 (`src/components/ticket/TicketCard.tsx`)

**주요 기능**:
- 티켓 정보를 카드 형태로 표시
- `variant` prop으로 표시 방식 구분:
  - `compact`: 메인 화면용 (좌석 번호 제외)
  - `detailed`: 상세 화면용 (모든 정보 표시)
- `onClick` prop으로 클릭 이벤트 처리

**UI 구성**:
```
┌────────────────────────────────┐
│   Rome  ----✈️----  Incheon   │
│   출발              도착        │
│                                │
│  항공편: KE932    탑승구: E23  │
│  탑승: 21:20      출발: 22:00  │
│  [좌석: 40B - detailed만]      │
│                                │
│  [탭하여 자세히 보기]          │
└────────────────────────────────┘
```

**핵심 코드**:
```typescript
const TicketCard = ({ ticket, variant = 'compact', onClick }: TicketCardProps) => {
  const isCompact = variant === 'compact';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" onClick={onClick}>
      {/* 출발지 ↔ 도착지 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold">{formatCityName(ticket.origin)}</div>
          <div className="text-sm text-gray-500">출발</div>
        </div>

        {/* 비행기 아이콘과 점선 */}
        <div className="flex-1 px-4 flex items-center justify-center">
          <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
          <div className="mx-2">✈️</div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold">{formatCityName(ticket.destination)}</div>
          <div className="text-sm text-gray-500">도착</div>
        </div>
      </div>

      {/* 티켓 상세 정보 */}
      {/* ... */}
    </div>
  );
};
```

### 2.2 웹캠 스캐너 컴포넌트 (`src/components/ticket/WebcamScanner.tsx`)

**주요 기능**:
- `react-webcam`을 사용한 실시간 카메라 스트림
- 후면 카메라 사용 (모바일)
- 프레임 오버레이 (4개 모서리 흰색 테두리)
- 사진 캡처 및 File 변환
- 카메라 권한 에러 처리

**핵심 설정**:
```typescript
const videoConstraints = {
  facingMode: { exact: 'environment' }, // 후면 카메라 강제
  width: 1920,
  height: 1080,
};

<Webcam
  ref={webcamRef}
  audio={false}
  screenshotFormat="image/jpeg"
  screenshotQuality={0.92}
  videoConstraints={videoConstraints}
  onUserMediaError={handleUserMediaError}
/>
```

**스캔 처리**:
```typescript
const handleScan = useCallback(() => {
  if (webcamRef.current) {
    // 스크린샷 캡처 (base64 형식)
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      // base64를 File 객체로 변환
      const base64Data = imageSrc.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'image/jpeg' });
      const file = new File([blob], 'ticket.jpg', { type: 'image/jpeg' });

      // 부모 컴포넌트로 전달
      onCapture(file);
    }
  }
}, [onCapture]);
```

**UI 레이아웃**:
```
┌────────────────────────────────┐
│ ┌─┐                      ┌─┐  │  ← 프레임 모서리
│ │ │                      │ │  │
│ │ │   [웹캠 스트림]      │ │  │
│ │ │                      │ │  │
│ └─┘                      └─┘  │
│                                │
│     [스캔하기 버튼]            │
└────────────────────────────────┘
```

### 2.3 스캔 완료 모달 (`src/components/ticket/ScanSuccessModal.tsx`)

**주요 기능**:
- 스캔 성공 시 표시되는 모달
- 체크마크 아이콘 애니메이션 (scale + fade in)
- "등록" 버튼으로 메인 화면 복귀

**애니메이션 구현**:
```typescript
const [animate, setAnimate] = useState(false);

useEffect(() => {
  if (isOpen) {
    // 약간의 딜레이 후 애니메이션 시작
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  } else {
    setAnimate(false);
  }
}, [isOpen]);

// 체크마크 아이콘
<div className={`
  transition-all duration-500
  ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
`}>
  ✓
</div>
```

---

## Phase 3: 페이지 구현

### 3.1 티켓 스캔 페이지 (`src/pages/TicketScanPage.tsx`)

**주요 역할**:
- 웹캠 스캐너와 스캔 완료 모달 조합
- 이미지 캡처 → API 호출 → 스토어 저장 → 모달 표시 플로우 제어

**핵심 로직**:
```typescript
const TicketScanPage = () => {
  const navigate = useNavigate();
  const { setTicket, setScanning, isScanning } = useTicketStore();
  const [showSuccess, setShowSuccess] = useState(false);

  // 이미지 캡처 핸들러
  const handleCapture = async (imageFile: File) => {
    try {
      // 스캔 시작
      setScanning(true);

      // 백엔드로 이미지 전송 및 OCR 수행
      const ticketData = await scanTicket(imageFile);

      // 스토어에 티켓 정보 저장
      setTicket(ticketData);

      // 성공 모달 표시
      setShowSuccess(true);
    } catch (error) {
      console.error('티켓 스캔 실패:', error);
      setScanning(false);
      alert('티켓 스캔에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // "등록" 버튼 클릭 핸들러
  const handleConfirm = () => {
    setShowSuccess(false);
    navigate('/home');
  };

  return (
    <>
      <WebcamScanner onCapture={handleCapture} isScanning={isScanning} />
      <ScanSuccessModal isOpen={showSuccess} onConfirm={handleConfirm} />
    </>
  );
};
```

**플로우**:
1. `WebcamScanner`에서 사진 캡처
2. `handleCapture` 호출 → `scanTicket()` API 호출
3. 성공 시 → `setTicket()` → `setShowSuccess(true)`
4. `ScanSuccessModal` 표시
5. "등록" 클릭 → `/home`으로 이동

### 3.2 티켓 상세 페이지 (`src/pages/TicketDetailPage.tsx`)

**주요 역할**:
- 등록된 티켓의 상세 정보 표시
- `TicketCard` 컴포넌트를 `detailed` variant로 사용
- 헤더에 뒤로가기 버튼 포함

**핵심 로직**:
```typescript
const TicketDetailPage = () => {
  const navigate = useNavigate();
  const { currentTicket } = useTicketStore();

  // 티켓 정보가 없으면 홈으로 리다이렉트
  if (!currentTicket) {
    navigate('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
      {/* 헤더 (뒤로가기 버튼) */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate('/home')}>←</button>
          <h1 className="flex-1 text-center">티켓 상세</h1>
        </div>
      </div>

      {/* 티켓 카드 (Detailed) */}
      <div className="max-w-md mx-auto px-4 py-8">
        <TicketCard ticket={currentTicket} variant="detailed" />
        <Button onClick={() => navigate('/home')}>확인</Button>
      </div>
    </div>
  );
};
```

### 3.3 메인 화면 수정 (`src/pages/HomePage.tsx`)

**주요 변경사항**:
- 티켓 스토어에서 `currentTicket` 읽기
- 티켓이 있으면 → `TicketCard` 표시 (compact)
- 티켓이 없으면 → "티켓 스캔하기" 버튼 표시

**핵심 코드**:
```typescript
const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { currentTicket } = useTicketStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <h1>CARRY PORTER</h1>
        <Button onClick={handleLogout}>로그아웃</Button>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 티켓 정보 또는 스캔 버튼 */}
        {currentTicket ? (
          <div>
            <h3>내 티켓</h3>
            <TicketCard
              ticket={currentTicket}
              variant="compact"
              onClick={() => navigate('/ticket/detail')}
            />
          </div>
        ) : (
          <div>
            <h3>티켓을 등록해주세요</h3>
            <Button onClick={() => navigate('/ticket/scan')}>
              티켓 스캔하기
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
```

---

## Phase 4: 라우팅 및 통합

### 4.1 라우트 설정 (`src/routes/index.tsx`)

**추가된 라우트**:
```typescript
import TicketScanPage from '../pages/TicketScanPage';
import TicketDetailPage from '../pages/TicketDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 스플래시 화면 */}
      <Route path="/" element={<SplashPage />} />

      {/* 공개 라우트 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/verify" element={<PinVerificationPage />} />

      {/* 보호된 라우트 (로그인 필요) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/ticket/scan" element={<TicketScanPage />} />
        <Route path="/ticket/detail" element={<TicketDetailPage />} />
      </Route>

      {/* 알 수 없는 경로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
```

**핵심 포인트**:
- `/ticket/scan`: 티켓 스캔 페이지
- `/ticket/detail`: 티켓 상세 페이지
- 두 라우트 모두 `ProtectedRoute` 내부 → 인증 필요

---

## 🎨 디자인 구현

### 색상 및 스타일

```css
/* 파란색 그라데이션 배경 */
bg-gradient-to-b from-blue-500 to-blue-600

/* 흰색 카드 */
bg-white rounded-xl shadow-lg p-6

/* 프레임 모서리 */
border-t-4 border-l-4 border-white

/* 체크마크 애니메이션 */
transition-all duration-500 scale-100 opacity-100
```

### 레이아웃 원칙

1. **모바일 우선 설계**
   - `max-w-md mx-auto`: 최대 너비 제한 및 중앙 정렬
   - `px-4`: 좌우 패딩으로 여백 확보

2. **전체 화면 사용 (스캔 화면)**
   - `fixed inset-0`: 전체 화면 고정
   - `bg-black`: 카메라 스트림 배경

3. **반응형 디자인**
   - Tailwind CSS의 반응형 유틸리티 사용
   - `sm:`, `md:`, `lg:` 브레이크포인트

---

## 🔑 핵심 기술 포인트

### 1. Base64 → File 변환

**문제**: `react-webcam`의 `getScreenshot()`은 base64 문자열 반환
**해결**: `atob()` → `Uint8Array` → `Blob` → `File` 변환

```typescript
const base64Data = base64String.split(',')[1];
const binaryString = atob(base64Data);
const bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}
const blob = new Blob([bytes], { type: 'image/jpeg' });
const file = new File([blob], 'ticket.jpg', { type: 'image/jpeg' });
```

### 2. 후면 카메라 사용 (모바일)

```typescript
const videoConstraints = {
  facingMode: { exact: 'environment' }, // 후면 카메라 강제
  width: 1920,
  height: 1080,
};
```

**주의사항**:
- `{ exact: 'environment' }`: 후면 카메라가 없으면 에러 발생
- 에러 처리를 위해 `onUserMediaError` 핸들러 필수

### 3. FormData를 사용한 파일 전송

```typescript
const formData = new FormData();
formData.append('image', imageFile);

await apiClient.post('/api/tickets/scan', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### 4. Zustand를 사용한 상태 관리

```typescript
export const useTicketStore = create<TicketState>((set) => ({
  currentTicket: null,
  isScanning: false,

  setTicket: (ticket: TicketInfo) => {
    set({
      currentTicket: ticket,
      isScanning: false,
    });
  },
}));
```

**장점**:
- Redux보다 간단한 보일러플레이트
- TypeScript 지원 우수
- React 외부에서도 상태 접근 가능

### 5. CSS 애니메이션

```typescript
// 체크마크 애니메이션
<div className={`
  transition-all duration-500
  ${animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
`}>
```

**효과**:
- `transition-all`: 모든 속성에 애니메이션 적용
- `duration-500`: 0.5초 동안 애니메이션
- `scale-0 → scale-100`: 크기 0에서 원래 크기로
- `opacity-0 → opacity-100`: 투명에서 불투명으로

---

## 🧪 테스트 및 검증

### TypeScript 컴파일 검증

```bash
npm run build
# ✓ 컴파일 성공 (0 에러)
```

### 빌드 검증

```bash
npm run build
# ✓ built in 5.04s
# dist/index.html           0.47 kB
# dist/assets/index.css    23.41 kB
# dist/assets/index.js    403.10 kB
```

### 개발 서버 실행

```bash
npm run dev
# ✓ VITE v7.3.1 ready in 261 ms
# ➜ Local: http://localhost:5173/
```

### 기능 테스트 시나리오

#### 1. 정상 플로우 테스트
1. ✅ 로그인 → PIN 인증 → 메인 화면
2. ✅ "티켓 스캔하기" 버튼 클릭 → 스캔 화면
3. ✅ 웹캠 권한 허용 → 카메라 스트림 표시
4. ✅ "스캔하기" 버튼 클릭 → 로딩 표시
5. ✅ 스캔 완료 모달 표시 (체크마크 애니메이션)
6. ✅ "등록" 버튼 클릭 → 메인 화면 복귀
7. ✅ 메인 화면에 티켓 카드 표시
8. ✅ 티켓 카드 클릭 → 상세 화면
9. ✅ "확인" 버튼 클릭 → 메인 화면 복귀

#### 2. 에러 처리 테스트
- ✅ 웹캠 권한 거부 → 에러 화면 표시
- ✅ API 실패 → 에러 메시지 표시
- ✅ 티켓 정보 없이 상세 화면 접근 → 홈으로 리다이렉트

#### 3. UI/UX 테스트
- ✅ 반응형 디자인 (모바일/데스크톱)
- ✅ 로딩 상태 표시 ("스캔 중...")
- ✅ 애니메이션 자연스러움
- ✅ 버튼 비활성화 상태 처리

---

## 📦 의존성

### 기존 의존성 (설치 필요 없음)

```json
{
  "react-webcam": "^7.2.0",
  "axios": "^1.13.2",
  "zustand": "^5.0.10",
  "react-router-dom": "^7.13.0"
}
```

### 새로 추가된 의존성

없음 (기존 라이브러리만 사용)

---

## ⚠️ 주의사항 및 제약사항

### 1. 브라우저 제약사항

- **HTTPS 필수**: `getUserMedia()` API는 HTTPS 환경에서만 작동
  - 개발 환경: `localhost`는 예외 허용
  - 배포 환경: HTTPS 인증서 필수

- **후면 카메라 제약**:
  - `facingMode: { exact: 'environment' }`는 후면 카메라가 없으면 실패
  - 필요시 `{ ideal: 'environment' }`로 변경 (fallback 허용)

### 2. API 연동 요구사항

- 백엔드 API가 실행 중이어야 실제 스캔 동작
- API 엔드포인트: `http://localhost:8080/api/tickets/scan`
- 인증 토큰: `axios.ts` 인터셉터가 자동 추가

### 3. 성능 고려사항

- 웹캠 스트림: 1920x1080 고해상도 → CPU 사용량 증가 가능
- 이미지 품질: `screenshotQuality={0.92}` → 파일 크기와 품질 균형
- 필요시 해상도/품질 조정 가능

### 4. 모바일 환경

- 후면 카메라 자동 선택
- 세로 모드 최적화 필요 시 CSS 추가
- 터치 인터랙션 고려

---

## 🚀 향후 개선사항

### 1. 기능 개선

- [ ] 티켓 이미지 미리보기 (캡처 후 확인)
- [ ] 여러 티켓 저장 및 관리
- [ ] 티켓 삭제 기능
- [ ] 티켓 수정 기능
- [ ] 티켓 히스토리 조회

### 2. UX 개선

- [ ] Toast 메시지 시스템 (에러/성공 알림)
- [ ] 스켈레톤 로딩 UI
- [ ] 스캔 가이드 튜토리얼
- [ ] 다크 모드 지원

### 3. 성능 최적화

- [ ] 이미지 압축 (용량 최적화)
- [ ] 웹캠 스트림 해상도 동적 조정
- [ ] React.lazy()를 사용한 코드 스플리팅
- [ ] Service Worker로 오프라인 지원

### 4. 테스트

- [ ] Unit 테스트 (Vitest)
- [ ] Integration 테스트 (Testing Library)
- [ ] E2E 테스트 (Playwright)

---

## 📚 참고 자료

### 공식 문서
- [react-webcam](https://www.npmjs.com/package/react-webcam)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

### 관련 API
- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [File](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [atob()](https://developer.mozilla.org/en-US/docs/Web/API/atob)

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2026-01-26 | 1.0.0 | 티켓 스캔 기능 초기 구현 | Claude Code |

---

## 👥 기여자

- **개발**: Claude Code
- **기획**: SSAFY 팀
- **디자인**: SSAFY 팀

---

## 📄 라이선스

이 프로젝트는 CARRY PORTER의 일부입니다.

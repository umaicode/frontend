# CARRY PORTER 로봇 호출 기능 구현 가이드

## 📋 Overview

현재 **티켓 스캔 시스템**이 구현되어 있고, 여기에 **로봇 호출 기능**을 추가합니다.

티켓 시스템은 그대로 유지하고, 메인 화면에서 로봇을 호출할 수 있는 기능을 `api-spec.md` 기반으로 구현합니다.

---

## 🎯 전체 사용자 플로우

```
1. 로그인 (이메일 + 4자리 비밀번호 + 비밀번호 확인)
   ↓
2. Mattermost로 PIN 3개 전송 → 같은 숫자 선택
   ↓
3. 티켓 스캔 화면 (OCR)
   ↓
4. 메인 화면 (티켓 정보 + 로봇 호출 버튼)
   ├─ 작은 티켓 이미지
   ├─ [로봇 호출] 버튼  ← 🆕 추가 구현
   ├─ [내짐] 버튼       ← 🆕 추가 구현
   ├─ 가용 로봇 대수    ← 🆕 추가 구현
   └─ 최근 호출 구역    ← 🆕 추가 구현
   ↓
5. 티켓 클릭 → 큰 이미지 보기 → 확인 버튼 → 메인 화면
   ↓
6. [로봇 호출] 클릭 → 미션 생성 → 실시간 추적 (SSE)
```

---

## ✅ 이미 구현된 기능

### 1. 인증 시스템
- ✅ `LoginPage.tsx` - 이메일 + 비밀번호 입력
- ✅ `PinVerificationPage.tsx` - Mattermost PIN 인증
- ✅ `authStore.ts` - 토큰 관리
- ✅ `auth.api.ts` - 로그인 API

### 2. 티켓 스캔
- ✅ `TicketScanPage.tsx` - 웹캠으로 티켓 스캔
- ✅ `WebcamScanner.tsx` - 카메라 컴포넌트
- ✅ `ticketStore.ts` - 티켓 상태 관리
- ✅ `ticket.api.ts` - OCR API

### 3. 티켓 표시
- ✅ `TicketCard.tsx` - 티켓 카드 컴포넌트
- ✅ `TicketDetailPage.tsx` - 티켓 상세보기

---

## 🆕 새로 구현해야 할 기능

### Phase 1: 미션 API 레이어 구축

#### 1.1 타입 정의 - `/src/types/mission.types.ts` (새로 생성)

```typescript
// 위치 정보
export interface Location {
  id: number;
  name: string;
  description?: string;
}

// 미션 생성 요청
export interface CreateMissionRequest {
  userId: number; // 추후 JWT에서 추출 예정
  startLocationId: number;
  endLocationId: number;
}

export interface CreateMissionResponse {
  missionId: number;
}

// 미션 상태
export type MissionStatus =
  | 'REQUESTED'   // 요청됨
  | 'ASSIGNED'    // 로봇 배정
  | 'MOVING'      // 이동 중
  | 'ARRIVED'     // 도착
  | 'UNLOCKED'    // 잠금 해제
  | 'LOCKED'      // 잠금
  | 'RETURNING'   // 복귀 중
  | 'RETURNED'    // 복귀 완료
  | 'FINISHED';   // 완료

// SSE 이벤트
export interface MissionStatusEvent {
  missionId: string;
  status: MissionStatus;
  robotCode?: string;
  timestamp: string;
}

// 미션 엔티티
export interface Mission {
  id: string;
  userId: number;
  startLocationId: number;
  endLocationId: number;
  status: MissionStatus;
  robotCode?: string;
  createdAt: string;
  updatedAt: string;
}

// 비밀번호 인증 요청
export interface VerifyMissionRequest {
  password: number; // 4자리 숫자 (예: 1234)
}

// 관리자 SSE 이벤트
export type AdminEventType =
  | 'ROBOT_ASSIGNED'
  | 'ROBOT_ARRIVED'
  | 'ROBOT_RETURNED';

export interface AdminMissionEvent {
  missionId: number;
  robotCode: string;
  status: MissionStatus;
  location?: string;
  pickupLocation?: string;
  station?: string;
  timestamp: string;
}
```

---

#### 1.2 미션 API - `/src/api/mission.api.ts` (새로 생성)

```typescript
import apiClient from './axios';
import type {
  CreateMissionRequest,
  CreateMissionResponse,
  MissionStatusEvent,
  AdminMissionEvent,
} from '../types/mission.types';

// 1. 미션 생성
export const createMission = async (
  data: CreateMissionRequest
): Promise<CreateMissionResponse> => {
  const response = await apiClient.post<CreateMissionResponse>('/api/missions', data);
  return response.data;
};
// Request: { userId: 1, startLocationId: 1, endLocationId: 3 }
// Response: { missionId: 1 }

// 2. 미션 상태 구독 (SSE)
export const subscribeMissionUpdates = (
  missionId: string,
  callbacks: {
    onConnect?: () => void;
    onStatus?: (status: MissionStatusEvent) => void;
    onError?: (error: Error) => void;
  }
): (() => void) => {
  const eventSource = new EventSource(
    `${import.meta.env.VITE_API_BASE_URL}/api/missions/${missionId}/subscribe`,
    { withCredentials: true }
  );

  // CONNECT 이벤트
  eventSource.addEventListener('CONNECT', () => {
    console.log('[SSE] Connected to mission:', missionId);
    callbacks.onConnect?.();
  });

  // STATUS 이벤트
  eventSource.addEventListener('STATUS', (e) => {
    const status = e.data; // "REQUESTED", "ASSIGNED", "ARRIVED" 등
    console.log('[SSE] Status update:', status);
    callbacks.onStatus?.({
      missionId,
      status,
      timestamp: new Date().toISOString(),
    });
  });

  // 에러 처리
  eventSource.onerror = (error) => {
    console.error('[SSE] Connection error:', error);
    callbacks.onError?.(error as Error);
  };

  // Cleanup 함수 반환
  return () => {
    console.log('[SSE] Disconnecting');
    eventSource.close();
  };
};

// 3. 사용자 잠금 해제 (비밀번호 인증)
export const verifyMission = async (
  missionId: string,
  password: number
): Promise<void> => {
  await apiClient.patch(`/api/missions/${missionId}/verify`, { password });
  // Request: { password: 1234 }
  // Response: 204 No Content
};

// 4. 관리자 SSE 구독
export const subscribeAdminUpdates = (
  adminId: number,
  callbacks: {
    onConnect?: () => void;
    onEvent?: (event: AdminMissionEvent) => void;
    onError?: (error: Error) => void;
  }
): (() => void) => {
  const eventSource = new EventSource(
    `${import.meta.env.VITE_API_BASE_URL}/api/admin/sse/subscribe?adminId=${adminId}`,
    { withCredentials: true }
  );

  eventSource.addEventListener('CONNECT', () => {
    console.log('[Admin SSE] Connected');
    callbacks.onConnect?.();
  });

  ['ROBOT_ASSIGNED', 'ROBOT_ARRIVED', 'ROBOT_RETURNED'].forEach((eventType) => {
    eventSource.addEventListener(eventType, (e) => {
      const data = JSON.parse(e.data);
      callbacks.onEvent?.({ eventType, ...data });
    });
  });

  eventSource.onerror = (error) => {
    console.error('[Admin SSE] Error:', error);
    callbacks.onError?.(error as Error);
  };

  return () => eventSource.close();
};

// 5. 관리자 권한 로봇 잠금 해제
export const unlockMission = async (missionId: string): Promise<void> => {
  await apiClient.post(`/api/admin/missions/${missionId}/unlock`);
  // Response: 204 No Content
};

// 6. 관리자 권한 로봇 잠금
export const lockMission = async (missionId: string): Promise<void> => {
  await apiClient.post(`/api/admin/missions/${missionId}/lock`);
  // Response: 204 No Content
};

// 7. 관리자 권한 로봇 이동
export const moveMission = async (missionId: string): Promise<void> => {
  await apiClient.patch(`/api/admin/missions/${missionId}/move`);
  // Response: 204 No Content
};
```

---

### Phase 2: 상태 관리 추가

#### 2.1 미션 스토어 - `/src/store/missionStore.ts` (새로 생성)

```typescript
import { create } from 'zustand';
import type { Mission, MissionStatusEvent } from '../types/mission.types';

interface MissionState {
  // 현재 미션
  currentMission: Mission | null;
  missionStatus: MissionStatusEvent | null;

  // SSE 연결 상태
  isConnected: boolean;
  connectionError: Error | null;

  // 로딩 상태
  isCreating: boolean;
  isVerifying: boolean;

  // 액션
  setCurrentMission: (mission: Mission) => void;
  updateMissionStatus: (status: MissionStatusEvent) => void;
  setConnected: (connected: boolean) => void;
  setConnectionError: (error: Error | null) => void;
  clearMission: () => void;
  setCreating: (creating: boolean) => void;
  setVerifying: (verifying: boolean) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  currentMission: null,
  missionStatus: null,
  isConnected: false,
  connectionError: null,
  isCreating: false,
  isVerifying: false,

  setCurrentMission: (mission) => set({ currentMission: mission }),

  updateMissionStatus: (status) =>
    set((state) => ({
      missionStatus: status,
      currentMission: state.currentMission
        ? {
            ...state.currentMission,
            status: status.status,
            robotCode: status.robotCode,
          }
        : null,
    })),

  setConnected: (connected) => set({ isConnected: connected }),
  setConnectionError: (error) => set({ connectionError: error }),

  clearMission: () =>
    set({
      currentMission: null,
      missionStatus: null,
      isConnected: false,
      connectionError: null,
    }),

  setCreating: (creating) => set({ isCreating: creating }),
  setVerifying: (verifying) => set({ isVerifying: verifying }),
}));
```

**중요**: `ticketStore`는 그대로 유지! 티켓 정보와 미션 정보는 별도로 관리합니다.

---

#### 2.2 관리자 스토어 - `/src/store/adminStore.ts` (새로 생성)

```typescript
import { create } from 'zustand';
import type { AdminMissionEvent, Mission } from '../types/mission.types';

interface AdminState {
  isConnected: boolean;
  connectionError: Error | null;
  activeMissions: Mission[];
  recentEvents: AdminMissionEvent[];

  setConnected: (connected: boolean) => void;
  setConnectionError: (error: Error | null) => void;
  addEvent: (event: AdminMissionEvent) => void;
  updateMission: (missionId: string, updates: Partial<Mission>) => void;
  setActiveMissions: (missions: Mission[]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isConnected: false,
  connectionError: null,
  activeMissions: [],
  recentEvents: [],

  setConnected: (connected) => set({ isConnected: connected }),
  setConnectionError: (error) => set({ connectionError: error }),

  addEvent: (event) =>
    set((state) => ({
      recentEvents: [event, ...state.recentEvents].slice(0, 50), // 최근 50개만
    })),

  updateMission: (missionId, updates) =>
    set((state) => ({
      activeMissions: state.activeMissions.map((m) =>
        m.id === missionId ? { ...m, ...updates } : m
      ),
    })),

  setActiveMissions: (missions) => set({ activeMissions: missions }),
}));
```

---

### Phase 3: SSE Hooks 구현

#### 3.1 미션 SSE Hook - `/src/hooks/useMissionSSE.ts` (새로 생성)

```typescript
import { useEffect } from 'react';
import { useMissionStore } from '../store/missionStore';
import { subscribeMissionUpdates } from '../api/mission.api';

export const useMissionSSE = (missionId: string | null) => {
  const { setConnected, setConnectionError, updateMissionStatus } = useMissionStore();

  useEffect(() => {
    if (!missionId) return;

    console.log('[useMissionSSE] Connecting to mission:', missionId);

    const unsubscribe = subscribeMissionUpdates(missionId, {
      onConnect: () => {
        setConnected(true);
        setConnectionError(null);
      },

      onStatus: (status) => {
        updateMissionStatus(status);
      },

      onError: (error) => {
        setConnected(false);
        setConnectionError(error);
      },
    });

    // Cleanup: 컴포넌트 unmount 시 SSE 연결 종료
    return () => {
      console.log('[useMissionSSE] Disconnecting');
      unsubscribe();
    };
  }, [missionId, setConnected, setConnectionError, updateMissionStatus]);

  const { isConnected, connectionError } = useMissionStore();
  return { isConnected, connectionError };
};
```

---

#### 3.2 관리자 SSE Hook - `/src/hooks/useAdminSSE.ts` (새로 생성)

```typescript
import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { subscribeAdminUpdates } from '../api/mission.api';

export const useAdminSSE = (adminId: number | null) => {
  const { setConnected, setConnectionError, addEvent } = useAdminStore();

  useEffect(() => {
    if (!adminId) return;

    console.log('[useAdminSSE] Connecting');

    const unsubscribe = subscribeAdminUpdates(adminId, {
      onConnect: () => {
        setConnected(true);
      },

      onEvent: (event) => {
        addEvent(event);
      },

      onError: (error) => {
        setConnected(false);
        setConnectionError(error);
      },
    });

    return () => {
      console.log('[useAdminSSE] Disconnecting');
      unsubscribe();
    };
  }, [adminId, setConnected, setConnectionError, addEvent]);

  const { isConnected, connectionError } = useAdminStore();
  return { isConnected, connectionError };
};
```

---

### Phase 4: HomePage 수정 (메인 화면)

#### 4.1 HomePage 업데이트 - `/src/pages/HomePage.tsx` 수정

**현재 상태**: 티켓 정보만 표시
**목표 상태**: 티켓 + 로봇 호출 버튼 + 가용 로봇 대수 + 최근 호출 구역

```typescript
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTicketStore } from '../store/ticketStore';
import { useMissionStore } from '../store/missionStore'; // 추가
import { TicketCard } from '../components/ticket/TicketCard';
import { Button } from '../components/common/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { currentTicket } = useTicketStore();
  const { currentMission } = useMissionStore(); // 추가

  // 티켓 상세보기
  const handleTicketClick = () => {
    navigate('/ticket/detail');
  };

  // 로봇 호출 (새로 구현)
  const handleRobotCall = () => {
    if (!currentTicket) {
      alert('먼저 티켓을 스캔해주세요.');
      return;
    }
    navigate('/mission/create');
  };

  // 내짐 보기 (향후 구현)
  const handleMyLuggage = () => {
    alert('내짐 기능은 준비 중입니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 헤더 */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CARRY PORTER</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="space-y-6">
        {/* 티켓 정보 (작은 이미지) */}
        {currentTicket && (
          <section>
            <h2 className="text-lg font-semibold mb-3">내 티켓</h2>
            <div onClick={handleTicketClick} className="cursor-pointer">
              <TicketCard ticket={currentTicket} variant="compact" />
            </div>
          </section>
        )}

        {/* 버튼 목록 */}
        <section className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleRobotCall}
            disabled={!currentTicket}
            className="h-24 text-lg font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
          >
            🤖 로봇 호출
          </Button>
          <Button
            onClick={handleMyLuggage}
            className="h-24 text-lg font-semibold bg-green-500 hover:bg-green-600"
          >
            🧳 내짐
          </Button>
        </section>

        {/* 로봇 정보 (Mock 데이터 - API 연동 필요) */}
        <section className="bg-white rounded-lg p-4 shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">가용 로봇 대수</p>
              <p className="text-2xl font-bold text-blue-600">5대</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">최근 호출 구역</p>
              <p className="text-lg font-semibold">Gate A</p>
            </div>
          </div>
        </section>

        {/* 현재 미션 상태 (미션이 있을 때만 표시) */}
        {currentMission && (
          <section className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <h3 className="font-semibold mb-2">진행 중인 미션</h3>
            <p className="text-sm">미션 ID: {currentMission.id}</p>
            <p className="text-sm">상태: {currentMission.status}</p>
            <Button
              onClick={() => navigate('/mission/track')}
              className="mt-3 w-full bg-blue-500"
            >
              미션 추적하기
            </Button>
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;
```

---

### Phase 5: 미션 생성 페이지

#### 5.1 MissionCreatePage - `/src/pages/MissionCreatePage.tsx` (새로 생성)

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMission } from '../api/mission.api';
import { useAuthStore } from '../store/authStore';
import { useMissionStore } from '../store/missionStore';
import { Button } from '../components/common/Button';

const MissionCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setCurrentMission, setCreating } = useMissionStore();

  const [startLocationId, setStartLocationId] = useState<number>(1);
  const [endLocationId, setEndLocationId] = useState<number>(3);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('사용자 정보가 없습니다.');
      return;
    }

    try {
      setCreating(true);
      setError('');

      const response = await createMission({
        userId: Number(user.id),
        startLocationId,
        endLocationId,
      });

      // 미션 생성 성공 → 스토어에 저장
      setCurrentMission({
        id: response.missionId.toString(),
        userId: Number(user.id),
        startLocationId,
        endLocationId,
        status: 'REQUESTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 미션 추적 페이지로 이동
      navigate('/mission/track');
    } catch (err) {
      console.error('미션 생성 실패:', err);
      setError('미션 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <button onClick={() => navigate('/home')} className="text-blue-500 mb-4">
          ← 돌아가기
        </button>
        <h1 className="text-2xl font-bold">로봇 호출</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow">
        <div className="space-y-6">
          {/* 출발지 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">출발지</label>
            <select
              value={startLocationId}
              onChange={(e) => setStartLocationId(Number(e.target.value))}
              className="w-full border rounded-lg p-3"
            >
              <option value={1}>Gate A</option>
              <option value={2}>Gate B</option>
              <option value={3}>Gate C</option>
            </select>
          </div>

          {/* 도착지 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">도착지</label>
            <select
              value={endLocationId}
              onChange={(e) => setEndLocationId(Number(e.target.value))}
              className="w-full border rounded-lg p-3"
            >
              <option value={1}>Gate A</option>
              <option value={2}>Gate B</option>
              <option value={3}>Gate C</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-blue-500 h-12 text-lg">
            로봇 호출하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MissionCreatePage;
```

---

### Phase 6: 미션 추적 페이지

#### 6.1 MissionTrackPage - `/src/pages/MissionTrackPage.tsx` (새로 생성)

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMissionStore } from '../store/missionStore';
import { useMissionSSE } from '../hooks/useMissionSSE';
import { verifyMission } from '../api/mission.api';
import { Button } from '../components/common/Button';

const MissionTrackPage = () => {
  const navigate = useNavigate();
  const { currentMission, missionStatus, clearMission } = useMissionStore();
  const { isConnected, connectionError } = useMissionSSE(currentMission?.id || null);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [password, setPassword] = useState('');

  // 로봇 도착 시 인증 모달 자동 표시
  useEffect(() => {
    if (missionStatus?.status === 'ARRIVED') {
      setShowVerifyModal(true);
    }
  }, [missionStatus?.status]);

  // 비밀번호 인증
  const handleVerify = async () => {
    if (!currentMission) return;

    try {
      await verifyMission(currentMission.id, Number(password));
      setShowVerifyModal(false);
      alert('인증 완료! 짐을 넣거나 빼세요.');
    } catch (err) {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  // 미션 완료
  const handleComplete = () => {
    clearMission();
    navigate('/home');
  };

  if (!currentMission) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p>미션 정보가 없습니다.</p>
        <Button onClick={() => navigate('/home')}>홈으로</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 헤더 */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">미션 추적</h1>
        {isConnected ? (
          <span className="text-green-600 text-sm">🟢 실시간 연결됨</span>
        ) : (
          <span className="text-red-600 text-sm">🔴 연결 끊김</span>
        )}
        {connectionError && (
          <p className="text-red-500 text-sm mt-1">{connectionError.message}</p>
        )}
      </header>

      {/* 타임라인 */}
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="space-y-4">
          <TimelineStep
            label="요청됨"
            active={missionStatus?.status === 'REQUESTED'}
            completed={
              missionStatus?.status !== 'REQUESTED' && !!missionStatus?.status
            }
          />
          <TimelineStep
            label="로봇 배정"
            active={missionStatus?.status === 'ASSIGNED'}
            completed={
              ['MOVING', 'ARRIVED', 'UNLOCKED', 'LOCKED', 'RETURNING', 'RETURNED', 'FINISHED'].includes(
                missionStatus?.status || ''
              )
            }
          />
          <TimelineStep
            label="이동 중"
            active={missionStatus?.status === 'MOVING'}
            completed={
              ['ARRIVED', 'UNLOCKED', 'LOCKED', 'RETURNING', 'RETURNED', 'FINISHED'].includes(
                missionStatus?.status || ''
              )
            }
          />
          <TimelineStep
            label="도착"
            active={missionStatus?.status === 'ARRIVED'}
            completed={
              ['UNLOCKED', 'LOCKED', 'RETURNING', 'RETURNED', 'FINISHED'].includes(
                missionStatus?.status || ''
              )
            }
          />
          <TimelineStep
            label="완료"
            active={missionStatus?.status === 'FINISHED'}
            completed={missionStatus?.status === 'FINISHED'}
          />
        </div>

        {missionStatus?.robotCode && (
          <p className="mt-4 text-center text-gray-600">
            배정 로봇: <span className="font-semibold">{missionStatus.robotCode}</span>
          </p>
        )}
      </div>

      {/* 인증 모달 */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">로봇이 도착했습니다!</h3>
            <p className="text-gray-600 mb-4">4자리 비밀번호를 입력하세요</p>
            <input
              type="password"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
              className="w-full border rounded-lg p-3 mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 bg-gray-300"
              >
                취소
              </Button>
              <Button onClick={handleVerify} className="flex-1 bg-blue-500">
                인증
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 버튼 */}
      {missionStatus?.status === 'FINISHED' && (
        <Button onClick={handleComplete} className="w-full bg-green-500 h-12 text-lg">
          완료
        </Button>
      )}
    </div>
  );
};

// 타임라인 스텝 컴포넌트
const TimelineStep = ({
  label,
  active,
  completed,
}: {
  label: string;
  active: boolean;
  completed: boolean;
}) => (
  <div className="flex items-center">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        completed
          ? 'bg-green-500 text-white'
          : active
          ? 'bg-blue-500 text-white'
          : 'bg-gray-300 text-gray-600'
      }`}
    >
      {completed ? '✓' : '○'}
    </div>
    <span className={`ml-3 ${active ? 'font-semibold' : ''}`}>{label}</span>
  </div>
);

export default MissionTrackPage;
```

---

### Phase 7: 라우팅 추가

#### 7.1 Routes 업데이트 - `/src/routes/index.tsx` 수정

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from '../pages/SplashPage';
import LoginPage from '../pages/LoginPage';
import PinVerificationPage from '../pages/PinVerificationPage';
import TicketScanPage from '../pages/TicketScanPage';
import HomePage from '../pages/HomePage';
import TicketDetailPage from '../pages/TicketDetailPage';
import MissionCreatePage from '../pages/MissionCreatePage'; // 추가
import MissionTrackPage from '../pages/MissionTrackPage'; // 추가
import AdminDashboardPage from '../pages/AdminDashboardPage'; // 추가
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SplashPage />} />

    {/* 인증 라우트 */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/login/verify" element={<PinVerificationPage />} />

    {/* 보호된 사용자 라우트 */}
    <Route element={<ProtectedRoute />}>
      <Route path="/ticket/scan" element={<TicketScanPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/ticket/detail" element={<TicketDetailPage />} />

      {/* 미션 관련 라우트 (새로 추가) */}
      <Route path="/mission/create" element={<MissionCreatePage />} />
      <Route path="/mission/track" element={<MissionTrackPage />} />
    </Route>

    {/* 보호된 관리자 라우트 (새로 추가) */}
    <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
```

---

### Phase 8: 관리자 대시보드 (선택 구현)

#### 8.1 AdminDashboardPage - `/src/pages/AdminDashboardPage.tsx` (새로 생성)

```typescript
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';
import { useAdminSSE } from '../hooks/useAdminSSE';
import { unlockMission, lockMission, moveMission } from '../api/mission.api';
import { Button } from '../components/common/Button';

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { activeMissions, recentEvents } = useAdminStore();
  const { isConnected } = useAdminSSE(
    user?.role === 'ADMIN' ? Number(user.id) : null
  );

  const handleUnlock = async (missionId: string) => {
    try {
      await unlockMission(missionId);
      alert('잠금 해제 완료');
    } catch (err) {
      alert('잠금 해제 실패');
    }
  };

  const handleLock = async (missionId: string) => {
    try {
      await lockMission(missionId);
      alert('잠금 완료');
    } catch (err) {
      alert('잠금 실패');
    }
  };

  const handleMove = async (missionId: string) => {
    try {
      await moveMission(missionId);
      alert('로봇 이동 명령 완료');
    } catch (err) {
      alert('이동 명령 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        {isConnected && <span className="text-green-600 text-sm">🟢 실시간 연결</span>}
      </header>

      {/* 활성 미션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">활성 미션</h2>
        <div className="space-y-4">
          {activeMissions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-lg p-4 shadow">
              <p className="font-semibold">미션 {mission.id}</p>
              <p className="text-sm text-gray-600">상태: {mission.status}</p>
              {mission.robotCode && (
                <p className="text-sm text-gray-600">로봇: {mission.robotCode}</p>
              )}
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => handleUnlock(mission.id)}
                  className="bg-green-500"
                >
                  잠금 해제
                </Button>
                <Button onClick={() => handleLock(mission.id)} className="bg-red-500">
                  잠금
                </Button>
                <Button onClick={() => handleMove(mission.id)} className="bg-blue-500">
                  이동
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 최근 이벤트 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">최근 이벤트</h2>
        <div className="bg-white rounded-lg p-4 shadow">
          {recentEvents.map((event, idx) => (
            <div key={idx} className="border-b py-2 last:border-b-0">
              <p className="text-sm">
                <span className="font-semibold">{event.timestamp}</span> - 미션{' '}
                {event.missionId} - {event.robotCode}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
```

---

## 📊 구현 체크리스트

### Phase 1: API Layer
- [ ] `mission.types.ts` 생성 (타입 정의)
- [ ] `mission.api.ts` 생성 (API 함수 + SSE)

### Phase 2: State Management
- [ ] `missionStore.ts` 생성
- [ ] `adminStore.ts` 생성
- [ ] `ticketStore.ts` 유지 (삭제 안 함!)

### Phase 3: Hooks
- [ ] `useMissionSSE.ts` 생성
- [ ] `useAdminSSE.ts` 생성

### Phase 4: Pages
- [ ] `HomePage.tsx` 수정 (로봇 호출 버튼 추가)
- [ ] `MissionCreatePage.tsx` 생성
- [ ] `MissionTrackPage.tsx` 생성
- [ ] `AdminDashboardPage.tsx` 생성 (선택)

### Phase 5: Routing
- [ ] `routes/index.tsx` 업데이트 (미션 라우트 추가)

### Phase 6: 추가 기능 (선택)
- [ ] 가용 로봇 대수 API 연동
- [ ] 최근 호출 구역 API 연동
- [ ] "내짐" 기능 구현

---

## 🚀 실행 순서

1. **Types 먼저 작성** (`mission.types.ts`)
2. **API 레이어** (`mission.api.ts`)
3. **Store** (`missionStore.ts`, `adminStore.ts`)
4. **Hooks** (`useMissionSSE.ts`, `useAdminSSE.ts`)
5. **Pages** (HomePage → MissionCreatePage → MissionTrackPage)
6. **Routing** (`routes/index.tsx`)
7. **테스트** (실제 API 서버 연동)

---

## 📝 주요 API 요청/응답 요약

| API | Method | Endpoint | Request | Response |
|-----|--------|----------|---------|----------|
| 미션 생성 | POST | `/api/missions` | `{ userId, startLocationId, endLocationId }` | `{ missionId }` |
| 미션 구독 | GET | `/api/missions/{id}/subscribe` | - | SSE stream |
| 미션 인증 | PATCH | `/api/missions/{id}/verify` | `{ password: 1234 }` | 204 No Content |
| 관리자 SSE | GET | `/api/admin/sse/subscribe?adminId=1` | - | SSE stream |
| 로봇 잠금해제 | POST | `/api/admin/missions/{id}/unlock` | - | 204 No Content |
| 로봇 잠금 | POST | `/api/admin/missions/{id}/lock` | - | 204 No Content |
| 로봇 이동 | PATCH | `/api/admin/missions/{id}/move` | - | 204 No Content |

---

## ✅ 검증 방법

### 1. SSE 연결 확인
- 브라우저 DevTools → Network 탭 → EventStream 요청 확인
- Console에서 SSE 로그 확인

### 2. 미션 플로우 테스트
1. 티켓 스캔 완료
2. 홈 화면에서 [로봇 호출] 버튼 클릭
3. 출발지/도착지 선택 → 미션 생성
4. 미션 추적 페이지에서 실시간 상태 확인
5. ARRIVED 이벤트 → 인증 모달 표시
6. 비밀번호 입력 (1234)
7. FINISHED 이벤트 → 완료 버튼

---

**최종 업데이트**: 2026년 1월 27일

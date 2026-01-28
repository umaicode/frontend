import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  // 상태
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // 액션
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태 (localStorage에서 refreshToken 복원)
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
  isAuthenticated: false,

  // 로그인 성공 시 호출
  login: (accessToken: string, refreshToken: string, user: User) => {
    // localStorage에 refreshToken 저장
    localStorage.setItem('refreshToken', refreshToken);

    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  // 로그아웃 시 호출
  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
    localStorage.clear();
  },

  // Access Token 갱신 시 호출
  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  // Refresh Token 조회
  getRefreshToken: () => {
    return get().refreshToken;
  },
}));

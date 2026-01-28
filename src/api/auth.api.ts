import apiClient from './axios';
import type {
  SendCodeRequest,
  SendCodeResponse,
  LoginRequest,
  LoginResponse,
  AdminLoginRequest,
  AuthResponse,
} from '../types/auth.types';

// 1단계: 인증번호 발송 (이메일 + 비밀번호)
export const sendCode = async (data: SendCodeRequest): Promise<SendCodeResponse> => {
  const response = await apiClient.post<SendCodeResponse>('/api/auth/request', data);
  return response.data;
};

// 2단계: PIN 인증 (이메일 + 선택한 PIN)
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/auth/verify', data);
  return response.data;
};

// test용 목업 데이터 사용

// // 1단계: 인증번호 발송 (목업)
// export const sendCode = async (data: SendCodeRequest): Promise<SendCodeResponse> => {    
//   // 실제 API 호출 대신 목업 데이터 반환
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         message: "인증번호가 발송되었습니다.",
//         pins: ["35", "17", "93"] // 테스트용 PIN 3개
//       });
//     }, 1000); // 1초 지연으로 로딩 상태 테스트
//   });

//   // 실제 API 호출 (주석 처리)
//   // const response = await apiClient.post<SendCodeResponse>('/api/auth/code', data);    
//   // return response.data;
// };

// // 2단계: 로그인 (목업)
// export const login = async (data: LoginRequest): Promise<LoginResponse> => {
//   // 실제 API 호출 대신 목업 데이터 반환
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // 올바른 PIN인지 확인 (35, 17, 93 중 하나)
//       if (["35", "17", "93"].includes(data.code)) {
//         resolve({
//           accessToken: "mock-access-token-12345",
//           refreshToken: "mock-refresh-token-67890"
//         });
//       } else {
//         reject({
//           response: {
//             data: {
//               message: "인증번호가 일치하지 않습니다."
//             }
//           }
//         });
//       }
//     }, 1000);
//   });

//   // 실제 API 호출 (주석 처리)
//   // const response = await apiClient.post<LoginResponse>('/api/auth/login', data);      
//   // return response.data;
// };

// 로그아웃
export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

// 관리자 로그인
export const adminLogin = async (data: AdminLoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/admin/auth/login', data);
  return response.data;
};

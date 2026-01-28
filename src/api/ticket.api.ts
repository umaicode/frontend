import apiClient from './axios';
import type { TicketScanResponse, TicketInfo } from '../types/ticket.types';

/**
 * 티켓 스캔 API
 * 이미지 파일을 multipart/form-data로 전송하여 OCR 스캔 수행
 *
 * @param imageFile - 티켓 이미지 파일
 * @returns 스캔된 티켓 정보
 */
export const scanTicket = async (imageFile: File): Promise<TicketInfo> => {
  // 🔶 MOCK: 티켓 스캔 목업 데이터
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('🔶 MOCK: scanTicket 호출됨', imageFile.name);
      resolve({
        flight: "KE932",
        gate: "E23",
        seat: "40B",
        boarding_time: "21:20",
        departure_time: "22:00",
        origin: "ROME",
        destination: "INCHEON"
      });
    }, 1500); // 1.5초 지연으로 스캔 중 느낌 연출
  });

  // 실제 API 호출 (주석 처리)
  // const formData = new FormData();
  // formData.append('image', imageFile);
  // const { data } = await apiClient.post<TicketScanResponse>(
  //   '/api/tickets/scan',
  //   formData,
  //   {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   }
  // );
  // return data;
};

/**
 * 최신 티켓 정보 조회 API
 * 사용자가 등록한 가장 최근 티켓 정보를 조회
 *
 * @returns 최신 티켓 정보
 */
export const getLatestTicket = async (): Promise<TicketInfo> => {
  // 🔶 MOCK: 최신 티켓 정보 목업 데이터
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('🔶 MOCK: getLatestTicket 호출됨');
      resolve({
        flight: "KE932",
        gate: "E23",
        seat: "40B",
        boarding_time: "21:20",
        departure_time: "22:00",
        origin: "ROME",
        destination: "INCHEON"
      });
    }, 500);
  });

  // 실제 API 호출 (주석 처리)
  // const { data } = await apiClient.get<TicketInfo>('/api/me/tickets/latest');
  // return data;
};

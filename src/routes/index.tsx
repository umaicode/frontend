import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SplashPage from '../pages/SplashPage';
import LoginPage from '../pages/LoginPage';
import PinVerificationPage from '../pages/PinVerificationPage';
import HomePage from '../pages/HomePage';
import TicketScanPage from '../pages/TicketScanPage';
import TicketDetailPage from '../pages/TicketDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 스플래시 화면 - 첫 진입점 */}
      <Route path="/" element={<SplashPage />} />

      {/* 공개 라우트 (로그인 전) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/verify" element={<PinVerificationPage />} />

      {/* 보호된 라우트 (로그인 필요) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/ticket/scan" element={<TicketScanPage />} />
        <Route path="/ticket/detail" element={<TicketDetailPage />} />
      </Route>

      {/* 알 수 없는 경로는 스플래시로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

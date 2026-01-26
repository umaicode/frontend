import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTicketStore } from '../store/ticketStore';
import Button from '../components/common/Button';
import TicketCard from '../components/ticket/TicketCard';
import { logout as logoutApi } from '../api/auth.api';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { currentTicket } = useTicketStore();

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 나도 로컬 로그아웃은 진행
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">CARRY PORTER</h1>
            <Button variant="outline" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* 환영 메시지 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              환영합니다! 👋
            </h2>
            <p className="text-sm text-gray-600">
              이메일: <span className="font-medium">{user?.email}</span>
            </p>
          </div>

          {/* 티켓 정보 또는 스캔 버튼 */}
          {currentTicket ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                내 티켓
              </h3>
              <TicketCard
                ticket={currentTicket}
                variant="compact"
                onClick={() => navigate('/ticket/detail')}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-gray-400 text-6xl mb-4">🎫</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                티켓을 등록해주세요
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                비행기 티켓을 스캔하여 자동으로 등록할 수 있습니다.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/ticket/scan')}
              >
                티켓 스캔하기
              </Button>
            </div>
          )}

          {/* 다음 단계 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">다음 단계</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>✅ 로그인 완료</li>
              <li>{currentTicket ? '✅' : '⏳'} 티켓 스캔</li>
              <li>⏳ 로봇 호출</li>
              <li>⏳ 실시간 상태 확인</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

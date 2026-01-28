import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SplashPage = () => {
  const navigate = useNavigate();

  // 2초 후 자동으로 로그인 페이지로 이동 (선택사항)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 상단 상태바 */}
      <div className="absolute top-0 left-0 right-0 h-[47px] bg-white/60 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between px-6 h-full">
          <p className="text-white text-[17px] font-semibold">19:02</p>
          <div className="flex items-center gap-1.5">
            {/* WiFi 아이콘 */}
            <svg width="17" height="13" viewBox="0 0 17 13" fill="none" className="text-white">
              <path d="M8.5 12.5C9.05228 12.5 9.5 12.0523 9.5 11.5C9.5 10.9477 9.05228 10.5 8.5 10.5C7.94772 10.5 7.5 10.9477 7.5 11.5C7.5 12.0523 7.94772 12.5 8.5 12.5Z" fill="currentColor"/>
            </svg>
            {/* 신호 아이콘 */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="none" className="text-white">
              <rect x="0.5" y="6" width="3" height="5" rx="0.5" fill="currentColor"/>
              <rect x="5" y="3.5" width="3" height="7.5" rx="0.5" fill="currentColor"/>
              <rect x="9.5" y="1" width="3" height="10" rx="0.5" fill="currentColor"/>
              <rect x="14" y="0" width="3" height="11" rx="0.5" fill="currentColor"/>
            </svg>
            {/* 배터리 아이콘 */}
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" className="text-white">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" fill="none"/>
              <rect x="2" y="2" width="17.5" height="8" rx="1.5" fill="currentColor"/>
              <path d="M23 3.5V8.5C24 8 24 4 23 3.5Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative h-screen bg-gradient-to-b from-[#0064ff] to-[#4da3ff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        {/* 배경 웨이브 효과 */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -left-[288px] -top-[229px] w-[974px] h-[722px]">
            <div className="w-full h-full rounded-full bg-white/20 blur-3xl" />
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full pt-[85px] pb-[24px] px-6">
          {/* 로고 텍스트 */}
          <div className="text-center">
            <h1 className="text-white text-[66px] font-bold leading-tight tracking-tight">
              CARRY
            </h1>
            <h1 className="text-white text-[66px] font-bold leading-tight tracking-tight">
              PORTER
            </h1>
          </div>

          {/* 로봇 이미지 */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[233px] h-[240px]">
              <img
                src="/images/logo.png"
                alt="CARRY PORTER 로봇"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* 시작하기 버튼 */}
          <div className="w-full max-w-[342px]">
            <Button
              size="lg"
              onClick={handleStart}
              className="w-full bg-[#0064ff] hover:bg-[#0052cc] text-white text-lg font-normal rounded-lg py-3 shadow-lg"
            >
              시작하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;

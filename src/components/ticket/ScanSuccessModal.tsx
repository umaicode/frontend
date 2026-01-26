import { useEffect, useState } from 'react';
import Button from '../common/Button';

interface ScanSuccessModalProps {
  isOpen: boolean;
  onConfirm: () => void; // "등록" 버튼 클릭 시 실행
}

const ScanSuccessModal = ({ isOpen, onConfirm }: ScanSuccessModalProps) => {
  const [animate, setAnimate] = useState(false);

  // 모달이 열릴 때 애니메이션 시작
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center">
        {/* 체크마크 아이콘 (애니메이션) */}
        <div
          className={`mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
            animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* 메시지 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          스캔이 완료되었습니다
        </h2>
        <p className="text-gray-600 mb-8">
          티켓 정보가 성공적으로 등록되었습니다.
        </p>

        {/* 등록 버튼 */}
        <Button variant="primary" size="lg" fullWidth onClick={onConfirm}>
          등록
        </Button>
      </div>
    </div>
  );
};

export default ScanSuccessModal;

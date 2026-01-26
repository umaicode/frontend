import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import Button from '../common/Button';

interface WebcamScannerProps {
  onCapture: (imageFile: File) => void; // 캡처된 이미지를 전달하는 콜백
  isScanning?: boolean; // 스캔 진행 중 여부
}

const WebcamScanner = ({ onCapture, isScanning = false }: WebcamScannerProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasError, setHasError] = useState(false);

  // 웹캠 설정 (모바일 후면 카메라 사용)
  const videoConstraints = {
    facingMode: 'environment', // 후면 카메라 선호 (없으면 전면 카메라 사용)
    width: 1920,
    height: 1080,
  };

  // 웹캠 에러 핸들러
  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error('웹캠 접근 에러:', error);
    setHasError(true);
  }, []);

  // 스캔하기 버튼 클릭 핸들러
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

  // 에러 상태 UI
  if (hasError) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            카메라 접근 실패
          </h2>
          <p className="text-gray-600 mb-4">
            카메라 권한을 허용해주세요.
            <br />
            설정에서 카메라 접근을 활성화할 수 있습니다.
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => window.location.reload()}
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* 웹캠 스트림 */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        screenshotQuality={0.92}
        videoConstraints={videoConstraints}
        onUserMediaError={handleUserMediaError}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 프레임 오버레이 (4개 모서리) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 좌상단 */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-white"></div>
        {/* 우상단 */}
        <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-white"></div>
        {/* 좌하단 */}
        <div className="absolute bottom-32 left-8 w-8 h-8 border-b-4 border-l-4 border-white"></div>
        {/* 우하단 */}
        <div className="absolute bottom-32 right-8 w-8 h-8 border-b-4 border-r-4 border-white"></div>
      </div>

      {/* 안내 텍스트 */}
      <div className="absolute top-20 left-0 right-0 text-center">
        <p className="text-white text-lg font-semibold drop-shadow-lg">
          티켓을 프레임 안에 맞춰주세요
        </p>
      </div>

      {/* 스캔하기 버튼 */}
      <div className="absolute bottom-8 left-0 right-0 px-8">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? '스캔 중...' : '스캔하기'}
        </Button>
      </div>
    </div>
  );
};

export default WebcamScanner;

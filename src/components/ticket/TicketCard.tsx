import { formatCityName, formatTime } from '../../utils/imageUtils';
import type { TicketInfo, TicketCardVariant } from '../../types/ticket.types';

interface TicketCardProps {
  ticket: TicketInfo;
  variant?: TicketCardVariant; // 'compact' (메인 화면) 또는 'detailed' (상세 화면)
  onClick?: () => void;
}

const TicketCard = ({ ticket, variant = 'compact', onClick }: TicketCardProps) => {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}`}
      onClick={onClick}
    >
      {/* 출발지 → 도착지 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatCityName(ticket.origin)}
          </div>
          <div className="text-sm text-gray-500 mt-1">출발</div>
        </div>

        {/* 비행기 아이콘과 점선 */}
        <div className="flex-1 px-4 flex items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
            <div className="mx-2">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatCityName(ticket.destination)}
          </div>
          <div className="text-sm text-gray-500 mt-1">도착</div>
        </div>
      </div>

      {/* 티켓 상세 정보 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 항공편명 */}
        <div>
          <div className="text-xs text-gray-500 mb-1">항공편</div>
          <div className="text-lg font-semibold text-gray-900">{ticket.flight}</div>
        </div>

        {/* 탑승구 */}
        <div>
          <div className="text-xs text-gray-500 mb-1">탑승구</div>
          <div className="text-lg font-semibold text-gray-900">{ticket.gate}</div>
        </div>

        {/* 탑승 시간 */}
        <div>
          <div className="text-xs text-gray-500 mb-1">탑승 시간</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatTime(ticket.boarding_time)}
          </div>
        </div>

        {/* 출발 시간 */}
        <div>
          <div className="text-xs text-gray-500 mb-1">출발 시간</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatTime(ticket.departure_time)}
          </div>
        </div>

        {/* 좌석 번호 (detailed만 표시) */}
        {!isCompact && (
          <div className="col-span-2">
            <div className="text-xs text-gray-500 mb-1">좌석 번호</div>
            <div className="text-lg font-semibold text-gray-900">{ticket.seat}</div>
          </div>
        )}
      </div>

      {/* compact일 때 "자세히 보기" 힌트 */}
      {isCompact && onClick && (
        <div className="mt-4 text-center text-sm text-blue-500">
          탭하여 자세히 보기
        </div>
      )}
    </div>
  );
};

export default TicketCard;

import { Button } from "@/app/components/Button";
import svgPaths from "@/imports/svg-h2jb16p5n9";
import imgLogo from "figma:asset/76fe0fccf7c0a8dadc8a855d97def5b55989e461.png";

export default function App() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Main Container - 모바일 최적화 */}
      <div className="relative w-full max-w-[390px] h-full bg-white overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        
        {/* Content Area */}
        <div className="relative w-full h-full bg-white overflow-hidden">
          {/* Background Gradient Eclipse */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[250%] h-[100%] -translate-y-[38%]">
            <svg 
              className="block w-full h-full" 
              fill="none" 
              preserveAspectRatio="none" 
              viewBox="0 0 974 722"
            >
              <path 
                d={svgPaths.p3faf7c00} 
                fill="#0064FF" 
              />
            </svg>
          </div>

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full px-6 pt-16 pb-8">
            {/* Title */}
            <div className="flex-shrink-0 mt-8">
              <h1 className="font-['Beckman:Free',sans-serif] text-[66px] leading-tight text-center text-white not-italic">
                <div className="mb-0">CARRY</div>
                <div>PORTER</div>
              </h1>
            </div>

            {/* Logo - 중앙 정렬 */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-[233px] h-[240px]">
                <img 
                  alt="Carry Porter Logo" 
                  className="w-full h-full object-contain" 
                  src={imgLogo} 
                />
              </div>
            </div>

            {/* Button - 하단 고정 */}
            <div className="w-full flex-shrink-0">
              <Button>시작하기</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
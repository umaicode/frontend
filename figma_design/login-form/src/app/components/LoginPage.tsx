import { LoginForm } from "@/app/components/LoginForm";
import svgPaths from "@/imports/svg-4jotgkwtev";
import imgLogo from "figma:asset/76fe0fccf7c0a8dadc8a855d97def5b55989e461.png";

export function LoginPage() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Main Container - 모바일 최적화 */}
      <div className="relative w-full max-w-[390px] h-full bg-white overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        
        {/* Content Area */}
        <div className="relative w-full h-full bg-white overflow-y-auto">
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
          <div className="relative z-10 flex flex-col items-center min-h-full px-6 pt-16 pb-8">
            {/* Logo Header */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-[34px] h-[35px]">
                <img 
                  alt="Carry Porter Logo" 
                  className="w-full h-full object-contain" 
                  src={imgLogo} 
                />
              </div>
              <h1 className="font-['Beckman:Free',sans-serif] text-[20px] text-white">
                CarryPorter
              </h1>
            </div>

            {/* Login Form */}
            <div className="w-full flex-1 flex items-start justify-center pt-4">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

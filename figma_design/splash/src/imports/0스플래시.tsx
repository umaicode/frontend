import svgPaths from "./svg-h2jb16p5n9";
import imgLogo from "figma:asset/76fe0fccf7c0a8dadc8a855d97def5b55989e461.png";

function Component() {
  return (
    <div className="absolute bg-[#0064ff] gap-[10px] grid grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] left-[24px] px-[138px] py-[12px] rounded-[8px] top-[695px] w-[342px]" data-name="메인 화면 버튼">
      <p className="col-[1] css-gkq7f3 font-['Noto_Sans_KR:Regular',sans-serif] font-normal leading-[28px] relative row-[1] self-start shrink-0 text-[18px] text-center text-white">시작하기</p>
    </div>
  );
}

function Content() {
  return (
    <div className="absolute bg-white h-[763px] left-[-1px] overflow-clip shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[47px] w-[390px]" data-name="Content">
      <div className="absolute h-[722px] left-[-288px] top-[-276px] w-[974px]" data-name="background eclipse">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 974 722">
          <path d={svgPaths.p3faf7c00} fill="var(--fill-0, #0064FF)" id="background eclipse" />
        </svg>
      </div>
      <Component />
      <div className="absolute h-[240px] left-[81px] top-[309px] w-[233px]" data-name="LOGO">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
      <div className="-translate-x-1/2 absolute font-['Beckman:Free',sans-serif] leading-[normal] left-[calc(50%-0.5px)] not-italic text-[66px] text-center text-white top-[85px] whitespace-nowrap">
        <p className="mb-0">carry</p>
        <p>PortEr</p>
      </div>
    </div>
  );
}

function Battery() {
  return (
    <div className="absolute h-[11.775px] right-[24.87px] top-[16.01px] w-[25.06px]" data-name="_battery">
      <div className="absolute inset-[0_-6.15%_-6.15%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6025 12.5">
          <g id="_battery">
            <path d={svgPaths.p2d8e9800} fill="var(--fill-0, white)" id="fill" />
            <path d={svgPaths.p20347140} fill="var(--fill-0, white)" id="outline" opacity="0.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IPhoneStatusBar() {
  return (
    <div className="absolute h-[41.449px] left-0 overflow-clip top-[-1px] w-[390px]" data-name="iPhone Status bar">
      <div className="absolute h-[12.246px] right-[54.64px] top-[16.01px] w-[16.957px]" data-name="wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.9565 12.2464">
          <path d={svgPaths.p2264f240} fill="var(--fill-0, white)" id="wifi" />
        </svg>
      </div>
      <Battery />
      <div className="absolute h-[10.362px] right-[77.11px] top-[16.96px] w-[17.098px]" data-name="reception">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.0977 10.3623">
          <path d={svgPaths.p7810180} fill="var(--fill-0, white)" id="reception" />
        </svg>
      </div>
      <p className="-translate-x-1/2 absolute font-['SF_Pro_Display:Semibold',sans-serif] leading-none left-[56.93px] not-italic text-[16.957px] text-center text-white top-[14.13px] tracking-[-0.3391px]">19:02</p>
    </div>
  );
}

function Hero() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.59)] h-[47px] left-[-1px] overflow-clip top-[-1px] w-[390px]" data-name="Hero">
      <IPhoneStatusBar />
    </div>
  );
}

export default function Component1() {
  return (
    <div className="bg-black border border-black border-solid relative size-full" data-name="0. 스플래시">
      <Content />
      <Hero />
    </div>
  );
}
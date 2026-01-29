import svgPaths from "./svg-4jotgkwtev";
import imgLogo from "figma:asset/76fe0fccf7c0a8dadc8a855d97def5b55989e461.png";

function Component() {
  return (
    <div className="absolute bg-[#0064ff] h-[52px] left-[24px] rounded-[8px] top-[695px] w-[342px]" data-name="로그인 버튼">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[28px] left-[170.89px] text-[18px] text-center text-white top-[12.2px]">로그인</p>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[32px] relative shrink-0 w-[292px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] left-[calc(50%-0.2px)] text-[#0a0a0a] text-[18px] text-center top-[calc(50%-14.2px)]">로그인</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[19.387px] items-start left-[46.91px] top-0 w-[5.964px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#fb2c36] text-[14px]">*</p>
    </div>
  );
}

function Label() {
  return (
    <div className="absolute h-[19.387px] left-0 top-[2.42px] w-[52.878px]" data-name="Label">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0a0a0a] text-[14px] top-[-2px]">MM 이메일</p>
      <Text />
    </div>
  );
}

function EmailInput() {
  return (
    <div className="absolute bg-white h-[50.379px] left-0 rounded-[10px] top-[23.99px] w-[292.01px]" data-name="Email Input">
      <div className="content-stretch flex items-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">example@email.com</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.212px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[74.366px] left-0 top-[-0.16px] w-[292.01px]" data-name="Container">
      <Label />
      <EmailInput />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[19.387px] items-start left-[60.9px] top-0 w-[5.964px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#fb2c36] text-[14px]">*</p>
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute h-[19.387px] left-0 top-[2.42px] w-[66.869px]" data-name="Label">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0a0a0a] text-[14px] top-[-2px]">비밀번호</p>
      <Text1 />
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="absolute bg-white h-[50.379px] left-0 rounded-[10px] top-[23.99px] w-[292.01px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">숫자 4자리 입력</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.212px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[74.366px] left-0 top-0 w-[292.01px]" data-name="Container">
      <Label1 />
      <PasswordInput />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[19.387px] items-start left-[93.81px] top-0 w-[5.964px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#fb2c36] text-[14px]">*</p>
    </div>
  );
}

function Label2() {
  return (
    <div className="absolute h-[19.387px] left-0 top-[2.42px] w-[99.773px]" data-name="Label">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#0a0a0a] text-[14px] top-[-2px]">비밀번호 확인</p>
      <Text2 />
    </div>
  );
}

function PasswordInput1() {
  return (
    <div className="absolute bg-white h-[50.379px] left-0 rounded-[10px] top-[23.99px] w-[292.01px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">비밀번호 재입력</p>
      </div>
      <div aria-hidden="true" className="absolute border-[1.212px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[74.366px] left-0 top-[90.36px] w-[292.01px]" data-name="Container">
      <Label2 />
      <PasswordInput1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[164.729px] left-[-0.4px] top-[80.84px] w-[292.01px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute content-stretch flex h-[19.387px] items-start left-0 top-0 w-[102.896px]" data-name="Text">
      <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px] w-[207px] whitespace-pre-wrap">회수되지 않은 짐은 7일간 보관 되는 것에 동의합니다.</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute content-stretch flex h-[19.387px] items-start left-[124.88px] top-[19.97px] w-[5.964px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#fb2c36] text-[14px]">*</p>
    </div>
  );
}

function Label3() {
  return (
    <div className="absolute h-[39.947px] left-[47.97px] top-[16px] w-[228.038px]" data-name="Label">
      <Text3 />
      <Text4 />
    </div>
  );
}

function Checkbox() {
  return <div className="absolute bg-white left-[14.01px] size-[19.992px] top-[17.31px]" data-name="Checkbox" />;
}

function Container5() {
  return (
    <div className="bg-[#ececf0] h-[71.942px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <Label3 />
      <Checkbox />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80px] items-start left-[-0.4px] pt-[7.989px] top-[281.84px] w-[292px]" data-name="Container">
      <Container5 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[19.387px] items-start left-0 top-0 w-[102.896px]" data-name="Text">
      <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px] w-[207px] whitespace-pre-wrap">서비스 이용약관 및 개인정보 처리 방침에 동의합니다</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute content-stretch flex h-[19.387px] items-start left-[124.88px] top-[19.97px] w-[5.964px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#fb2c36] text-[14px]">*</p>
    </div>
  );
}

function Label4() {
  return (
    <div className="absolute h-[39.947px] left-[47.97px] top-[16px] w-[228.038px]" data-name="Label">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Checkbox1() {
  return <div className="absolute bg-white left-[14.01px] size-[19.992px] top-[17.31px]" data-name="Checkbox" />;
}

function Container7() {
  return (
    <div className="bg-[#ececf0] h-[71.942px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <Label4 />
      <Checkbox1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80px] items-start left-[-0.4px] pt-[7.989px] top-[375.84px] w-[292px]" data-name="Container">
      <Container7 />
    </div>
  );
}

function SignupPage() {
  return (
    <div className="h-[492px] relative shrink-0 w-[292px]" data-name="SignupPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container />
        <Container1 />
        <Container4 />
        <Container6 />
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[29.97px] h-[579px] items-start left-[24px] pb-[1.212px] pl-[25.199px] pr-[1.212px] pt-[25.199px] rounded-[14px] top-[70px] w-[342px]" data-name="로그인 폼">
      <div aria-hidden="true" className="absolute border-[1.212px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardTitle />
      <SignupPage />
    </div>
  );
}

function LogoText() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%+0.5px)] top-[11px]" data-name="LOGO_TEXT">
      <p className="-translate-x-1/2 absolute font-['Beckman:Free',sans-serif] leading-[normal] left-[calc(50%+21.5px)] not-italic text-[20px] text-center text-white top-[17px]">CarryPorter</p>
      <div className="absolute h-[35px] left-[106px] top-[11px] w-[34px]" data-name="LOGO">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="absolute bg-white h-[763px] left-0 overflow-clip shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-[48px] w-[390px]" data-name="Content">
      <div className="absolute h-[722px] left-[-288px] top-[-279px] w-[974px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 974 722">
          <path d={svgPaths.p3faf7c00} fill="var(--fill-0, #0064FF)" id="background eclipse" />
        </svg>
      </div>
      <Component />
      <Component1 />
      <LogoText />
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
    <div className="absolute bg-[rgba(255,255,255,0.59)] h-[47px] left-0 overflow-clip top-0 w-[390px]" data-name="Hero">
      <IPhoneStatusBar />
    </div>
  );
}

export default function Component2() {
  return (
    <div className="bg-black relative size-full" data-name="1. 로그인 - 1">
      <Content />
      <Hero />
    </div>
  );
}
import { FormInput } from "@/app/components/FormInput";
import { CheckboxField } from "@/app/components/CheckboxField";
import { Button } from "@/app/components/Button";

export function LoginForm() {
  return (
    <div className="w-full max-w-[342px] bg-white rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6 shadow-sm">
      {/* Title */}
      <h2 className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-lg text-[#0a0a0a] text-center mb-7">
        로그인
      </h2>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Email Input */}
        <FormInput
          label="MM 이메일"
          placeholder="example@email.com"
          type="email"
          required
        />

        {/* Password Input */}
        <FormInput
          label="비밀번호"
          placeholder="숫자 4자리 입력"
          type="password"
          maxLength={4}
          required
        />

        {/* Password Confirmation */}
        <FormInput
          label="비밀번호 확인"
          placeholder="비밀번호 재입력"
          type="password"
          maxLength={4}
          required
        />
      </div>

      {/* Checkboxes */}
      <div className="mt-6 space-y-3">
        <CheckboxField
          label="회수되지 않은 짐은 7일간 보관 되는 것에 동의합니다."
          required
        />
        <CheckboxField
          label="서비스 이용약관 및 개인정보 처리 방침에 동의합니다"
          required
        />
      </div>

      {/* Submit Button */}
      <div className="mt-7">
        <Button>로그인</Button>
      </div>
    </div>
  );
}

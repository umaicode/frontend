interface FormInputProps {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password" | "number";
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

export function FormInput({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
  maxLength,
}: FormInputProps) {
  return (
    <div className="w-full">
      {/* Label */}
      <label className="flex items-center gap-1 mb-2">
        <span className="font-['Noto_Sans_KR:Regular',sans-serif] text-sm text-[#0a0a0a]">
          {label}
        </span>
        {required && (
          <span className="font-['Arimo:Regular',sans-serif] text-sm text-[#fb2c36]">
            *
          </span>
        )}
      </label>

      {/* Input Field */}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          maxLength={maxLength}
          className="w-full px-4 py-3 bg-white rounded-[10px] border border-[rgba(0,0,0,0.1)] 
                     text-[16px] text-[#0a0a0a] placeholder:text-[rgba(10,10,10,0.5)]
                     font-['Noto_Sans_KR:Regular',sans-serif]
                     focus:outline-none focus:border-[#0064ff] transition-colors"
        />
      </div>
    </div>
  );
}

import { useState } from "react";

interface CheckboxFieldProps {
  label: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function CheckboxField({
  label,
  required = false,
  checked: controlledChecked,
  onChange,
}: CheckboxFieldProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className="w-full bg-[#ececf0] rounded-[10px] px-4 py-4">
      <label className="flex items-start gap-3 cursor-pointer">
        {/* Custom Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            className="w-5 h-5 bg-white border-2 border-gray-300 rounded cursor-pointer
                       checked:bg-[#0064ff] checked:border-[#0064ff]
                       focus:outline-none focus:ring-2 focus:ring-[#0064ff] focus:ring-offset-2
                       transition-all"
          />
        </div>

        {/* Label Text */}
        <div className="flex-1">
          <span className="font-['Noto_Sans_KR:Regular',sans-serif] text-sm text-[#0a0a0a] leading-5">
            {label}
          </span>
          {required && (
            <span className="ml-1 font-['Arimo:Regular',sans-serif] text-sm text-[#fb2c36]">
              *
            </span>
          )}
        </div>
      </label>
    </div>
  );
}

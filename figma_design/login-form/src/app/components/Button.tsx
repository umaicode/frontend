interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export function Button({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary" 
}: ButtonProps) {
  const baseStyles = "w-full rounded-lg py-3 px-4 text-center font-['Noto_Sans_KR:Regular',sans-serif] font-normal text-lg leading-7 transition-all duration-200";
  
  const variantStyles = {
    primary: "bg-[#0064ff] text-white hover:bg-[#0052cc] active:bg-[#0047b3]",
    secondary: "bg-white text-[#0064ff] border-2 border-[#0064ff] hover:bg-gray-50"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

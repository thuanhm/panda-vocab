import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-panda-primary text-white hover:bg-pink-400 shadow-[0_4px_0_rgb(219,112,147)] hover:shadow-[0_2px_0_rgb(219,112,147)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
    secondary: "bg-panda-secondary text-green-900 hover:bg-green-300 shadow-[0_4px_0_rgb(118,200,147)] hover:shadow-[0_2px_0_rgb(118,200,147)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
    outline: "bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 shadow-[0_4px_0_rgb(229,231,235)] hover:shadow-[0_2px_0_rgb(229,231,235)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_rgb(185,28,28)] hover:shadow-[0_2px_0_rgb(185,28,28)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;

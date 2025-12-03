import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  const baseClasses = "px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variantClasses = {
    primary: "bg-panda-primary text-white hover:bg-pink-400 border-b-4 border-pink-500 hover:border-pink-600",
    secondary: "bg-panda-secondary text-panda-dark hover:bg-green-300 border-b-4 border-green-400 hover:border-green-500",
    success: "bg-green-500 text-white hover:bg-green-600 border-b-4 border-green-600 hover:border-green-700",
    danger: "bg-red-500 text-white hover:bg-red-600 border-b-4 border-red-600 hover:border-red-700",
    outline: "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

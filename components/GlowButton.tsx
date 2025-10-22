import React from 'react';
import { ArrowRightIcon } from './icons';

interface ButtonProps {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false }) => {
  const baseClasses = 'px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-base';
  
  const variantClasses = {
    primary: 'bg-[#14F195] text-black hover:bg-white disabled:bg-gray-500 disabled:cursor-not-allowed',
    secondary: 'bg-transparent text-white border border-gray-700 hover:bg-gray-800 disabled:opacity-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
      {variant === 'primary' && <ArrowRightIcon className="w-5 h-5" />}
    </button>
  );
};

export default Button;
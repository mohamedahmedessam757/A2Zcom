import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;

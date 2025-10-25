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
      className={`bg-[var(--card-bg)] backdrop-blur-lg border border-[var(--card-border)] rounded-2xl shadow-lg p-4 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
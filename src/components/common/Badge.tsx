import React from 'react';

type BadgeVariant =
  | 'cobalt'
  | 'lime'
  | 'coral'
  | 'lilac'
  | 'mint'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    cobalt: {
      bg: 'bg-[#EEF2FF]',
      text: 'text-[#2447C5]',
      border: 'border-[#C7D2FE]',
      dotColor: 'bg-[#315CEB]',
    },
    lime: {
      bg: 'bg-[#F7FEE7]',
      text: 'text-[#3F6212]',
      border: 'border-[#D9F99D]',
      dotColor: 'bg-[#65A30D]',
    },
    coral: {
      bg: 'bg-[#FFF1EE]',
      text: 'text-[#C2410C]',
      border: 'border-[#FFDDD2]',
      dotColor: 'bg-[#F27C66]',
    },
    lilac: {
      bg: 'bg-[#F5F3FF]',
      text: 'text-[#6D28D9]',
      border: 'border-[#DDD6FE]',
      dotColor: 'bg-[#8B5CF6]',
    },
    mint: {
      bg: 'bg-[#ECFDF5]',
      text: 'text-[#065F46]',
      border: 'border-[#A7F3D0]',
      dotColor: 'bg-[#10B981]',
    },
    neutral: {
      bg: 'bg-[#F3F4F6]',
      text: 'text-[#374151]',
      border: 'border-[#E5E7EB]',
      dotColor: 'bg-[#6B7280]',
    },
    success: {
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#166534]',
      border: 'border-[#BBF7D0]',
      dotColor: 'bg-[#20845A]',
    },
    warning: {
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#92400E]',
      border: 'border-[#FDE68A]',
      dotColor: 'bg-[#A96116]',
    },
    error: {
      bg: 'bg-[#FEF2F2]',
      text: 'text-[#991B1B]',
      border: 'border-[#FECACA]',
      dotColor: 'bg-[#B93838]',
    },
  };

  const style = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} aria-hidden="true" />}
      {children}
    </span>
  );
};

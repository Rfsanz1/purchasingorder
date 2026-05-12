import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-3xl border border-slate-800/70 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/20 ${className}`}>
      {children}
    </div>
  );
}

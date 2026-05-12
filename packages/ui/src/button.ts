import type { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="rounded-2xl bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-500">
      {children}
    </button>
  );
}

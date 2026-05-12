import type { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/20">{children}</div>;
}

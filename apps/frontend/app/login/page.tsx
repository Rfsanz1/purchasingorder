'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { Button } from '../../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, loadProfile, token, error, loading } = useAuthStore();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');

  if (token) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-md rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">ERP Modern</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Masuk ke sistem</h1>
          <p className="mt-2 text-sm text-slate-400">Gunakan kredensial Anda untuk mengakses dashboard ERP enterprise.</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-slate-300">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
              type="email"
              placeholder="admin@example.com"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
              type="password"
              placeholder="••••••••"
            />
          </label>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <Button
            className="w-full"
            onClick={async () => {
              const success = await login(email, password);
              if (success) {
                await loadProfile();
                router.push('/');
              }
            }}
          >
            {loading ? 'Logging in...' : 'Masuk'}
          </Button>
        </div>
      </div>
    </div>
  );
}

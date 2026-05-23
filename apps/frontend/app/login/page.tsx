'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, loadProfile, token, error, loading } = useAuthStore();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');

  if (token) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-xl mb-3"
            style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
          >
            G
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Gentong Mas ERP</h1>
          <p className="text-sm mt-1" style={{ color: '#A5A3AE' }}>Masuk ke akun Anda</p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-lg p-8"
          style={{ boxShadow: '0 4px 16px rgba(47,43,61,.12)', border: '1px solid #E9E0F8' }}
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#433C50' }}>
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md px-3.5 py-2.5 text-sm transition-all"
                style={{
                  border: '1px solid #E9E0F8',
                  color: '#433C50',
                  outline: 'none',
                }}
                type="email"
                placeholder="admin@example.com"
                onFocus={(e) => { e.target.style.borderColor = '#714B67'; e.target.style.boxShadow = '0 0 0 3px rgba(113,75,103,.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E9E0F8'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#433C50' }}>
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md px-3.5 py-2.5 text-sm transition-all"
                style={{
                  border: '1px solid #E9E0F8',
                  color: '#433C50',
                  outline: 'none',
                }}
                type="password"
                placeholder="••••••••"
                onFocus={(e) => { e.target.style.borderColor = '#714B67'; e.target.style.boxShadow = '0 0 0 3px rgba(113,75,103,.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E9E0F8'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div className="rounded-md px-3.5 py-2.5 text-sm" style={{ backgroundColor: 'rgba(234,84,85,.08)', color: '#EA5455', border: '1px solid rgba(234,84,85,.2)' }}>
                {error}
              </div>
            )}

            <button
              className="w-full py-2.5 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#714B67' }}
              disabled={loading}
              onClick={async () => {
                const success = await login(email, password);
                if (success) {
                  await loadProfile();
                  router.push('/');
                }
              }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#A5A3AE' }}>
          Gentong Mas ERP — Enterprise Resource Planning
        </p>
      </div>
    </div>
  );
}

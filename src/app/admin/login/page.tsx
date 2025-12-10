'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CSRF_HEADER } from '@/lib/constants';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const res = await fetch('/api/csrf');
        const data = await res.json();
        if (data.success && data.token) {
          setCsrfToken(data.token);
        }
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
      }
    };

    fetchCSRFToken();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!csrfToken) {
      setError('Security token not loaded. Please refresh the page.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [CSRF_HEADER]: csrfToken,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password');
        // Refresh CSRF token after failed attempt
        const csrfRes = await fetch('/api/csrf');
        const csrfData = await csrfRes.json();
        if (csrfData.success && csrfData.token) {
          setCsrfToken(csrfData.token);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <Image
            src="/assets/images/logo-silver-metallic.webp"
            alt="Keystone Notary Group"
            width={150}
            height={150}
            className="w-auto h-24"
          />
        </div>
        <h2 className="text-center text-3xl font-serif text-white">Admin Access</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              disabled={isLoading}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-white focus:border-silver-mid focus:outline-none disabled:opacity-50"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !csrfToken}
            className="w-full bg-silver-mid text-black font-medium py-3 rounded hover:bg-white transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

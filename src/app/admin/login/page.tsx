'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple API call to set cookie
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid password');
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
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-white focus:border-silver-mid focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-silver-mid text-black font-medium py-3 rounded hover:bg-white transition-colors uppercase tracking-widest text-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

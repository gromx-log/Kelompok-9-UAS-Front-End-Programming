'use client'; 

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; 
import api from '../../../lib/api'; 

export default function CmsLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Panggil backend /api/auth/login
      const { data } = await api.post('https://kartini-ale-public.up.railway.app/api/auth/login', {
        username: email, 
        password: password 
      });

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.admin?.role || data.data?.admin?.role);
      router.push('/cms/dashboard');
    }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal!');
    }
  };

  return (
    <>
      <Head>
        <title>Login Admin - KartiniAle</title>
      </Head>
      <div 
        className="d-flex align-items-center justify-content-center" 
        style={{ height: '100vh', backgroundColor: 'var(--color-bg)' }}
      >
        <div 
          className="card shadow-lg border-0" 
          style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-bg-light)' }}
        >
          <div className="card-body p-4 p-md-5">
            <h2 className="text-center fw-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Admin Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">Username (atau Email)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg cms-btn-accent">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
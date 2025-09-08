
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Minimal, self-contained component — drop in a React app (Vite / Create React App)
// Requires: tailwindcss, framer-motion

const initialForm = { username: '', email: '', password: '' };

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    // If user token exists, try to parse name for friendly UI
    const data = localStorage.getItem('centura_user');
    if (data && !onAuthSuccess) {
      // nothing — but you could auto-redirect
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (mode === 'register') {
      if (!form.username || form.username.length < 2) return 'Please enter a valid username (min 2 chars).';
      if (!/^[\w.@+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(form.email)) return 'Please enter a valid email.';
      if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters.';
    } else {
      if (!/^[\w.@+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(form.email)) return 'Please enter a valid email.';
      if (!form.password) return 'Please enter your password.';
    }
    return null;
  };

  const submit = async () => {
    setError(null); setMessage(null);
    const v = validate(); if (v) { setError(v); return; }
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_NODE_API_URL || "http://localhost:4000";


const endpoint =
  mode === 'register'
    ? `${API_BASE}/api/auth/register`
    : `${API_BASE}/api/auth/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unknown error');

      // On success: store token and user
      const { token, user } = data;
      if (remember) {
        localStorage.setItem('centura_token', token);
        localStorage.setItem('centura_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('centura_token', token);
        sessionStorage.setItem('centura_user', JSON.stringify(user));
      }

      setMessage(mode === 'register' ? 'Registration successful — logged in.' : 'Welcome back!');
      setForm(initialForm);
      if (onAuthSuccess) onAuthSuccess(user, token);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const demoFill = (m: 'login' | 'register') => {
    if (m === 'login') setForm({ email: 'test@centura.app', password: 'password123', username: '' });
    else setForm({ username: 'Priya Sharma', email: 'priya@example.com', password: 'password123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#071033] to-[#02122b] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/5 backdrop-blur-md border border-white/6 rounded-2xl p-6 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Visual / Marketing */}
          <div className="relative p-6 hidden md:flex flex-col justify-center">
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-6"
            >
              <img src="/lovable-uploads/f1965c8a-ba23-43da-80d2-e1828995c058.png" alt="Centura" className="w-24 h-24" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white">Project Centura</h2>
            <p className="mt-2 text-sm text-white/80">Secure brand compliance — sign in or create your team account to continue.</p>

            <div className="mt-6 space-y-4">
              <div className="bg-white/6 p-4 rounded-lg border border-white/8">
                <p className="text-sm text-white/90 font-medium">Why Centura?</p>
                <ul className="mt-2 text-xs text-white/70 list-disc list-inside space-y-1">
                  <li>AI-assisted compliance checking</li>
                  <li>Centralized brand asset management</li>
                  <li>Enterprise-grade logging and audit trails</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button onClick={() => demoFill('register')} className="px-3 py-2 rounded bg-white/6 text-white/90 text-sm">Try register demo</button>
                <button onClick={() => demoFill('login')} className="px-3 py-2 rounded bg-white/6 text-white/90 text-sm">Try login demo</button>
              </div>
            </div>

          </div>

          {/* Right: Form */}
          <div className="p-6 bg-white/6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl text-white font-semibold">{mode === 'login' ? 'Sign in' : 'Create your account'}</h3>
                <p className="text-sm text-white/80">{mode === 'login' ? 'Access your Centura workspace' : 'Register to manage brand compliance'}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setMessage(null); }}
                  className="text-xs text-white/80 bg-white/6 px-3 py-1 rounded"
                >
                  {mode === 'login' ? 'Create account' : 'Have an account?'}
                </button>
              </div>
            </div>

            {error && <div className="mb-3 text-sm text-red-300 bg-red-900/20 p-2 rounded">{error}</div>}
            {message && <div className="mb-3 text-sm text-green-300 bg-green-900/20 p-2 rounded">{message}</div>}

            <div className="space-y-4">
              {mode === 'register' && (
                <div className="flex flex-col">
                  <label className="text-xs text-white/80 mb-1">Full name</label>
                  <input name="username" value={form.username} onChange={handleChange} placeholder="Your full name" className="p-3 rounded bg-white/5 border border-white/8 text-white/90" />
                </div>
              )}

              <div className="flex flex-col">
                <label className="text-xs text-white/80 mb-1">Email address</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" className="p-3 rounded bg-white/5 border border-white/8 text-white/90" />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-white/80 mb-1">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="p-3 rounded bg-white/5 border border-white/8 text-white/90" />
                <p className="mt-1 text-xs text-white/60">Use at least 6 characters.</p>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-white/80 text-sm">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-xs text-white/70">Forgot password?</a>
              </div>

              <div>
                <button onClick={submit} disabled={loading} className="w-full py-3 rounded bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold">
                  {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign in' : 'Create account')}
                </button>
              </div>

              <div className="text-center text-xs text-white/70">or continue with</div>

              <div className="grid grid-cols-3 gap-3">
                <button className="py-2 rounded bg-white/6">Google</button>
                <button className="py-2 rounded bg-white/6">Microsoft</button>
                <button className="py-2 rounded bg-white/6">SSO</button>
              </div>

            </div>

            <div className="mt-6 text-center text-xs text-white/60">
              By continuing you agree to our <a className="underline">Terms</a> and <a className="underline">Privacy Policy</a>.
            </div>

          </div>
        </div>

        {/* Minimal protected preview */}
      </motion.div>
    </div>
  );
}

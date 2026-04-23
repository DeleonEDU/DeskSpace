import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store';

import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setTokens, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock login for demo
      await new Promise((res) => setTimeout(res, 800));
      setTokens('mock-access-token', 'mock-refresh-token');
      setUser({ id: 1, email, first_name: 'Анна', last_name: 'Петренко', phone_number: '+380501234567' });
      toast.success('Ласкаво просимо!');
      navigate('/');
    } catch {
      toast.error('Невірний email або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-orb auth-bg-orb--3" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className="auth-logo">
          <svg viewBox="0 0 36 36" fill="none" width="48" height="48">
            <rect width="36" height="36" rx="10" fill="url(#auth-logo-grad)" />
            <path d="M10 26V16l8-6 8 6v10H22v-6h-4v6H10z" fill="white" />
            <defs>
              <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="36" y2="36">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span>DeskSpace</span>
        </div>

        <h1 className="auth-title">Вхід до системи</h1>
        <p className="auth-subtitle">Увійдіть щоб забронювати робоче місце</p>

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="anna@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="login-password">Пароль</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="login-submit"
          >
            {loading ? <span className="btn-spinner" /> : 'Увійти'}
          </motion.button>
        </form>

        <p className="auth-footer">
          Немає акаунту?{' '}
          <Link to="/register" className="auth-link">Зареєструватись</Link>
        </p>

        {/* Demo shortcut */}
        <button
          className="demo-btn"
          onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
          id="demo-login-btn"
        >
          ✨ Демо-вхід (без пароля)
        </button>
      </motion.div>
    </div>
  );
};

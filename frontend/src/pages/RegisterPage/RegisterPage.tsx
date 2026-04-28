import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Паролі не співпадають');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        password,
        password_confirmation: password2,
      });

      const tokens = await authApi.login({ email, password });
      setTokens(tokens.access, tokens.refresh);
      const user = await authApi.me();
      setUser(user);

      toast.success('Акаунт створено');
      navigate('/', { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        'Не вдалося зареєструватись. Перевір дані та спробуй ще раз.';
      toast.error(msg);
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

        <h1 className="auth-title">Реєстрація</h1>
        <p className="auth-subtitle">Створіть акаунт для бронювання</p>

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="input-group">
            <label className="input-label" htmlFor="reg-first-name">Імʼя</label>
            <div className="input-wrapper">
              <UserIcon size={16} className="input-icon" />
              <input
                id="reg-first-name"
                type="text"
                className="input-field"
                placeholder="Анна"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-last-name">Прізвище</label>
            <div className="input-wrapper">
              <UserIcon size={16} className="input-icon" />
              <input
                id="reg-last-name"
                type="text"
                className="input-field"
                placeholder="Петренко"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-phone">Телефон</label>
            <div className="input-wrapper">
              <Phone size={16} className="input-icon" />
              <input
                id="reg-phone"
                type="tel"
                className="input-field"
                placeholder="+380501234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reg-email">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="reg-email"
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
            <label className="input-label" htmlFor="reg-password">Пароль</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
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

          <div className="input-group">
            <label className="input-label" htmlFor="reg-password2">Повторіть пароль</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="reg-password2"
                type={showPass ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="register-submit"
          >
            {loading ? <span className="btn-spinner" /> : 'Створити акаунт'}
          </motion.button>
        </form>

        <p className="auth-footer">
          Вже маєш акаунт?{' '}
          <Link to="/login" className="auth-link">Увійти</Link>
        </p>
      </motion.div>
    </div>
  );
};


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, LogOut, BookOpen, Map } from 'lucide-react';
import { useAuthStore } from '../../store';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Бронювання', icon: Map },
    { to: '/my-bookings', label: 'Мої бронювання', icon: BookOpen },
  ];

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="logo-icon">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />
              <path d="M10 26V16l8-6 8 6v10H22v-6h-4v6H10z" fill="white" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">DeskSpace</span>
        </Link>

        {/* Nav links */}
        <nav className="navbar__nav">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link key={to} to={to} className={`nav-link ${isActive ? 'nav-link--active' : ''}`}>
                <Icon size={16} />
                {label}
                {isActive && (
                  <motion.div layoutId="nav-indicator" className="nav-indicator" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: user */}
        <div className="navbar__right">
          {isAuthenticated ? (
            <>
              <button className="icon-btn" title="Сповіщення" id="nav-notifications">
                <Bell size={18} />
                <span className="notification-dot" />
              </button>
              <div className="user-menu">
                <div className="user-avatar">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <span className="user-name">{user?.first_name} {user?.last_name?.[0]}.</span>
                <button className="icon-btn icon-btn--danger" onClick={logout} title="Вийти" id="nav-logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm" id="nav-login">
              Увійти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

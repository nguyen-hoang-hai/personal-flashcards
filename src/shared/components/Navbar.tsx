import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  Sparkles,
  BarChart2,
  Activity,
  User as UserIcon,
  Globe,
} from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  currentLanguage?: Language;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLanguage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isEn = currentLanguage === 'en';
  const langPrefix = currentLanguage ? `/${currentLanguage}` : '';

  const navLinks = currentLanguage
    ? [
        { label: 'Tổng quan', path: `${langPrefix}/dashboard`, icon: Layers },
        { label: 'Từ vựng', path: `${langPrefix}/vocabulary`, icon: BookOpen },
        { label: 'Bộ thẻ (Decks)', path: `${langPrefix}/decks`, icon: Sparkles },
        { label: 'Data Health', path: `${langPrefix}/health`, icon: Activity },
        { label: 'Thống kê', path: `${langPrefix}/statistics`, icon: BarChart2 },
      ]
    : [];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Language Switch */}
        <div className="flex items-center gap-4">
          <Link
            to="/select-language"
            className="flex items-center gap-2.5 group font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white shadow-sm transition-all duration-300 group-hover:scale-105 ${
                isEn
                  ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-indigo-500/25'
                  : currentLanguage === 'ja'
                  ? 'bg-gradient-to-tr from-rose-600 to-pink-500 shadow-rose-500/25'
                  : 'bg-gradient-to-tr from-slate-700 to-slate-900'
              }`}
            >
              {isEn ? 'EN' : currentLanguage === 'ja' ? 'JP' : 'FL'}
            </div>
            <span className="hidden sm:inline font-extrabold tracking-tight text-slate-900">
              Flashcards
            </span>
          </Link>

          {/* Smooth Sliding Language Toggle */}
          {currentLanguage && (
            <div className="relative flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold select-none">
              {/* Animated sliding pill */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-xs transition-all duration-200 ease-out bg-white ${
                  isEn ? 'left-1' : 'left-[calc(50%+2px)]'
                }`}
              />

              <button
                type="button"
                onClick={() => navigate('/en/dashboard')}
                className={`relative z-10 px-3 py-1 rounded-lg transition-colors w-16 text-center cursor-pointer ${
                  isEn ? 'text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => navigate('/ja/dashboard')}
                className={`relative z-10 px-3 py-1 rounded-lg transition-colors w-16 text-center cursor-pointer ${
                  !isEn ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                日本語
              </button>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        {currentLanguage && (
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? isEn
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                        : 'bg-rose-50 text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    size={16}
                    className={`transition-transform duration-150 ${
                      isActive ? 'scale-110' : ''
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right menu */}
        <div className="flex items-center gap-2">
          <Link
            to="/select-language"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Đổi không gian học"
          >
            <Globe size={19} />
          </Link>
          <Link
            to="/account"
            className="flex items-center gap-2 p-1 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            title="Tài khoản & Sao lưu"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-2xs">
              <UserIcon size={16} />
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile subnav with smooth pill indicator */}
      {currentLanguage && (
        <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1.5 scrollbar-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? isEn
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 active:scale-95'
                }`}
              >
                <Icon size={13} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

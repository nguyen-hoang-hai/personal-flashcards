import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Sparkles, ShieldCheck, ArrowRight, Mail, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('personal_flashcards_email') || '2412nguyenhoanghai@gmail.com';
    setEmail(savedEmail);

    // Fetch Google Client ID if available
    apiFetch<{ googleClientId?: string }>('/api/auth/config')
      .then((res) => {
        const id = res?.googleClientId || (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
        if (id) setClientId(id);
      })
      .catch(() => {});
  }, []);

  // Monitor Google Identity Services script
  useEffect(() => {
    if (!clientId) return;

    const checkGsi = () => {
      if (window.google?.accounts?.id) {
        setIsGsiLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGsi()) return;

    const interval = setInterval(() => {
      if (checkGsi()) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [clientId]);

  // Render Google button if configured
  useEffect(() => {
    if (!clientId || !isGsiLoaded || !googleBtnRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          if (!response.credential) return;
          try {
            setLoading(true);
            setError(null);
            await apiFetch('/api/auth/google', {
              method: 'POST',
              body: JSON.stringify({ credential: response.credential }),
            });
            navigate('/select-language');
          } catch (err: any) {
            setError(err.message || 'Đăng nhập Google thất bại');
          } finally {
            setLoading(false);
          }
        },
        auto_select: false,
      });

      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 320,
        logo_alignment: 'left',
      });
    } catch (e) {
      console.error(e);
    }
  }, [clientId, isGsiLoaded]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail }),
      });
      localStorage.setItem('personal_flashcards_email', cleanEmail);
      navigate('/select-language');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center">
        {/* Logo Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-500 text-white shadow-lg mb-6 shadow-indigo-500/20">
          <Sparkles size={32} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Personal Flashcards
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Hệ thống học tiếng Anh và tiếng Nhật với Spaced Repetition (Lặp lại ngắt quãng).
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm text-left">
            {error}
          </div>
        )}

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Google Sign In option if Client ID is configured */}
        {clientId && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3">Hoặc đăng nhập bằng tài khoản Google</p>
            <div ref={googleBtnRef} className="flex justify-center" />
          </div>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Xác thực an toàn bằng Cookie phiên bảo mật</span>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center max-w-sm">
        Kho từ vựng & bộ thẻ dùng chung. Tiến độ học và lịch ôn tập được lưu trữ và đồng bộ an toàn trên Cloudflare D1.
      </p>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Sparkles, ShieldCheck, KeyRound, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const [inputClientId, setInputClientId] = useState<string>('');
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Google Client ID from backend or localStorage
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await apiFetch<{ googleClientId?: string }>('/api/auth/config');
        const envId = res?.googleClientId || (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
        const savedId = localStorage.getItem('personal_flashcards_google_client_id') || '';
        const activeId = envId || savedId;

        if (activeId) {
          setClientId(activeId);
        }
      } catch (e) {
        const savedId = localStorage.getItem('personal_flashcards_google_client_id') || '';
        if (savedId) setClientId(savedId);
      }
    };

    fetchConfig();
  }, []);

  // 2. Monitor when Google script is ready
  useEffect(() => {
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
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 3. Render Google Sign In button once clientId and GSI script are ready
  useEffect(() => {
    if (!clientId || !isGsiLoaded || !googleBtnRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
      });

      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 320,
        logo_alignment: 'left',
      });
    } catch (err: any) {
      console.error('Google Sign In initialization error:', err);
      setError('Không thể khởi tạo nút đăng nhập Google. Vui lòng kiểm tra Client ID.');
    }
  }, [clientId, isGsiLoaded]);

  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      setError('Không nhận được thông tin xác thực từ Google.');
      return;
    }

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
  };

  const handleSaveCustomClientId = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputClientId.trim();
    if (!trimmed) {
      setError('Vui lòng nhập Google Client ID hợp lệ');
      return;
    }
    localStorage.setItem('personal_flashcards_google_client_id', trimmed);
    setClientId(trimmed);
    setError(null);
  };

  const handleDevLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiFetch('/api/auth/dev-login', { method: 'POST' });
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
          Đăng nhập bằng tài khoản Google cá nhân. Dữ liệu từ vựng dùng chung và tiến độ học được lưu riêng cho từng tài khoản.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm text-left">
            {error}
          </div>
        )}

        {/* Google Login Section */}
        {clientId ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center min-h-[46px]">
              {loading ? (
                <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium py-3">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang xử lý đăng nhập...</span>
                </div>
              ) : (
                <div ref={googleBtnRef} className="flex justify-center" />
              )}
            </div>

            <div className="pt-3 text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Xác thực chính chủ qua Google Identity</span>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('personal_flashcards_google_client_id');
                  setClientId('');
                }}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Đổi Google Client ID khác
              </button>
            </div>
          </div>
        ) : (
          /* Client ID Configuration Prompt */
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <KeyRound size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Cần thiết lập Google Client ID</p>
                  <p>
                    Để bất kỳ máy nào cũng có thể bấm <strong>"Đăng nhập bằng Google"</strong> chính chủ, bạn chỉ cần nhập Google Client ID (miễn phí từ Google Cloud).
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveCustomClientId} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Google OAuth Client ID:
              </label>
              <input
                type="text"
                placeholder="xxxxxx-xxxxxxxx.apps.googleusercontent.com"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg shadow-sm transition-all"
              >
                Lưu & Kích hoạt Đăng nhập Google
              </button>
            </form>

            {/* Step by step guide accordion */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setShowConfigHelp(!showConfigHelp)}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-medium text-slate-700"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-indigo-500" />
                  Hướng dẫn lấy Client ID (2 phút)
                </span>
                {showConfigHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showConfigHelp && (
                <div className="p-3 bg-white space-y-2 text-slate-600 border-t border-slate-200">
                  <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                    <li>
                      Mở{' '}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                      >
                        Google Cloud Credentials <ExternalLink size={11} />
                      </a>
                    </li>
                    <li>Bấm <strong>Create Credentials</strong> &rarr; chọn <strong>OAuth client ID</strong>.</li>
                    <li>Loại ứng dụng chọn: <strong>Web application</strong>.</li>
                    <li>
                      Tại <strong>Authorized JavaScript origins</strong>, thêm domain của ứng dụng:
                      <code className="block mt-1 p-1 bg-slate-100 rounded text-[11px] text-slate-800 break-all select-all font-mono">
                        {window.location.origin}
                      </code>
                    </li>
                    <li>Bấm <strong>Create</strong> rồi sao chép chuỗi <strong>Client ID</strong> dán vào ô trên.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Development Quick Login link (visible in dev mode only) */}
        {(import.meta as any).env?.DEV && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleDevLogin}
              disabled={loading}
              className="text-xs text-slate-400 hover:text-indigo-600 underline"
            >
              [Dev Only] Đăng nhập nhanh chế độ cục bộ
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center max-w-sm">
        Hệ thống học Spaced Repetition cá nhân hóa. Kho từ vựng & bộ thẻ dùng chung, tiến độ và lịch ôn FSRS được lưu trữ độc lập trên Cloudflare D1.
      </p>
    </div>
  );
};

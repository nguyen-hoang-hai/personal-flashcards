import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Sparkles, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          Hệ thống học tiếng Anh và tiếng Nhật cá nhân hóa với Spaced Repetition (Lặp lại ngắt quãng).
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Dev Quick Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleDevLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Đăng nhập với tư cách Chủ sở hữu</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Google Sign In info */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Xác thực an toàn bằng Cookie phiên bảo mật</span>
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center max-w-sm">
        Hệ thống cá nhân 1 tài khoản duy nhất. Dữ liệu được bảo vệ và đồng bộ liên tục trên Cloudflare D1.
      </p>
    </div>
  );
};

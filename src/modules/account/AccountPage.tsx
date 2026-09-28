import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { User } from '../../shared/types';
import { User as UserIcon, LogOut, Download, ShieldCheck, Database, Loader2 } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ user: User }>('/api/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tài khoản & Dữ liệu
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Quản lý phiên đăng nhập và sao lưu dữ liệu cá nhân.
        </p>
      </div>

      {/* User profile card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20">
            <UserIcon size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.display_name || 'Chủ sở hữu'}</h2>
            <p className="text-slate-500 text-xs">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Mã người dùng (ID)</span>
            <span className="font-mono text-slate-700">{user?.id}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <span className="text-slate-500">Trạng thái bảo mật</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck size={16} />
              <span>Cookie __Host-session (HttpOnly, Secure)</span>
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Cơ sở dữ liệu</span>
            <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
              <Database size={16} />
              <span>Cloudflare D1 (Local SQLite Emulation)</span>
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>
      </div>
    </div>
  );
};

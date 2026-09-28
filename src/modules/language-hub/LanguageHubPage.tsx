import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { BookOpen, Layers, ArrowRight, Clock, Loader2, Sparkles } from 'lucide-react';

interface LanguageStat {
  language: 'en' | 'ja';
  dueCards: number;
  newWords: number;
  sessionsCompletedToday: number;
  totalDecks: number;
}

export const LanguageHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<{ en: LanguageStat; ja: LanguageStat } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ en: LanguageStat; ja: LanguageStat }>('/api/languages/hub')
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load language hub stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles size={14} />
            <span>Không gian học cá nhân</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Language Hub
          </h1>
          <p className="text-slate-500 text-base">
            Chọn ngôn ngữ bạn muốn tập trung ôn luyện hôm nay
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={36} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {/* English Card */}
            <div
              onClick={() => navigate('/en/dashboard')}
              className="group cursor-pointer bg-white rounded-3xl p-8 border-2 border-transparent hover:border-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-100 transition-colors" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/25">
                  EN
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  <span>{stats?.en.totalDecks || 0} Decks</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                English
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Từ vựng kỹ thuật, giao tiếp hàng ngày và công sở.
              </p>

              {/* Stats pill */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Cần ôn (Due)</div>
                  <div className="text-xl font-bold text-indigo-600">
                    {stats?.en.dueCards || 0}{' '}
                    <span className="text-xs font-normal text-slate-500">thẻ</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Từ mới sẵn sàng</div>
                  <div className="text-xl font-bold text-slate-800">
                    {stats?.en.newWords || 0}{' '}
                    <span className="text-xs font-normal text-slate-500">từ</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>Vào không gian English</span>
                <ArrowRight size={18} />
              </div>
            </div>

            {/* Japanese Card */}
            <div
              onClick={() => navigate('/ja/dashboard')}
              className="group cursor-pointer bg-white rounded-3xl p-8 border-2 border-transparent hover:border-rose-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-rose-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-rose-100 transition-colors" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-rose-500/25">
                  JA
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  <span>{stats?.ja.totalDecks || 0} Decks</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                日本語
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Kanji N5-N1, cách đọc Furigana và ngữ cảnh giao tiếp.
              </p>

              {/* Stats pill */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Cần ôn (Due)</div>
                  <div className="text-xl font-bold text-rose-600">
                    {stats?.ja.dueCards || 0}{' '}
                    <span className="text-xs font-normal text-slate-500">thẻ</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Từ mới sẵn sàng</div>
                  <div className="text-xl font-bold text-slate-800">
                    {stats?.ja.newWords || 0}{' '}
                    <span className="text-xs font-normal text-slate-500">từ</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                <span>Vào không gian 日本語</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

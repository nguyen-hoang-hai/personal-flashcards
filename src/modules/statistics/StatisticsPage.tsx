import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Language } from '../../shared/types';
import { BarChart2, PieChart, TrendingUp, Calendar, Loader2 } from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const language = (lang || 'en') as Language;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    statusDistribution: { status: string; count: number }[];
    ratingDistribution: { rating: string; count: number }[];
    recentActivity: { review_date: string; review_count: number }[];
  } | null>(null);

  const isEn = language === 'en';
  const themeColor = isEn ? 'indigo' : 'rose';

  useEffect(() => {
    apiFetch(`/api/languages/${language}/statistics`)
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className={`animate-spin text-${themeColor}-600`} size={36} />
      </div>
    );
  }

  // Calculate totals
  const totalCards = (data?.statusDistribution || []).reduce((acc, curr) => acc + curr.count, 0);
  const totalReviews = (data?.ratingDistribution || []).reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
          <TrendingUp size={14} className="text-emerald-500" />
          <span>Biểu đồ tiến độ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Thống kê học tập ({isEn ? 'English' : '日本語'})
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Quan sát xu hướng ghi nhớ và khối lượng thẻ đã học theo thời gian.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Memory Status Distribution */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PieChart size={18} className="text-indigo-600" />
              <span>Phân bố trạng thái ghi nhớ</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Tổng {totalCards} thẻ học</span>
          </div>

          <div className="space-y-3.5">
            {['new', 'learning', 'review', 'mastered'].map((status) => {
              const item = (data?.statusDistribution || []).find((s) => s.status === status);
              const count = item ? item.count : 0;
              const percent = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;

              const colors: Record<string, { bg: string; text: string; bar: string; label: string }> = {
                new: { bg: 'bg-slate-100', text: 'text-slate-700', bar: 'bg-slate-400', label: 'Chưa học (New)' },
                learning: { bg: 'bg-amber-100', text: 'text-amber-800', bar: 'bg-amber-500', label: 'Đang nạp (Learning)' },
                review: { bg: 'bg-blue-100', text: 'text-blue-800', bar: 'bg-blue-600', label: 'Đang củng cố (Review)' },
                mastered: { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500', label: 'Thành thạo (Mastered)' },
              };

              const style = colors[status];

              return (
                <div key={status}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{style.label}</span>
                    <span className="text-slate-500">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${style.bar} transition-all duration-500`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart2 size={18} className="text-rose-600" />
              <span>Phân bố mức đánh giá</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Tổng {totalReviews} lượt đánh giá</span>
          </div>

          <div className="space-y-3.5">
            {[
              { key: 'again', label: 'Again (< 10m)', bar: 'bg-rose-500' },
              { key: 'hard', label: 'Hard (1d)', bar: 'bg-amber-500' },
              { key: 'good', label: 'Good (3d)', bar: 'bg-indigo-600' },
              { key: 'easy', label: 'Easy (7d)', bar: 'bg-emerald-500' },
            ].map(({ key, label, bar }) => {
              const item = (data?.ratingDistribution || []).find((r) => r.rating === key);
              const count = item ? item.count : 0;
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <div key={key}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{label}</span>
                    <span className="text-slate-500">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${bar} transition-all duration-500`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 14-day Activity History */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <h2 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-emerald-600" />
          <span>Lịch sử ôn tập (14 ngày gần nhất)</span>
        </h2>

        {(data?.recentActivity || []).length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Chưa có lượt ôn tập nào trong 14 ngày qua. Hãy bắt đầu một phiên học!
          </div>
        ) : (
          <div className="space-y-2">
            {(data?.recentActivity || []).map((act) => (
              <div
                key={act.review_date}
                className="flex items-center justify-between py-2 border-b border-slate-50 text-xs"
              >
                <span className="font-medium text-slate-600">{act.review_date}</span>
                <span className="font-bold text-slate-900 px-2.5 py-1 bg-slate-100 rounded-lg">
                  {act.review_count} lượt ôn
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

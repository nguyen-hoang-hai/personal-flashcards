import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Language } from '../../shared/types';

export const SessionSummaryPage: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const language = (lang || 'en') as Language;
  const navigate = useNavigate();

  const isEn = language === 'en';

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Xuất sắc! Phiên học hoàn thành
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Tiến độ ôn tập và lịch ngắt quãng (Spaced Repetition) đã được lưu thành công.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/${language}/dashboard`)}
            className={`w-full py-3.5 px-4 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
              isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <span>Quay về Dashboard</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate('/select-language')}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-sm transition-all"
          >
            Chọn không gian ngôn ngữ khác
          </button>
        </div>
      </div>
    </div>
  );
};

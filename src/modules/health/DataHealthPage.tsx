import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Language } from '../../shared/types';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Loader2,
} from 'lucide-react';

interface HealthIssue {
  id: string;
  vocabularyId: string;
  word: string;
  deckId: string;
  deckTitle: string;
  severity: 'error' | 'warning' | 'suggestion';
  message: string;
  field?: string;
}

export const DataHealthPage: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const language = (lang || 'en') as Language;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    summary: { totalIssues: number; errors: number; warnings: number; suggestions: number };
    issues: HealthIssue[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'error' | 'warning' | 'suggestion'>('all');

  const isEn = language === 'en';
  const themeColor = isEn ? 'indigo' : 'rose';

  const scanHealth = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/health?language=${language}`);
      setData(res);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi quét Data Health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scanHealth();
  }, [language]);

  const filteredIssues = (data?.issues || []).filter((issue) =>
    activeTab === 'all' ? true : issue.severity === activeTab
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Activity size={14} className="text-emerald-500" />
            <span>Chất lượng dữ liệu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Health ({isEn ? 'English' : '日本語'})
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Phát hiện các từ vựng thiếu nghĩa, thiếu phiên âm/cách đọc hoặc bị trùng lặp.
          </p>
        </div>

        <button
          onClick={scanHealth}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Quét lại</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className={`animate-spin text-${themeColor}-600`} size={36} />
        </div>
      ) : !data || data.summary.totalIssues === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Dữ liệu hoàn hảo!</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Không tìm thấy lỗi hoặc thiếu sót nào trong kho từ vựng {isEn ? 'tiếng Anh' : 'tiếng Nhật'}.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs opacity-70 font-semibold">Tất cả vấn đề</div>
              <div className="text-2xl font-bold mt-1">{data.summary.totalIssues}</div>
            </button>

            <button
              onClick={() => setActiveTab('error')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === 'error'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                <AlertCircle size={14} />
                <span>Lỗi (Errors)</span>
              </div>
              <div className="text-2xl font-bold mt-1 text-rose-600">{data.summary.errors}</div>
            </button>

            <button
              onClick={() => setActiveTab('warning')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === 'warning'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                <AlertTriangle size={14} />
                <span>Cảnh báo</span>
              </div>
              <div className="text-2xl font-bold mt-1 text-amber-600">{data.summary.warnings}</div>
            </button>

            <button
              onClick={() => setActiveTab('suggestion')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeTab === 'suggestion'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-blue-500 font-semibold flex items-center gap-1">
                <Lightbulb size={14} />
                <span>Gợi ý</span>
              </div>
              <div className="text-2xl font-bold mt-1 text-blue-600">{data.summary.suggestions}</div>
            </button>
          </div>

          {/* Issues List with smooth tab transition */}
          <div key={activeTab} className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden animate-card-enter">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      issue.severity === 'error'
                        ? 'bg-rose-100 text-rose-600'
                        : issue.severity === 'warning'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {issue.severity === 'error' ? (
                      <AlertCircle size={18} />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <Lightbulb size={18} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{issue.word}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {issue.deckTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{issue.message}</p>
                  </div>
                </div>

                <Link
                  to={`/${language}/vocabulary`}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shrink-0"
                >
                  Sửa trong kho từ
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

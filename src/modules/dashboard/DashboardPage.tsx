import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Deck, Language } from '../../shared/types';
import {
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  HelpCircle,
  Lock,
  RotateCcw,
} from 'lucide-react';


export const DashboardPage: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const language = (lang || 'en') as Language;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [startingSession, setStartingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionSize, setSessionSize] = useState<number>(10);

  const isEn = language === 'en';
  const themeColor = isEn ? 'indigo' : 'rose';

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashData, decksData] = await Promise.all([
        apiFetch(`/api/languages/${language}/dashboard`),
        apiFetch(`/api/decks?language=${language}`),
      ]);
      setSummary(dashData);
      setDecks(decksData.decks || []);

      // Auto-set session size to match due cards (up to 30), or 20 if more
      const dueCount = dashData.dueCards || 0;
      if (dueCount > 0) {
        if (dueCount <= 30) {
          setSessionSize(dueCount);
        } else {
          setSessionSize(20);
        }
      } else {
        setSessionSize(10);
      }

      // Default select all active decks
      const activeIds = (decksData.decks || [])
        .filter((d: Deck) => d.study_status === 'active')
        .map((d: Deck) => d.id);
      setSelectedDeckIds(activeIds);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [language]);

  const toggleDeckSelection = (deckId: string) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId) ? prev.filter((id) => id !== deckId) : [...prev, deckId]
    );
  };

  const handleSelectAll = () => {
    const activeIds = decks.filter((d) => d.study_status === 'active').map((d) => d.id);
    setSelectedDeckIds(activeIds);
  };

  const handleDeselectAll = () => {
    setSelectedDeckIds([]);
  };

  const handleStartSession = async (size: number = 10, mode: 'standard' | 'cram' = 'standard', studyMode: 'flashcard' | 'quiz' = 'flashcard') => {
    if (selectedDeckIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 bộ thẻ (deck) để bắt đầu học.');
      return;
    }

    try {
      setStartingSession(true);
      setError(null);

      // Save study mode to sessionStorage so StudyPage can read it
      try {
        sessionStorage.setItem(`studyMode_${language}`, studyMode);
      } catch {}

      const res = await apiFetch('/api/study/session/start', {
        method: 'POST',
        body: JSON.stringify({
          language,
          activeDeckIds: selectedDeckIds,
          sessionSize: size,
          mode,
        }),
      });

      if (!res.session) {
        alert(res.message || 'Không có thẻ nào để luyện tập vào lúc này!');
        return;
      }

      navigate(`/${language}/study`);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi khởi tạo phiên học');
    } finally {
      setStartingSession(false);
    }
  };


  const handleToggleDeckVisibility = async (deck: Deck, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = deck.study_status === 'hidden' ? 'active' : 'hidden';
    try {
      await apiFetch(`/api/decks/${deck.id}/settings`, {
        method: 'PUT',
        body: JSON.stringify({ study_status: nextStatus }),
      });
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi đổi trạng thái deck');
    }
  };

  const isAllDone = summary && summary.dueCards + summary.newWords === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Unfinished Session Banner */}
      {summary?.activeSession && (
        <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-card-enter">
          <div className="flex items-center gap-3 text-amber-900">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Clock size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base">Bạn có một phiên học đang dở</h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Đã hoàn thành {summary.activeSession.completed_cards} / {summary.activeSession.total_cards} thẻ. Tiếp tục để không bị gián đoạn.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/${language}/study`)}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            <span>Tiếp tục phiên học</span>
          </button>
        </div>
      )}

      {/* Hero Due Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
              <Sparkles size={13} className={isEn ? 'text-indigo-600' : 'text-rose-600'} />
              <span>Không gian {isEn ? 'English' : '日本語'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kế hoạch học hôm nay
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
              {isAllDone
                ? 'Tuyệt vời! Bạn đã hoàn thành toàn bộ mục tiêu hôm nay. Có thể ôn tập tự do bất kỳ lúc nào.'
                : (summary?.dueCards || 0) > 0
                ? `Bạn còn ${summary?.dueCards} thẻ cần ôn tập. Hãy hoàn thành hết các thẻ cần ôn trước khi mở từ mới nhé!`
                : 'Đã hoàn thành hết thẻ cần ôn! Bạn đã sẵn sàng học các từ mới tiếp theo.'}
            </p>
          </div>

          {/* Quick Action Study Box - Perfectly Balanced */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Primary Study Actions - Symmetrical grid of 2 buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
              {isAllDone ? (
                <>
                  <button
                    onClick={() => handleStartSession(sessionSize, 'cram', 'flashcard')}
                    disabled={startingSession}
                    className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 min-w-[170px]"
                    title="Ôn tập tự do các thẻ đã học bất cứ lúc nào"
                  >
                    <Sparkles size={18} />
                    <span>Luyện tự do ({sessionSize})</span>
                  </button>
                  <button
                    onClick={() => handleStartSession(sessionSize, 'cram', 'quiz')}
                    disabled={startingSession}
                    className="h-12 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 min-w-[170px]"
                    title="Luyện tập dạng trắc nghiệm 4 đáp án"
                  >
                    <HelpCircle size={18} />
                    <span>Trắc nghiệm ({sessionSize})</span>
                  </button>
                </>
              ) : (summary?.dueCards || 0) > 0 ? (
                <>
                  <button
                    onClick={() => handleStartSession(sessionSize, 'standard', 'flashcard')}
                    disabled={startingSession}
                    className={`h-12 px-6 rounded-2xl text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 min-w-[170px] disabled:opacity-40 disabled:cursor-not-allowed ${
                      isEn
                        ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                        : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                    }`}
                    title="Ôn tập thẻ đến hạn theo dạng Flashcard"
                  >
                    <RotateCcw size={18} />
                    <span>
                      {sessionSize >= (summary?.dueCards || 0)
                        ? `Ôn tất cả (${summary?.dueCards} thẻ)`
                        : `Ôn tập (${sessionSize} thẻ)`}
                    </span>
                  </button>
                  <button
                    onClick={() => handleStartSession(sessionSize, 'standard', 'quiz')}
                    disabled={startingSession}
                    className="h-12 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 min-w-[170px] disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Ôn tập dạng trắc nghiệm 4 đáp án"
                  >
                    <HelpCircle size={18} />
                    <span>
                      {sessionSize >= (summary?.dueCards || 0)
                        ? `Trắc nghiệm (${summary?.dueCards})`
                        : `Trắc nghiệm (${sessionSize})`}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleStartSession(sessionSize, 'standard', 'flashcard')}
                    disabled={startingSession}
                    className={`h-12 px-6 rounded-2xl text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 min-w-[170px] disabled:opacity-40 disabled:cursor-not-allowed ${
                      isEn
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
                        : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                    }`}
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Học từ mới ({sessionSize})</span>
                  </button>
                  <button
                    onClick={() => handleStartSession(sessionSize, 'standard', 'quiz')}
                    disabled={startingSession}
                    className="h-12 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold shadow-md shadow-violet-600/25 transition-all flex items-center justify-center gap-2 min-w-[170px] disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Học từ mới dạng trắc nghiệm 4 đáp án"
                  >
                    <HelpCircle size={18} />
                    <span>Trắc nghiệm ({sessionSize})</span>
                  </button>
                </>
              )}
            </div>

            {/* Session Size Segmented Toggle */}
            <div className="flex items-center gap-2 text-xs text-slate-500 self-center lg:self-end">
              <span className="font-medium">Số thẻ mỗi phiên:</span>
              <div className="bg-slate-100 p-0.5 rounded-xl flex items-center gap-1 border border-slate-200/80">
                {(summary?.dueCards || 0) > 0 ? (
                  <>
                    {(summary?.dueCards || 0) > 10 && (
                      <button
                        onClick={() => setSessionSize(10)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          sessionSize === 10
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        10 thẻ
                      </button>
                    )}
                    {(summary?.dueCards || 0) > 20 && (
                      <button
                        onClick={() => setSessionSize(20)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          sessionSize === 20
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        20 thẻ
                      </button>
                    )}
                    <button
                      onClick={() => setSessionSize(summary.dueCards)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        sessionSize === summary.dueCards
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Tất cả ({summary.dueCards} thẻ)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSessionSize(10)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        sessionSize === 10
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      10 thẻ
                    </button>
                    <button
                      onClick={() => setSessionSize(20)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        sessionSize === 20
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      20 thẻ
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Counter Cards - 3 Symmetrical Stat Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6">
          {/* Card 1: Due */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cần ôn (Due)</div>
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight my-1 ${
                isEn ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
              ) : (
                summary?.dueCards || 0
              )}
            </div>
            {(summary?.dueCards || 0) > 0 ? (
              <div className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-100/60 px-2 py-0.5 rounded-md w-fit">
                <RotateCcw size={12} />
                <span>Cần hoàn thành trước</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-md w-fit">
                <Check size={12} />
                <span>Đã ôn xong hôm nay</span>
              </div>
            )}
          </div>

          {/* Card 2: New */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Từ mới (New)</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight my-1">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
              ) : (
                summary?.newWords || 0
              )}
            </div>
            {(summary?.dueCards || 0) > 0 ? (
              <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-200/60 px-2 py-0.5 rounded-md w-fit">
                <Lock size={12} />
                <span>Mở sau khi ôn xong</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-md w-fit">
                <Sparkles size={12} />
                <span>Sẵn sàng học ngay</span>
              </div>
            )}
          </div>

          {/* Card 3: Completed */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Phiên xong hôm nay</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight my-1">
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
              ) : (
                summary?.sessionsCompletedToday || 0
              )}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-200/60 px-2 py-0.5 rounded-md w-fit">
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span>Tiến độ hàng ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deck Selector Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">Bộ thẻ ôn tập (Decks)</h2>
            {decks.length > 1 && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleSelectAll}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Chọn tất cả
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={handleDeselectAll}
                  className="text-slate-500 font-medium hover:underline"
                >
                  Bỏ chọn
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Chạm vào thẻ để chọn học xen kẽ hôm nay (Controlled Shuffle).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/${language}/decks`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Quản lý Decks
          </Link>
          <Link
            to={`/${language}/vocabulary`}
            className={`text-xs font-semibold text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 ${
              isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <Plus size={14} />
            <span>Thêm từ vựng</span>
          </Link>
        </div>
      </div>

      {/* Deck Cards List with Skeleton loading */}
      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200 p-4 shimmer-effect" />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Chưa có bộ thẻ nào</h3>
          <p className="text-slate-500 text-xs mb-4">
            Hãy tạo bộ thẻ đầu tiên của bạn để bắt đầu thêm từ vựng và học tập.
          </p>
          <Link
            to={`/${language}/decks`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold ${
              isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <Plus size={16} />
            <span>Tạo Deck đầu tiên</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {decks.map((deck) => {
            const isSelected = selectedDeckIds.includes(deck.id);
            const isHidden = deck.study_status === 'hidden';

            return (
              <div
                key={deck.id}
                onClick={() => !isHidden && toggleDeckSelection(deck.id)}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer select-none ${
                  isHidden
                    ? 'opacity-60 bg-slate-50/80 border-slate-200 cursor-not-allowed'
                    : isSelected
                    ? isEn
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/10'
                      : 'border-rose-500 ring-2 ring-rose-500/20 shadow-md bg-rose-50/10'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  {/* Custom Checkbox Pill */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? isEn
                          ? 'bg-indigo-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{deck.title}</h4>
                      {isHidden && (
                        <span className="text-[10px] font-semibold uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                          Đã ẩn
                        </span>
                      )}
                    </div>
                    {deck.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{deck.description}</p>
                    )}
                  </div>
                </div>

                {/* Due / New / Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-800">
                      <span className={isEn ? 'text-indigo-600 font-bold' : 'text-rose-600 font-bold'}>
                        {deck.due_count || 0} due
                      </span>{' '}
                      • <span>{deck.new_count || 0} new</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Tổng {deck.total_words || 0} từ
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggleDeckVisibility(deck, e)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                    title={isHidden ? 'Hiện deck này' : 'Tạm ẩn deck này'}
                  >
                    {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Language, StudySession, StudySessionCard, Rating } from '../../shared/types';
import { TTSButton } from '../../shared/components/TTSButton';
import { speakText } from '../../shared/utils/tts';
import {
  X,
  Volume2,
  VolumeX,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export const StudyPage: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const language = (lang || 'en') as Language;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<StudySession | null>(null);
  const [cards, setCards] = useState<StudySessionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [activeRating, setActiveRating] = useState<Rating | null>(null);
  const [autoTTS, setAutoTTS] = useState(true);
  const [conflictToast, setConflictToast] = useState<string | null>(null);

  const isEn = language === 'en';
  const themeColor = isEn ? 'indigo' : 'rose';

  // Load active session
  useEffect(() => {
    apiFetch<{ session: StudySession | null; cards: StudySessionCard[] }>(
      `/api/study/session/active?language=${language}`
    )
      .then((data) => {
        if (!data.session || !data.cards || data.cards.length === 0) {
          navigate(`/${language}/dashboard`);
          return;
        }
        setSession(data.session);
        setCards(data.cards);

        // Find first pending card
        const pendingIdx = data.cards.findIndex((c) => c.status === 'pending');
        if (pendingIdx === -1 && data.cards.length > 0) {
          navigate(`/${language}/study/summary`);
          return;
        }
        setCurrentIndex(pendingIdx >= 0 ? pendingIdx : 0);
      })
      .catch((err) => {
        console.error('Failed to load study session:', err);
        navigate(`/${language}/dashboard`);
      })
      .finally(() => setLoading(false));
  }, [language, navigate]);

  const currentCard = cards[currentIndex];

  // Flip card with smooth 3D transition & optional auto TTS
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const nextState = !prev;
      if (nextState && autoTTS && currentCard) {
        const textToSpeak =
          language === 'ja' && currentCard.reading ? currentCard.reading : currentCard.word;
        speakText(textToSpeak, language);
      }
      // Haptic feedback for mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
      return nextState;
    });
  }, [autoTTS, currentCard, language]);

  // Answer card
  const handleAnswer = async (rating: Rating) => {
    if (!session || !currentCard || answering) return;

    setActiveRating(rating);
    setAnswering(true);

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(rating === 'again' ? [20, 40, 20] : 15);
    }

    try {
      await apiFetch(`/api/study/session/${session.id}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          studyDirectionId: currentCard.study_direction_id,
          rating,
          expectedProgressVersion: currentCard.version,
        }),
      });

      // Brief pause for tactile visual feedback before sliding to next card
      setTimeout(() => {
        advanceToNextCard(rating === 'again');
      }, 150);
    } catch (err: any) {
      if (err.status === 409) {
        setConflictToast('Thẻ này đã được ôn từ thiết bị khác. Đang chuyển tiếp...');
        setTimeout(() => setConflictToast(null), 3000);
        advanceToNextCard(false);
      } else {
        alert(err.message || 'Lỗi khi lưu câu trả lời');
      }
      setAnswering(false);
      setActiveRating(null);
    }
  };

  const advanceToNextCard = async (wasAgain: boolean) => {
    setIsFlipped(false);
    setActiveRating(null);
    setAnswering(false);

    let updatedCards = cards;
    if (wasAgain && currentCard) {
      const requeuedCard: StudySessionCard = {
        ...currentCard,
        id: crypto.randomUUID(),
        status: 'pending',
        version: (currentCard.version || 1) + 1,
      };
      updatedCards = [...cards, requeuedCard];
      setCards(updatedCards);
    }

    const nextIdx = currentIndex + 1;

    if (nextIdx < updatedCards.length) {
      setCurrentIndex(nextIdx);
    } else {
      // Session finished!
      if (session) {
        await apiFetch(`/api/study/session/${session.id}/complete`, { method: 'POST' });
      }
      navigate(`/${language}/study/summary`);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped && !answering) {
        if (e.key === '1') handleAnswer('again');
        if (e.key === '2') handleAnswer('hard');
        if (e.key === '3') handleAnswer('good');
        if (e.key === '4') handleAnswer('easy');
      } else if (e.code === 'Escape') {
        navigate(`/${language}/dashboard`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, isFlipped, answering, language, navigate]);

  if (loading || !currentCard) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <Loader2 className={`animate-spin text-${themeColor}-500 mb-3`} size={40} />
        <p className="text-slate-400 text-sm font-medium">Đang chuẩn bị phiên học...</p>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 ${
          isEn ? 'bg-indigo-600' : 'bg-rose-600'
        }`}
      />

      {/* Top Header */}
      <header className="max-w-3xl mx-auto w-full px-4 pt-4 sm:pt-6 z-10">
        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="bg-slate-800/90 text-slate-200 border border-slate-700/60 px-3 py-1 rounded-full font-semibold shadow-xs">
              {currentCard.deck_title}
            </span>
            <span className="font-medium text-slate-400">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoTTS(!autoTTS)}
              className={`p-2 rounded-xl border transition-colors ${
                autoTTS
                  ? 'bg-slate-800/80 border-slate-700 text-indigo-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={autoTTS ? 'Tự động đọc khi lật (Bật)' : 'Tự động đọc khi lật (Tắt)'}
            >
              {autoTTS ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={() => navigate(`/${language}/dashboard`)}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Tạm dừng & Thoát (Tiến độ được bảo lưu)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Smooth Animated Progress Bar */}
        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out shadow-xs ${
              isEn ? 'bg-gradient-to-r from-indigo-500 to-blue-400' : 'bg-gradient-to-r from-rose-500 to-pink-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Conflict Toast */}
      {conflictToast && (
        <div className="max-w-md mx-auto px-4 z-20">
          <div className="bg-amber-500/20 border border-amber-500/40 text-amber-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg backdrop-blur-md">
            <AlertTriangle size={15} />
            <span>{conflictToast}</span>
          </div>
        </div>
      )}

      {/* Central 3D Flip Flashcard */}
      <main className="max-w-2xl mx-auto w-full px-4 py-4 sm:py-6 flex-1 flex flex-col justify-center z-10">
        <div
          key={`card-wrapper-${currentIndex}`}
          className="perspective-1000 w-full min-h-[450px] sm:min-h-[490px] animate-card-enter"
        >
          <div
            onClick={handleFlip}
            className={`relative w-full h-full min-h-[450px] sm:min-h-[490px] rounded-3xl transition-transform duration-500 transform-style-3d cursor-pointer ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700/50">
                  {currentCard.direction === 'en_to_vi'
                    ? 'English ➔ Nghĩa'
                    : currentCard.direction === 'vi_to_en'
                    ? 'Nghĩa ➔ English'
                    : currentCard.direction === 'ja_to_vi'
                    ? 'Kanji ➔ Nghĩa'
                    : currentCard.direction === 'ja_to_reading'
                    ? 'Kanji ➔ Cách đọc'
                    : 'Thẻ từ vựng'}
                </span>

                <TTSButton
                  text={language === 'ja' && currentCard.reading ? currentCard.reading : currentCard.word}
                  language={language}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/80"
                  size={22}
                />
              </div>

              {/* Word Display */}
              <div className="text-center py-6">
                <div
                  className={`font-black text-white tracking-tight ${
                    language === 'ja'
                      ? 'kanji-text text-5xl sm:text-7xl leading-tight'
                      : 'text-4xl sm:text-6xl font-extrabold'
                  }`}
                >
                  {currentCard.word}
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                <span>Chạm hoặc bấm</span>
                <kbd className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-mono text-[11px] border border-slate-700">
                  Space
                </kbd>
                <span>để lật đáp án</span>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/40">
                  Đáp án & Giải nghĩa
                </span>

                <TTSButton
                  text={language === 'ja' && currentCard.reading ? currentCard.reading : currentCard.word}
                  language={language}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/80"
                  size={22}
                />
              </div>

              {/* Back Content */}
              <div className="py-2 space-y-3 text-left">
                {/* Word & Reading header */}
                <div>
                  <div
                    className={`font-bold text-white text-2xl sm:text-3xl ${
                      language === 'ja' ? 'kanji-text' : ''
                    }`}
                  >
                    {currentCard.word}
                  </div>
                  {language === 'ja' && currentCard.reading && (
                    <div className="text-rose-400 text-base sm:text-lg font-medium kanji-text mt-0.5">
                      【{currentCard.reading}】
                    </div>
                  )}
                  {language === 'en' && currentCard.pronunciation && (
                    <div className="text-indigo-400 text-sm font-mono mt-0.5">
                      {currentCard.pronunciation}
                    </div>
                  )}
                </div>

                {/* Meaning */}
                <div className="bg-slate-800/60 p-3.5 sm:p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 font-semibold mb-0.5">Nghĩa tiếng Việt</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">
                    {currentCard.meaning_vi}
                  </div>
                </div>

                {/* Example sentence */}
                {currentCard.example && (
                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <div className="text-sm text-slate-200">{currentCard.example}</div>
                    {currentCard.example_translation && (
                      <div className="text-xs text-slate-400">{currentCard.example_translation}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-slate-500 font-medium pt-1">
                Chọn mức độ ghi nhớ bên dưới để tiếp tục
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Rating Bar */}
      <footer className="max-w-2xl mx-auto w-full px-4 pb-6 sm:pb-8 z-10">
        {!isFlipped ? (
          <button
            onClick={handleFlip}
            className={`w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg transition-all duration-200 active:scale-[0.98] ${
              isEn
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
            }`}
          >
            Hiện đáp án (Space)
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {/* 1: Again */}
            <button
              onClick={() => handleAnswer('again')}
              disabled={answering}
              className={`py-3 sm:py-3.5 px-2 text-white font-bold rounded-2xl text-center transition-all shadow-md active:scale-95 border ${
                activeRating === 'again'
                  ? 'bg-rose-500 scale-95 ring-2 ring-rose-300 border-rose-400'
                  : 'bg-rose-600/90 hover:bg-rose-600 border-rose-500/50'
              }`}
            >
              <div className="text-sm sm:text-base">Again</div>
              <div className="text-[11px] text-rose-200 font-normal mt-0.5">&lt; 10m</div>
              <div className="text-[10px] text-rose-300/80 mt-1 hidden sm:block font-mono">[1]</div>
            </button>

            {/* 2: Hard */}
            <button
              onClick={() => handleAnswer('hard')}
              disabled={answering}
              className={`py-3 sm:py-3.5 px-2 text-white font-bold rounded-2xl text-center transition-all shadow-md active:scale-95 border ${
                activeRating === 'hard'
                  ? 'bg-amber-500 scale-95 ring-2 ring-amber-300 border-amber-400'
                  : 'bg-amber-600/90 hover:bg-amber-600 border-amber-500/50'
              }`}
            >
              <div className="text-sm sm:text-base">Hard</div>
              <div className="text-[11px] text-amber-200 font-normal mt-0.5">1d</div>
              <div className="text-[10px] text-amber-300/80 mt-1 hidden sm:block font-mono">[2]</div>
            </button>

            {/* 3: Good */}
            <button
              onClick={() => handleAnswer('good')}
              disabled={answering}
              className={`py-3 sm:py-3.5 px-2 text-white font-bold rounded-2xl text-center transition-all shadow-md active:scale-95 border ${
                activeRating === 'good'
                  ? 'bg-indigo-500 scale-95 ring-2 ring-indigo-300 border-indigo-400'
                  : 'bg-indigo-600/90 hover:bg-indigo-600 border-indigo-500/50'
              }`}
            >
              <div className="text-sm sm:text-base">Good</div>
              <div className="text-[11px] text-indigo-200 font-normal mt-0.5">3d</div>
              <div className="text-[10px] text-indigo-300/80 mt-1 hidden sm:block font-mono">[3]</div>
            </button>

            {/* 4: Easy */}
            <button
              onClick={() => handleAnswer('easy')}
              disabled={answering}
              className={`py-3 sm:py-3.5 px-2 text-white font-bold rounded-2xl text-center transition-all shadow-md active:scale-95 border ${
                activeRating === 'easy'
                  ? 'bg-emerald-500 scale-95 ring-2 ring-emerald-300 border-emerald-400'
                  : 'bg-emerald-600/90 hover:bg-emerald-600 border-emerald-500/50'
              }`}
            >
              <div className="text-sm sm:text-base">Easy</div>
              <div className="text-[11px] text-emerald-200 font-normal mt-0.5">7d</div>
              <div className="text-[10px] text-emerald-300/80 mt-1 hidden sm:block font-mono">[4]</div>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

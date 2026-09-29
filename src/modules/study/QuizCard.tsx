import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../shared/api/client';
import { StudySessionCard, Language, Rating } from '../../shared/types';
import { TTSButton } from '../../shared/components/TTSButton';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface QuizOption {
  id: string;
  word: string;
  meaning_vi: string;
  reading: string | null;
  pronunciation: string | null;
  isCorrect: boolean;
}

interface QuizCardProps {
  card: StudySessionCard;
  language: Language;
  onAnswer: (rating: Rating) => void;
  answering: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({ card, language, onAnswer, answering }) => {
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [selected, setSelected] = useState<string | null>(null); // option id
  const [revealed, setRevealed] = useState(false);

  const isEn = language === 'en';

  // Determine what is on the "front" (question) vs "answer" based on direction
  const isEnToVi = card.direction === 'en_to_vi' || card.direction === 'ja_to_vi' || card.direction === 'ja_to_reading';
  const isViToEn = card.direction === 'vi_to_en' || card.direction === 'vi_to_ja' || card.direction === 'reading_to_ja';

  useEffect(() => {
    setOptions([]);
    setSelected(null);
    setRevealed(false);
    setLoadingOptions(true);

    apiFetch<{ options: QuizOption[]; direction: string }>(
      `/api/study/quiz-options?studyDirectionId=${card.study_direction_id}&language=${language}`
    )
      .then((data) => setOptions(data.options))
      .catch(() => setOptions([]))
      .finally(() => setLoadingOptions(false));
  }, [card.study_direction_id, language]);

  const handleSelect = (option: QuizOption) => {
    if (revealed || answering) return;
    setSelected(option.id);
    setRevealed(true);

    // Auto-advance after 1.2s
    setTimeout(() => {
      const rating: Rating = option.isCorrect ? 'good' : 'again';
      onAnswer(rating);
    }, 1200);
  };

  const getOptionStyle = (option: QuizOption) => {
    if (!revealed) {
      return isEn
        ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/80 hover:border-indigo-500/60 text-white cursor-pointer active:scale-[0.98]'
        : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/80 hover:border-rose-500/60 text-white cursor-pointer active:scale-[0.98]';
    }
    if (option.isCorrect) {
      return 'border-emerald-500 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-500/50 cursor-default';
    }
    if (option.id === selected && !option.isCorrect) {
      return 'border-rose-500 bg-rose-500/20 text-rose-200 ring-2 ring-rose-500/50 cursor-default';
    }
    return 'border-slate-700/50 bg-slate-800/30 text-slate-500 cursor-default opacity-50';
  };

  // Question text: what to show as the prompt
  const questionText = isViToEn ? card.meaning_vi : card.word;
  const questionSub = isViToEn
    ? null
    : isEn && card.pronunciation
    ? card.pronunciation
    : language === 'ja' && card.reading
    ? `【${card.reading}】`
    : null;

  // Option label: what to show in each choice button
  const getOptionLabel = (option: QuizOption) => {
    if (isViToEn) {
      // vi_to_en: show English word
      return { main: option.word, sub: option.pronunciation };
    } else if (card.direction === 'ja_to_reading') {
      // ja_to_reading: show reading (hiragana)
      return { main: option.reading || option.word, sub: null };
    } else {
      // en_to_vi / ja_to_vi: show Vietnamese meaning
      return { main: option.meaning_vi, sub: null };
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      {/* Question Card */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-2xl flex flex-col items-center justify-center min-h-[200px] text-center gap-3 ${
          isEn
            ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-800/40'
            : 'bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-800/40'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/50">
            {card.direction === 'en_to_vi'
              ? 'English ➔ Chọn nghĩa đúng'
              : card.direction === 'vi_to_en'
              ? 'Nghĩa ➔ Chọn từ đúng'
              : card.direction === 'ja_to_vi'
              ? 'Kanji ➔ Chọn nghĩa đúng'
              : card.direction === 'ja_to_reading'
              ? 'Kanji ➔ Chọn cách đọc đúng'
              : 'Trắc nghiệm'}
          </span>
          {card.card_status === 'new' ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
              Từ mới
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-700/60">
              Ôn tập
            </span>
          )}
        </div>

        <div className={`font-black text-white tracking-tight ${language === 'ja' ? 'kanji-text text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'}`}>
          {questionText}
        </div>

        {questionSub && (
          <div className={`font-mono text-sm ${isEn ? 'text-indigo-400' : 'text-rose-400'}`}>
            {questionSub}
          </div>
        )}

        {!isViToEn && (
          <TTSButton
            text={language === 'ja' && card.reading ? card.reading : card.word}
            language={language}
            className="text-slate-400 hover:text-white"
            size={20}
          />
        )}
      </div>

      {/* Options Grid */}
      {loadingOptions ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-slate-400" size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option, idx) => {
            const label = getOptionLabel(option);
            const style = getOptionStyle(option);
            const isSelectedOption = selected === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={revealed || answering}
                className={`relative rounded-2xl border p-4 text-left transition-all duration-200 shadow-md ${style}`}
              >
                {/* Option number badge */}
                <span className={`inline-block w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center mb-2 ${
                  isEn ? 'bg-indigo-900/60 text-indigo-300' : 'bg-rose-900/60 text-rose-300'
                }`}>
                  {idx + 1}
                </span>

                <div className={`font-bold text-base leading-snug ${language === 'ja' && card.direction !== 'vi_to_ja' ? 'kanji-text' : ''}`}>
                  {label.main}
                </div>
                {label.sub && (
                  <div className="text-xs font-mono mt-0.5 opacity-70">{label.sub}</div>
                )}

                {/* Result icon */}
                {revealed && option.isCorrect && (
                  <CheckCircle2 className="absolute top-3 right-3 text-emerald-400" size={18} />
                )}
                {revealed && isSelectedOption && !option.isCorrect && (
                  <XCircle className="absolute top-3 right-3 text-rose-400" size={18} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Hint text */}
      {!revealed && !loadingOptions && (
        <p className="text-center text-xs text-slate-500">Chọn đáp án đúng — trả lời đúng tính là Good, sai là Again</p>
      )}
    </div>
  );
};

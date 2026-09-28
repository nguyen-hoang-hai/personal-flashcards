import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Vocabulary, Deck, Language } from '../../shared/types';
import { TTSButton } from '../../shared/components/TTSButton';
import { Plus, Search, Trash2, Loader2, BookOpen, Volume2, UploadCloud, HelpCircle, Lock } from 'lucide-react';

const formatDirection = (dir: string) => {
  switch (dir) {
    case 'en_to_vi':
      return 'Anh → Việt';
    case 'vi_to_en':
      return 'Việt → Anh';
    case 'ja_to_vi':
      return 'Nhật → Việt';
    case 'vi_to_ja':
      return 'Việt → Nhật';
    case 'ja_to_reading':
      return 'Kanji → Hiragana';
    case 'reading_to_ja':
      return 'Hiragana → Kanji';
    default:
      return dir;
  }
};

export const VocabularyPage: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const language = (lang || 'en') as Language;

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Single Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formDeckId, setFormDeckId] = useState('');
  const [formWord, setFormWord] = useState('');
  const [formReading, setFormReading] = useState('');
  const [formPronunciation, setFormPronunciation] = useState('');
  const [formMeaningVi, setFormMeaningVi] = useState('');
  const [formDefinitionEn, setFormDefinitionEn] = useState('');
  const [formExample, setFormExample] = useState('');
  const [formExampleTranslation, setFormExampleTranslation] = useState('');
  const [formLevel, setFormLevel] = useState('');

  // Bulk Import State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkDeckId, setBulkDeckId] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const isEn = language === 'en';
  const themeColor = isEn ? 'indigo' : 'rose';

  const loadData = async () => {
    try {
      setLoading(true);
      const [vocabData, decksData] = await Promise.all([
        apiFetch(
          `/api/vocabulary?language=${language}${selectedDeckId ? `&deckId=${selectedDeckId}` : ''}${
            search ? `&search=${encodeURIComponent(search)}` : ''
          }`
        ),
        apiFetch(`/api/decks?language=${language}`),
      ]);
      setVocabulary(vocabData.vocabulary || []);
      setDecks(decksData.decks || []);
      if (!formDeckId && decksData.decks && decksData.decks.length > 0) {
        setFormDeckId(decksData.decks[0].id);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tải từ vựng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [language, selectedDeckId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenAdd = () => {
    setFormWord('');
    setFormReading('');
    setFormPronunciation('');
    setFormMeaningVi('');
    setFormDefinitionEn('');
    setFormExample('');
    setFormExampleTranslation('');
    setFormLevel('');
    if (!formDeckId && decks.length > 0) setFormDeckId(decks[0].id);
    setShowModal(true);
  };

  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWord.trim() || !formMeaningVi.trim() || !formDeckId) {
      alert('Vui lòng điền các trường bắt buộc (Bộ thẻ, Từ vựng, Nghĩa tiếng Việt).');
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch('/api/vocabulary', {
        method: 'POST',
        body: JSON.stringify({
          deck_id: formDeckId,
          language,
          word: formWord,
          reading: formReading || undefined,
          pronunciation: formPronunciation || undefined,
          meaning_vi: formMeaningVi,
          definition_en: formDefinitionEn || undefined,
          example: formExample || undefined,
          example_translation: formExampleTranslation || undefined,
          level: formLevel || undefined,
        }),
      });

      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thêm từ vựng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWord = async (v: Vocabulary) => {
    if (!window.confirm(`Bạn có chắc muốn xóa từ "${v.word}"?`)) return;

    try {
      await apiFetch(`/api/vocabulary/${v.id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa từ vựng');
    }
  };

  const parseBulkLines = (text: string) => {
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('#'));
    return lines.map((line) => {
      let parts: string[] = [];
      if (line.includes('|')) {
        parts = line.split('|').map((p) => p.trim());
      } else if (line.includes('\t')) {
        parts = line.split('\t').map((p) => p.trim());
      } else {
        parts = line.split(',').map((p) => p.trim());
      }

      if (isEn) {
        return {
          word: parts[0] || '',
          meaning_vi: parts[1] || '',
          pronunciation: parts[2] || undefined,
          example: parts[3] || undefined,
          example_translation: parts[4] || undefined,
        };
      } else {
        return {
          word: parts[0] || '',
          reading: parts[1] || undefined,
          meaning_vi: parts[2] || '',
          example: parts[3] || undefined,
          example_translation: parts[4] || undefined,
        };
      }
    }).filter((item) => item.word && item.meaning_vi);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetDeckId = bulkDeckId || (decks.length > 0 ? decks[0].id : '');
    if (!targetDeckId) {
      alert('Vui lòng chọn bộ thẻ (deck) đích');
      return;
    }

    const items = parseBulkLines(bulkText);
    if (items.length === 0) {
      alert('Không tìm thấy từ vựng hợp lệ nào. Vui lòng kiểm tra định dạng.');
      return;
    }

    try {
      setBulkSubmitting(true);
      const res = await apiFetch('/api/vocabulary/bulk', {
        method: 'POST',
        body: JSON.stringify({
          deck_id: targetDeckId,
          language,
          items,
        }),
      });

      alert(`Đã import thành công ${res.count || items.length} từ vựng!`);
      setShowBulkModal(false);
      setBulkText('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi import hàng loạt');
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kho từ vựng ({isEn ? 'English' : '日本語'})
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {vocabulary.length} từ
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Tra cứu, thêm mới và quản lý chi tiết danh sách từ vựng & thẻ học.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (decks.length > 0 && !bulkDeckId) setBulkDeckId(decks[0].id);
              setShowBulkModal(true);
            }}
            disabled={decks.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            title="Import hàng loạt từ file hoặc danh sách văn bản"
          >
            <UploadCloud size={18} />
            <span>Import danh sách</span>
          </button>
          <button
            onClick={handleOpenAdd}
            disabled={decks.length === 0}
            className={`px-4 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 ${
              isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <Plus size={18} />
            <span>Thêm từ mới</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Tìm kiếm theo ${isEn ? 'từ, nghĩa...' : 'Kanji, cách đọc, nghĩa...'}`}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả các bộ thẻ</option>
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className={`animate-spin text-${themeColor}-600`} size={36} />
        </div>
      ) : vocabulary.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Chưa tìm thấy từ vựng nào</h3>
          <p className="text-slate-500 text-xs mb-4">
            Hãy bắt đầu thêm từ mới vào bộ thẻ của bạn.
          </p>
          <button
            onClick={handleOpenAdd}
            disabled={decks.length === 0}
            className={`px-4 py-2 rounded-xl text-white text-xs font-bold ${
              isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            Thêm từ mới
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4 w-[28%] min-w-[200px] whitespace-nowrap">Từ vựng</th>
                  <th className="px-6 py-4 w-[36%] min-w-[240px]">Nghĩa & Ví dụ</th>
                  <th className="px-6 py-4 w-[18%] min-w-[160px] whitespace-nowrap">Bộ thẻ</th>
                  <th className="px-6 py-4 w-[14%] min-w-[140px] whitespace-nowrap">Dạng thẻ</th>
                  <th className="px-4 py-4 w-[4%] min-w-[70px] text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vocabulary.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Word Column */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-slate-900 text-base leading-snug ${
                            language === 'ja' ? 'kanji-text' : ''
                          }`}
                        >
                          {v.word}
                        </span>
                        <TTSButton
                          text={language === 'ja' && v.reading ? v.reading : v.word}
                          language={language}
                          size={16}
                        />
                      </div>
                      {language === 'ja' && v.reading && (
                        <div className="text-xs text-rose-600 kanji-text font-medium mt-0.5">
                          【{v.reading}】
                        </div>
                      )}
                      {language === 'en' && v.pronunciation && (
                        <div className="text-xs text-indigo-600/80 font-mono mt-0.5">
                          {v.pronunciation}
                        </div>
                      )}
                    </td>

                    {/* Meaning Column */}
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-slate-900 text-sm leading-snug">
                        {v.meaning_vi}
                      </div>
                      {v.example && (
                        <div className="mt-1.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="italic text-slate-700 font-medium">
                            "{v.example}"
                          </div>
                          {v.example_translation && (
                            <div className="text-slate-400 not-italic text-[11px] mt-0.5">
                              {v.example_translation}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Deck Column */}
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
                        {v.deck_title}
                      </span>
                    </td>

                    {/* Directions Column */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1.5 items-start">
                        {(v.study_directions || []).map((d) => (
                          <span
                            key={d.id}
                            className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap border ${
                              d.activation_status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                                : d.activation_status === 'available'
                                ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                                : 'bg-slate-100 text-slate-400 border-slate-200/70'
                            }`}
                            title={d.activation_status === 'active' ? 'Đang học' : 'Chưa mở khóa'}
                          >
                            {d.activation_status === 'active' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                            {d.activation_status === 'locked' && (
                              <Lock size={11} className="text-slate-400" />
                            )}
                            <span>{formatDirection(d.direction)}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 align-top text-center">
                      <button
                        onClick={() => handleDeleteWord(v)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors inline-flex items-center justify-center"
                        title="Xóa từ vựng"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Word */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Thêm từ vựng mới ({isEn ? 'English' : '日本語'})
            </h3>
            <form onSubmit={handleSaveWord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bộ thẻ (Deck) *
                </label>
                <select
                  required
                  value={formDeckId}
                  onChange={(e) => setFormDeckId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isEn ? 'Từ vựng / Cụm từ (Word) *' : 'Từ vựng / Kanji (Word) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formWord}
                  onChange={(e) => setFormWord(e.target.value)}
                  placeholder={isEn ? 'e.g. circuit breaker' : 'e.g. 電気'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {isEn ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phiên âm IPA
                  </label>
                  <input
                    type="text"
                    value={formPronunciation}
                    onChange={(e) => setFormPronunciation(e.target.value)}
                    placeholder="e.g. /ˈsɜː.kɪt ˌbreɪ.kər/"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cách đọc (Furigana / Hiragana)
                  </label>
                  <input
                    type="text"
                    value={formReading}
                    onChange={(e) => setFormReading(e.target.value)}
                    placeholder="e.g. でんき"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  value={formMeaningVi}
                  onChange={(e) => setFormMeaningVi(e.target.value)}
                  placeholder="e.g. máy cắt điện, điện lực..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Câu ví dụ minh họa
                </label>
                <input
                  type="text"
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  placeholder="Ví dụ câu trong thực tế..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dịch nghĩa câu ví dụ
                </label>
                <input
                  type="text"
                  value={formExampleTranslation}
                  onChange={(e) => setFormExampleTranslation(e.target.value)}
                  placeholder="Bản dịch tiếng Việt của câu ví dụ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                    isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? 'Đang lưu...' : 'Thêm từ'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Bulk Import Modal */}
      {showBulkModal &&
        createPortal(
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-card-enter max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                    <UploadCloud size={22} className={isEn ? 'text-indigo-600' : 'text-rose-600'} />
                    <span>Import từ vựng hàng loạt ({isEn ? 'English' : '日本語'})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dán danh sách từ vựng theo định dạng phân cách bởi dấu gạch đứng (<code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">|</code>) hoặc dấu phẩy.
                  </p>
                </div>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBulkSubmit} className="space-y-4 flex-1 flex flex-col overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chọn Bộ thẻ (Deck) nhận từ vựng
                  </label>
                  <select
                    value={bulkDeckId}
                    onChange={(e) => setBulkDeckId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {decks.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format Hint */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-slate-700">Định dạng mẫu mỗi dòng:</div>
                  {isEn ? (
                    <code className="block font-mono text-[11px] text-indigo-700 bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                      sleep in | ngủ nướng | /sliːp ɪn/ | I like to sleep in on weekends | Tôi thích ngủ nướng cuối tuần
                    </code>
                  ) : (
                    <code className="block font-mono text-[11px] text-rose-700 bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                      朝ご飯 | あさごはん | bữa ăn sáng | 朝ご飯を食べます | Tôi ăn bữa sáng
                    </code>
                  )}
                  <div className="text-[11px] text-slate-400">
                    Cột 1: Từ vựng • Cột 2: {isEn ? 'Nghĩa tiếng Việt' : 'Cách đọc (Hiragana)'} • Cột 3: {isEn ? 'Phiên âm IPA' : 'Nghĩa tiếng Việt'} • Cột 4: Ví dụ • Cột 5: Dịch ví dụ
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Nội dung danh sách từ vựng
                    </label>
                    <span className="text-xs font-medium text-slate-500">
                      Phát hiện: <strong className="text-indigo-600">{parseBulkLines(bulkText).length}</strong> từ hợp lệ
                    </span>
                  </div>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    rows={8}
                    placeholder={
                      isEn
                        ? "make the bed | dọn giường | /meɪk ðə bed/ | Make your bed | Hãy dọn giường\nhit the books | học bài chăm chỉ | /hɪt ðə bʊks/ | Time to hit the books | Đến giờ học bài rồi"
                        : "勉強 | べんきょう | học tập | 日本語を勉強します | Tôi học tiếng Nhật\n家族 | かぞく | gia đình | 家族が好きです | Tôi yêu gia đình"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={bulkSubmitting || parseBulkLines(bulkText).length === 0}
                    className={`px-5 py-2 rounded-xl text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 ${
                      isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {bulkSubmitting
                      ? 'Đang import...'
                      : `Import ${parseBulkLines(bulkText).length} từ vựng`}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

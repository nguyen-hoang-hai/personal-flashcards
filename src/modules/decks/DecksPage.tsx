import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { Deck, Language } from '../../shared/types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Sparkles, BookOpen } from 'lucide-react';

export const DecksPage: React.FC = () => {
  const { lang } = useParams<{ lang: Language }>();
  const language = (lang || 'en') as Language;

  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEn = language === 'en';
  const themeColor = isEn ? 'indigo' : 'rose';

  const loadDecks = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/decks?language=${language}`);
      setDecks(res.decks || []);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tải danh sách decks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, [language]);

  const handleOpenCreate = () => {
    setEditingDeck(null);
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setTitle(deck.title);
    setDescription(deck.description || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      if (editingDeck) {
        await apiFetch(`/api/decks/${editingDeck.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, description }),
        });
      } else {
        await apiFetch('/api/decks', {
          method: 'POST',
          body: JSON.stringify({ language, title, description }),
        });
      }
      setShowModal(false);
      loadDecks();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu bộ thẻ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHide = async (deck: Deck) => {
    const nextStatus = deck.study_status === 'hidden' ? 'active' : 'hidden';
    try {
      await apiFetch(`/api/decks/${deck.id}/settings`, {
        method: 'PUT',
        body: JSON.stringify({ study_status: nextStatus }),
      });
      loadDecks();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (deck: Deck) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa bộ thẻ "${deck.title}"? Tất cả từ vựng và tiến độ học bên trong sẽ bị xóa.`
      )
    ) {
      return;
    }

    try {
      await apiFetch(`/api/decks/${deck.id}`, { method: 'DELETE' });
      loadDecks();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bộ thẻ');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý Bộ thẻ ({isEn ? 'English' : '日本語'})
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Phân loại từ vựng thành các deck theo chủ đề, cấp độ hoặc mục đích sử dụng.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className={`px-4 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 ${
            isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          <Plus size={18} />
          <span>Tạo Deck mới</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className={`animate-spin text-${themeColor}-600`} size={36} />
        </div>
      ) : decks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Chưa có bộ thẻ nào</h3>
          <p className="text-slate-500 text-xs mb-4">
            Hãy tạo bộ thẻ đầu tiên để bắt đầu thêm từ vựng.
          </p>
          <button
            onClick={handleOpenCreate}
            className={`px-4 py-2 rounded-xl text-white text-xs font-bold ${
              isEn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            Tạo Deck mới
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((deck) => {
            const isHidden = deck.study_status === 'hidden';
            return (
              <div
                key={deck.id}
                className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                  isHidden ? 'opacity-65 border-slate-200 bg-slate-50/80' : 'border-slate-200/90 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isHidden
                          ? 'bg-slate-200 text-slate-600'
                          : isEn
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isHidden ? 'Đã ẩn' : 'Đang học'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleHide(deck)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title={isHidden ? 'Hiện deck' : 'Ẩn deck'}
                      >
                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(deck)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(deck)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-1">{deck.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                    {deck.description || 'Không có mô tả'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Tổng {deck.total_words || 0} từ</span>
                  <span className="font-semibold text-slate-800">
                    <span className={isEn ? 'text-indigo-600' : 'text-rose-600'}>
                      {deck.due_count || 0} due
                    </span>{' '}
                    • {deck.new_count || 0} new
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create/Edit */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {editingDeck ? 'Chỉnh sửa bộ thẻ' : 'Tạo bộ thẻ mới'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên bộ thẻ *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Kỹ thuật điện, Giao tiếp hàng ngày..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ghi chú về nội dung của bộ thẻ này..."
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
                    {submitting ? 'Đang lưu...' : 'Lưu lại'}
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

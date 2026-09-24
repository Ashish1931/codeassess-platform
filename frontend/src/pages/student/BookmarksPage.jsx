import React, { useState, useEffect } from 'react';
import { questionService } from '../../services/api';
import { Bookmark, Trash2 } from 'lucide-react';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await questionService.getBookmarks();
      setBookmarks(res.data);
    } catch (err) {
      console.error('Failed to fetch bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      await questionService.toggleBookmark(id);
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <Bookmark className="text-indigo-400" /> Bookmarked Questions Repository
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review saved questions, difficult MCQs, and detailed solution notes</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <Bookmark size={36} className="text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Bookmarks Saved</h3>
          <p className="text-xs text-slate-500">You haven't bookmarked any MCQ questions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((q, idx) => (
            <div key={q.id} className="glass-card p-6 space-y-4 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Bookmark #{idx + 1} • {q.topic}
                </span>
                <button
                  onClick={() => handleRemoveBookmark(q.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove Bookmark"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-sm font-semibold text-slate-100">{q.questionText}</h3>

              {q.codeSnippet && (
                <pre className="code-block text-xs border-slate-800">{q.codeSnippet}</pre>
              )}

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-emerald-400 block">Correct Answer: Option ({q.correctAnswer})</span>
                <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;

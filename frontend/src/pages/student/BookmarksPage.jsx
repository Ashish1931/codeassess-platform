import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../../services/api';
import { Bookmark, Trash2, BookOpen, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingSample, setAddingSample] = useState(false);

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

  const handleAddSampleBookmark = async () => {
    try {
      setAddingSample(true);
      // Toggle bookmark for Question 1
      await questionService.toggleBookmark(1);
      await fetchBookmarks();
    } catch (err) {
      console.error('Failed to add sample bookmark', err);
    } finally {
      setAddingSample(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-sm font-semibold text-theme-muted">Loading your bookmarked questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="border-b border-theme pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-theme-primary flex items-center gap-3">
            <Bookmark className="text-indigo-500" size={32} /> Bookmarked Questions Repository
          </h1>
          <p className="text-sm font-medium text-theme-muted mt-1.5">
            Review your saved difficult MCQs, tricky problem code snippets, and in-depth explanations
          </p>
        </div>
        {bookmarks.length > 0 && (
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 self-start sm:self-auto">
            {bookmarks.length} {bookmarks.length === 1 ? 'Question' : 'Questions'} Saved
          </span>
        )}
      </div>

      {bookmarks.length === 0 ? (
        /* Empty State with Complete Guide on How to Bookmark */
        <div className="space-y-6">
          <div className="glass-card p-8 sm:p-12 text-center space-y-4 border-dashed border-2 border-indigo-500/30">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <Bookmark size={36} />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-theme-primary">No Bookmarks Saved Yet</h2>
            <p className="text-sm sm:text-base text-theme-muted max-w-lg mx-auto font-medium">
              You haven't bookmarked any MCQ questions yet. Follow the steps below to save questions for revision.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleAddSampleBookmark}
                disabled={addingSample}
                className="btn btn-primary text-sm py-2.5 px-5 font-bold shadow-md shadow-indigo-500/20"
              >
                <Sparkles size={16} /> {addingSample ? 'Saving Sample...' : 'Bookmark Sample Question Now'}
              </button>
              <Link to="/student/subjects" className="btn btn-secondary text-sm py-2.5 px-5 font-bold">
                <BookOpen size={16} /> Explore Subjects & Tests
              </Link>
            </div>
          </div>

          {/* Interactive Guide: How Bookmarking Works */}
          <div className="glass-card p-6 sm:p-8 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-theme-primary flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" /> How to Bookmark Questions in CodeAssess Pro:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-5 rounded-2xl bg-theme-input border border-theme space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white font-black text-sm flex items-center justify-center">1</div>
                <h4 className="font-bold text-sm text-theme-primary">Take Any Test or Exam</h4>
                <p className="text-xs sm:text-sm text-theme-muted font-medium">
                  Go to <Link to="/student/subjects" className="text-indigo-500 underline font-bold">Subjects</Link> and launch any topic test or mock examination.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-theme-input border border-theme space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500 text-white font-black text-sm flex items-center justify-center">2</div>
                <h4 className="font-bold text-sm text-theme-primary">Click the 🔖 Bookmark Icon</h4>
                <p className="text-xs sm:text-sm text-theme-muted font-medium">
                  Click the <strong>Bookmark</strong> button on tricky questions in the Exam Room or on the <strong>Exam Solutions Review</strong> screen.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-theme-input border border-theme space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center">3</div>
                <h4 className="font-bold text-sm text-theme-primary">Revise Anytime Here</h4>
                <p className="text-xs sm:text-sm text-theme-muted font-medium">
                  Saved questions appear in this repository with their correct options, detailed solutions, and code notes.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Populated Bookmarks List */
        <div className="space-y-5">
          {bookmarks.map((q, idx) => (
            <div key={q.id} className="glass-card p-6 sm:p-8 space-y-4 border-l-4 border-l-indigo-500 shadow-md">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                  Bookmark #{idx + 1} • {q.topic}
                </span>
                <button
                  onClick={() => handleRemoveBookmark(q.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
                  title="Remove from Bookmarks"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-theme-primary leading-relaxed">
                {q.questionText}
              </h2>

              {q.codeSnippet && (
                <pre className="code-block text-xs sm:text-sm">{q.codeSnippet}</pre>
              )}

              {/* Options Preview */}
              {q.options?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs sm:text-sm ${
                        opt.optionLabel === q.correctAnswer
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'bg-theme-input border-theme text-theme-secondary font-medium'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-md bg-theme-secondary text-center leading-6 font-bold text-xs shrink-0 border border-theme">
                        {opt.optionLabel}
                      </span>
                      <span>{opt.optionText}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm space-y-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 size={18} /> Correct Option: ({q.correctAnswer})
                </span>
                <p className="text-theme-secondary leading-relaxed font-medium">
                  <span className="font-bold block mb-0.5">Solution & Explanation:</span>
                  {q.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;

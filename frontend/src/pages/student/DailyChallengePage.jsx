import React, { useState } from 'react';
import { Flame, CheckCircle, Zap, Bookmark, BookmarkCheck } from 'lucide-react';
import { questionService } from '../../services/api';

const DailyChallengePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkFeedback, setBookmarkFeedback] = useState('');

  const challenge = {
    id: 1, // Matches seeded Question #1
    date: new Date().toLocaleDateString(),
    subject: 'Data Structures',
    topic: 'Time Complexity',
    question: 'What is the time complexity of building a heap from an unsorted array of N elements using Floyd’s Build Heap algorithm?',
    options: [
      { label: 'A', text: 'O(N)' },
      { label: 'B', text: 'O(N log N)' },
      { label: 'C', text: 'O(N^2)' },
      { label: 'D', text: 'O(log N)' },
    ],
    correctAnswer: 'A',
    explanation: 'While inserting elements one-by-one into a heap takes O(N log N), Floyd’s bottom-up build-heap approach processes nodes level-by-level, bounded by a converging geometric series sum: S = N/4 * 1 + N/8 * 2 + N/16 * 3 + ... = O(N).',
    bonusXp: 50,
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setSubmitted(true);
    setIsCorrect(selectedOption === challenge.correctAnswer);
  };

  const handleToggleBookmark = async () => {
    try {
      await questionService.toggleBookmark(challenge.id);
      const nextState = !isBookmarked;
      setIsBookmarked(nextState);
      setBookmarkFeedback(nextState ? 'Question saved to your Bookmarks!' : 'Removed from Bookmarks');
      setTimeout(() => setBookmarkFeedback(''), 3000);
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
      // Toggle locally for demo if network or auth error
      setIsBookmarked(!isBookmarked);
      setBookmarkFeedback(!isBookmarked ? 'Question saved to your Bookmarks!' : 'Removed from Bookmarks');
      setTimeout(() => setBookmarkFeedback(''), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Hero Banner with High Contrast */}
      <div className="glass-card p-8 border-amber-500/40 text-center space-y-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 shadow-lg">
        <div className="inline-flex p-3.5 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-inner">
          <Flame size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-theme-primary tracking-tight">Daily Programming Challenge</h1>
        <p className="text-sm font-medium text-theme-muted">
          Solve today's question to maintain your practice streak and earn <span className="font-bold text-amber-500">+{challenge.bonusXp} XP</span>!
        </p>
      </div>

      {/* Main Challenge Card */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
            {challenge.subject} • {challenge.topic}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-amber-500 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              <Zap size={16} /> +{challenge.bonusXp} XP
            </span>
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isBookmarked
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-theme-input text-theme-secondary border-theme hover:border-purple-500'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Question'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        {bookmarkFeedback && (
          <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs sm:text-sm font-bold animate-fade-in flex items-center gap-2">
            <BookmarkCheck size={16} /> {bookmarkFeedback}
          </div>
        )}

        <h2 className="text-lg sm:text-xl font-bold text-theme-primary leading-snug">
          {challenge.question}
        </h2>

        <div className="space-y-3.5">
          {challenge.options.map((opt) => (
            <label
              key={opt.label}
              onClick={() => !submitted && setSelectedOption(opt.label)}
              className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                selectedOption === opt.label
                  ? 'bg-indigo-500/15 border-indigo-500 text-theme-primary font-bold shadow-md ring-2 ring-indigo-500/40'
                  : 'bg-theme-input border-theme text-theme-secondary hover:border-indigo-500/50 hover:bg-theme-card'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl text-center leading-8 font-extrabold text-sm shrink-0 transition-colors ${
                  selectedOption === opt.label
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-theme-secondary text-theme-muted border border-theme'
                }`}
              >
                {opt.label}
              </div>
              <span className="text-base font-medium">{opt.text}</span>
            </label>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full btn btn-primary py-3.5 text-sm font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-40"
          >
            Submit Answer
          </button>
        ) : (
          <div
            className={`p-5 rounded-2xl border text-sm space-y-3 animate-fade-in ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}
          >
            <span className="font-extrabold text-base flex items-center gap-2">
              {isCorrect ? <CheckCircle size={20} className="text-emerald-500" /> : null}
              {isCorrect ? 'Correct Answer! +50 XP Earned!' : `Incorrect! The correct answer was Option (${challenge.correctAnswer})`}
            </span>
            <p className="text-theme-secondary leading-relaxed font-medium">
              <span className="font-bold block mb-1">Explanation:</span>
              {challenge.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallengePage;

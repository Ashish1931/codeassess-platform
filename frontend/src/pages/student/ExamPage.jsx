import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { questionService } from '../../services/api';
import Timer from '../../components/Timer';
import QuestionPalette from '../../components/QuestionPalette';
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Flag, AlertOctagon, Send, Code, Crown } from 'lucide-react';

const ExamPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeExam, currentIndex, setCurrentIndex, answers, secondsRemaining,
    isSubmitting, startExam, selectAnswer, toggleMarkForReview, submitExam,
  } = useExam();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLimitError, setIsLimitError] = useState(false);
  const [savedBookmarks, setSavedBookmarks] = useState({});

  useEffect(() => {
    initExam();
  }, [testId]);

  const initExam = async () => {
    try {
      setLoading(true);
      await startExam(testId);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to start exam.';
      setError(message);
      if (message.toLowerCase().includes('monthly test attempt limit') || message.toLowerCase().includes('subscription')) {
        setIsLimitError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your assessment? You cannot change your answers after submission.')) {
      try {
        const result = await submitExam();
        navigate(`/student/result/${result.attemptId}`);
      } catch (err) {
        alert('Failed to submit exam: ' + (err.response?.data?.message || 'Network error'));
      }
    }
  };

  const handleToggleBookmark = async (questionId) => {
    try {
      await questionService.toggleBookmark(questionId);
      setSavedBookmarks((prev) => ({
        ...prev,
        [questionId]: !prev[questionId],
      }));
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
      setSavedBookmarks((prev) => ({
        ...prev,
        [questionId]: !prev[questionId],
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-4">
        <div className="glass-card p-8 rounded-2xl max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
          <h2 className="text-lg font-bold text-theme-primary">Securing Exam Room...</h2>
          <p className="text-xs text-theme-muted">Configuring test timers, shuffling question paper, and establishing anti-cheat monitor.</p>
        </div>
      </div>
    );
  }

  if (error || !activeExam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-4">
        <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center space-y-4 border border-rose-500/30">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <AlertOctagon size={32} />
          </div>
          <h2 className="text-xl font-bold text-theme-primary">Unable to Start Assessment</h2>
          <p className="text-sm text-theme-muted">{error || 'Exam session could not be established.'}</p>
          {isLimitError ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/student/subscription" className="btn btn-primary text-xs py-2.5 font-bold shadow-md shadow-indigo-500/30">
                <Crown size={15} /> Upgrade to Pro / Unlimited Plan
              </Link>
              <Link to="/student/dashboard" className="btn btn-secondary text-xs py-2 font-bold">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <Link to="/student/subjects" className="btn btn-primary text-xs py-2 font-bold inline-block">
              Return to Subjects
            </Link>
          )}
        </div>
      </div>
    );
  }

  const currentQ = activeExam.questions[currentIndex];
  const currentAnswerState = answers[currentQ.id] || {};
  const isLastQuestion = currentIndex === activeExam.questions.length - 1;
  const isQuestionBookmarked = savedBookmarks[currentQ.id];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] select-none">
      {/* Header */}
      <header className="glass-nav h-16 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex flex-col">
          <span className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider">{activeExam.subjectName}</span>
          <span className="text-base sm:text-lg font-extrabold text-theme-primary">{activeExam.testTitle}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-bold text-theme-primary">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs font-semibold text-theme-muted">Candidate ID: #{user?.id}</span>
          </div>
          <Timer secondsRemaining={secondsRemaining} />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 w-full p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3 glass-card p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-xl bg-indigo-500/15 text-indigo-500 text-xs font-black border border-indigo-500/30">
                  Q {currentIndex + 1} / {activeExam.questions.length}
                </span>
                <span className="text-xs sm:text-sm text-theme-muted font-bold">Topic: {currentQ.topic}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleBookmark(currentQ.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isQuestionBookmarked
                      ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                      : 'bg-theme-input text-theme-secondary border-theme hover:border-purple-500'
                  }`}
                  title={isQuestionBookmarked ? 'Remove Bookmark' : 'Bookmark Question to Revision Repository'}
                >
                  {isQuestionBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  <span className="hidden sm:inline">{isQuestionBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
                <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                  {currentQ.marks} Marks
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-theme-primary leading-relaxed">{currentQ.questionText}</h2>
              {currentQ.codeSnippet && (
                <div className="relative">
                  <div className="absolute top-2 right-3 text-[11px] text-theme-muted font-mono flex items-center gap-1">
                    <Code size={13} /> Code Snippet
                  </div>
                  <pre className="code-block text-xs sm:text-sm">{currentQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3.5 pt-2">
              {currentQ.options?.map((opt) => {
                const isSelected = currentAnswerState.selectedAnswer === opt.optionLabel;
                return (
                  <label
                    key={opt.id}
                    onClick={() => selectAnswer(currentQ.id, opt.optionLabel)}
                    className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500 text-theme-primary font-bold shadow-md ring-2 ring-indigo-500/40'
                        : 'bg-theme-input border-theme text-theme-secondary hover:border-indigo-500/50 hover:bg-theme-card'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-theme-secondary text-theme-muted border border-theme'
                    }`}>
                      {opt.optionLabel}
                    </div>
                    <span className="text-sm sm:text-base font-medium">{opt.optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
            <div className="flex items-center gap-2.5">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="btn btn-secondary text-xs sm:text-sm py-2 px-4 disabled:opacity-40 font-bold"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => toggleMarkForReview(currentQ.id)}
                className={`btn text-xs sm:text-sm py-2 px-4 border font-bold ${
                  currentAnswerState.isMarkedForReview
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'btn-outline border-amber-500/50 text-amber-500'
                }`}
                title="Mark this question on the palette to revisit before submitting"
              >
                <Flag size={15} />
                {currentAnswerState.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <button onClick={() => setCurrentIndex(currentIndex + 1)} className="btn btn-primary text-xs sm:text-sm py-2 px-5 font-bold">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleFinalSubmit} disabled={isSubmitting} className="btn btn-primary bg-emerald-600 hover:bg-emerald-500 text-xs sm:text-sm py-2 px-6 font-bold shadow-md">
                  <Send size={16} /> Submit Test
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Palette */}
        <div className="lg:col-span-1 space-y-4">
          <QuestionPalette
            questions={activeExam.questions}
            answers={answers}
            currentIndex={currentIndex}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="w-full btn btn-primary bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 text-sm font-extrabold shadow-lg shadow-emerald-500/20"
          >
            <Send size={16} /> Submit Exam & Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;

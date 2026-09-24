import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import Timer from '../../components/Timer';
import QuestionPalette from '../../components/QuestionPalette';
import { ChevronLeft, ChevronRight, Bookmark, AlertOctagon, Send, Code, Crown } from 'lucide-react';

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

  useEffect(() => {
    initExam();
  }, [testId]);

  const initExam = async () => {
    try {
      setLoading(true);
      await startExam(testId);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to initialize exam environment.';
      setError(msg);
      setIsLimitError(msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('subscription'));
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your exam now?')) {
      const result = await submitExam();
      if (result) navigate(`/student/result/${result.attemptId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-base font-semibold text-theme-secondary">Initializing Secure Exam Environment...</p>
        </div>
      </div>
    );
  }

  if (error || !activeExam?.questions) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]">
        <div className="glass-card p-8 text-center max-w-md space-y-4">
          <AlertOctagon size={44} className="text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-theme-primary">Unable to Start Exam</h2>
          <p className="text-sm text-theme-secondary font-semibold">{error || 'Invalid exam session.'}</p>
          {isLimitError ? (
            <div className="space-y-3">
              <p className="text-xs text-amber-500 font-bold bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                You've reached your monthly test attempt limit for the <strong>{user?.subscription?.planName || 'Free'}</strong> plan.
              </p>
              <Link to="/student/subscription" className="btn btn-primary w-full text-sm">
                <Crown size={16} /> Upgrade Plan
              </Link>
              <button onClick={() => navigate('/student/subjects')} className="btn btn-secondary w-full text-sm">
                Back to Subjects
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/student/subjects')} className="btn btn-primary text-sm w-full">
              Return to Subjects
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQ = activeExam.questions[currentIndex];
  const currentAnswerState = answers[currentQ.id] || {};
  const isLastQuestion = currentIndex === activeExam.questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] select-none">
      {/* Header */}
      <header className="glass-nav h-16 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{activeExam.subjectName}</span>
          <span className="text-base sm:text-lg font-extrabold text-theme-primary">{activeExam.testTitle}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-theme-primary">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-theme-muted">Candidate ID: #{user?.id}</span>
          </div>
          <Timer secondsRemaining={secondsRemaining} />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 w-full p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3 glass-card p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-indigo-500/15 text-indigo-500 text-xs font-bold border border-indigo-500/30">
                  Q {currentIndex + 1} / {activeExam.questions.length}
                </span>
                <span className="text-xs text-theme-muted font-semibold">Topic: {currentQ.topic}</span>
              </div>
              <span className="text-xs font-bold text-emerald-500">{currentQ.marks} Marks</span>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-theme-primary leading-relaxed">{currentQ.questionText}</h3>
              {currentQ.codeSnippet && (
                <div className="relative">
                  <div className="absolute top-2 right-3 text-[10px] text-theme-muted font-mono flex items-center gap-1">
                    <Code size={12} /> Code Snippet
                  </div>
                  <pre className="code-block">{currentQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((opt) => {
                const isSelected = currentAnswerState.selectedAnswer === opt.optionLabel;
                return (
                  <label
                    key={opt.id}
                    onClick={() => selectAnswer(currentQ.id, opt.optionLabel)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500 text-theme-primary shadow-md ring-1 ring-indigo-500'
                        : 'bg-theme-input border-theme text-theme-secondary hover:border-indigo-500/50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-theme-secondary text-theme-muted'
                    }`}>
                      {opt.optionLabel}
                    </div>
                    <span className="text-sm font-medium">{opt.optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-theme pt-4">
            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="btn btn-secondary text-xs py-2 px-3.5 disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => toggleMarkForReview(currentQ.id)}
                className={`btn text-xs py-2 px-3.5 border ${
                  currentAnswerState.isMarkedForReview
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'btn-outline border-purple-500/50 text-purple-500'
                }`}
              >
                <Bookmark size={15} />
                {currentAnswerState.isMarkedForReview ? 'Marked' : 'Mark for Review'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <button onClick={() => setCurrentIndex(currentIndex + 1)} className="btn btn-primary text-xs py-2 px-4">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleFinalSubmit} disabled={isSubmitting} className="btn btn-success text-xs py-2 px-5 font-bold">
                  <Send size={15} /> Submit Test
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
            className="w-full btn btn-success py-3 text-xs font-bold"
          >
            <Send size={16} /> Submit Exam & Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;

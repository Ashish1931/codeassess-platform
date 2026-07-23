import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import Timer from '../../components/Timer';
import QuestionPalette from '../../components/QuestionPalette';
import { 
  ChevronLeft, ChevronRight, Bookmark, AlertOctagon, Send, Code, HelpCircle 
} from 'lucide-react';

const ExamPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    activeExam, currentIndex, setCurrentIndex, answers, secondsRemaining, 
    isSubmitting, startExam, selectAnswer, toggleMarkForReview, submitExam 
  } = useExam();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    initExam();
  }, [testId]);

  const initExam = async () => {
    try {
      setLoading(true);
      await startExam(testId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize exam environment.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your exam now?')) {
      const result = await submitExam();
      if (result) {
        navigate(`/student/result/${result.attemptId}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-base font-semibold">Initializing Secure Exam Environment...</p>
        </div>
      </div>
    );
  }

  if (error || !activeExam || !activeExam.questions) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="glass-card p-8 text-center max-w-md space-y-4">
          <AlertOctagon size={44} className="text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-100">Unable to Start Exam</h2>
          <p className="text-sm text-slate-400">{error || 'Invalid exam session.'}</p>
          <button onClick={() => navigate('/student/subjects')} className="btn btn-primary text-sm w-full">
            Return to Subjects
          </button>
        </div>
      </div>
    );
  }

  const currentQ = activeExam.questions[currentIndex];
  const currentAnswerState = answers[currentQ.id] || {};
  const isLastQuestion = currentIndex === activeExam.questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Top Header Bar */}
      <header className="glass-nav h-16 px-6 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{activeExam.subjectName}</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-100">{activeExam.testTitle}</span>
          </div>
        </div>

        {/* Student Name & Live Timer */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-200">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-slate-400">Candidate ID: #{user?.id}</span>
          </div>
          <Timer secondsRemaining={secondsRemaining} />
        </div>
      </header>

      {/* Main Exam Body - Full Screen Width */}
      <div className="flex-1 w-full p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Question Panel */}
        <div className="lg:col-span-3 glass-card p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  Question {currentIndex + 1} of {activeExam.questions.length}
                </span>
                <span className="text-xs text-slate-400">Topic: {currentQ.topic}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">{currentQ.marks} Marks</span>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-100 leading-relaxed">
                {currentQ.questionText}
              </h3>

              {/* Code Snippet Block */}
              {currentQ.codeSnippet && (
                <div className="relative">
                  <div className="absolute top-2 right-3 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Code size={12} /> Code Snippet
                  </div>
                  <pre className="code-block border-slate-800">{currentQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options?.map((opt) => {
                const isSelected = currentAnswerState.selectedAnswer === opt.optionLabel;
                return (
                  <label
                    key={opt.id}
                    onClick={() => selectAnswer(currentQ.id, opt.optionLabel)}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow-md ring-1 ring-indigo-500' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'}
                    `}
                  >
                    <div className={`
                      w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors
                      ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}
                    `}>
                      {opt.optionLabel}
                    </div>
                    <span className="text-sm font-medium">{opt.optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bottom Nav Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
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
                    : 'btn-outline border-purple-500/50 text-purple-400'
                }`}
              >
                <Bookmark size={15} /> 
                {currentAnswerState.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="btn btn-primary text-xs py-2 px-4"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="btn btn-success text-xs py-2 px-5 font-bold shadow-lg shadow-emerald-500/20"
                >
                  <Send size={15} /> Submit Test Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Question Palette */}
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
            className="w-full btn btn-success py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Send size={16} /> Submit Exam & Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;

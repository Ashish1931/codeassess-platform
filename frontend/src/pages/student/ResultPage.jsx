import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { examService, questionService } from '../../services/api';
import { CheckCircle2, XCircle, Trophy, Download, BarChart2, AlertCircle, Bookmark, BookmarkCheck } from 'lucide-react';

const ResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [bookmarkedMap, setBookmarkedMap] = useState({});

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await examService.getResultByAttemptId(attemptId);
      setResult(res.data);
    } catch (err) {
      console.error('Failed to fetch result', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (questionId) => {
    try {
      await questionService.toggleBookmark(questionId);
      setBookmarkedMap((prev) => ({
        ...prev,
        [questionId]: !prev[questionId],
      }));
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
      // Fallback for visual responsiveness
      setBookmarkedMap((prev) => ({
        ...prev,
        [questionId]: !prev[questionId],
      }));
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-8 text-center">
        <AlertCircle size={40} className="text-theme-muted mx-auto mb-3" />
        <p className="text-theme-muted font-semibold">Result not found for this attempt.</p>
        <Link to="/student/subjects" className="btn btn-primary mt-4 text-sm font-bold">Back to Subjects</Link>
      </div>
    );
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const metrics = [
    { label: 'Total Score', value: `${result.score} / ${result.maxScore}`, color: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'Percentage', value: `${result.percentage}%`, color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
    { label: 'Correct', value: result.correctAnswersCount, color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Wrong', value: result.wrongAnswersCount, color: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30' },
    { label: 'Time Taken', value: formatTime(result.timeTakenSeconds), color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Result Banner */}
      <div className={`glass-card p-8 text-center border-2 shadow-lg ${result.isPassed ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-rose-500/50 bg-rose-500/5'}`}>
        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-theme-input shadow-xl mb-1 border border-theme">
            {result.isPassed
              ? <Trophy size={48} className="text-amber-500 animate-bounce" />
              : <XCircle size={48} className="text-rose-500" />
            }
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
            {result.isPassed ? 'Congratulations! You Passed!' : 'Assessment Complete'}
          </h1>
          <p className="text-sm font-semibold text-theme-muted">
            {result.testTitle} ({result.subjectName}) • {new Date(result.completedAt).toLocaleDateString()}
          </p>
          <span className={`inline-block px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase border shadow-sm ${
            result.isPassed
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40'
          }`}>
            {result.isPassed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className={`glass-card p-5 text-center border shadow-sm ${m.border}`}>
            <span className="text-xs font-bold text-theme-muted block mb-1 uppercase tracking-wider">{m.label}</span>
            <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-theme pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-secondary hover:text-theme-primary bg-theme-input border border-theme'
          }`}
        >
          Topic Performance Breakdown
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'review' ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-secondary hover:text-theme-primary bg-theme-input border border-theme'
          }`}
        >
          Solutions & Explanations ({result.questionReviews?.length || 0})
        </button>
        <Link to="/student/reports" className="ml-auto btn btn-secondary text-xs sm:text-sm py-2 px-4 font-bold">
          <Download size={16} /> Download PDF Report
        </Link>
      </div>

      {/* Tab: Topic Summary */}
      {activeTab === 'summary' && (
        <div className="glass-card p-6 sm:p-8 space-y-5 shadow-md">
          <h2 className="text-base sm:text-lg font-bold text-theme-primary border-b border-theme pb-3 flex items-center gap-2">
            <BarChart2 size={20} className="text-indigo-500" /> Topic-Wise Accuracy Analysis
          </h2>
          <div className="space-y-4">
            {result.topicBreakdown?.length > 0 ? result.topicBreakdown.map((top, idx) => (
              <div key={idx} className="space-y-2 bg-theme-input p-5 rounded-2xl border border-theme">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-theme-primary">{top.topic}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{top.accuracyPercentage}% ({top.correctCount}/{top.totalQuestions})</span>
                </div>
                <div className="w-full h-3 rounded-full bg-theme-secondary overflow-hidden border border-theme">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${top.accuracyPercentage}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-theme-muted font-semibold text-center py-4">No topic breakdown available.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab: Question Reviews with Bookmark Option */}
      {activeTab === 'review' && (
        <div className="space-y-5">
          {result.questionReviews?.map((q, idx) => {
            const isBookmarked = bookmarkedMap[q.questionId];

            return (
              <div key={q.questionId} className={`glass-card p-6 sm:p-8 border-l-4 space-y-5 shadow-md ${q.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
                {/* Review Header with Question # and Bookmark Action */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-theme-input text-theme-secondary border border-theme">
                      Question {idx + 1}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(q.questionId)}
                      className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isBookmarked
                          ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                          : 'bg-theme-input text-theme-secondary border-theme hover:border-purple-500 hover:text-purple-600'
                      }`}
                      title={isBookmarked ? 'Remove from Bookmarks' : 'Bookmark this Question'}
                    >
                      {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Question'}</span>
                    </button>
                  </div>

                  <span className={`text-sm font-bold flex items-center gap-1.5 ${q.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {q.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {q.isCorrect ? `+${q.marksObtained} Marks` : '0 Marks'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-theme-primary leading-relaxed">{q.questionText}</h3>

                {q.codeSnippet && (
                  <pre className="code-block text-xs sm:text-sm">{q.codeSnippet}</pre>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {q.options?.map((opt) => {
                    const isSelected = q.selectedAnswer === opt.optionLabel;
                    const isCorrect = q.correctAnswer === opt.optionLabel;
                    let style = 'bg-theme-input border-theme text-theme-secondary font-medium';
                    if (isCorrect) style = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500/40';
                    else if (isSelected && !isCorrect) style = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold ring-1 ring-rose-500/40';

                    return (
                      <div key={opt.id} className={`p-4 rounded-xl border flex items-center gap-3.5 ${style}`}>
                        <span className="w-7 h-7 rounded-lg bg-theme-secondary text-center leading-7 font-bold text-xs shrink-0 border border-theme">
                          {opt.optionLabel}
                        </span>
                        <span className="text-sm font-semibold">{opt.optionText}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm space-y-1.5">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block text-sm">Explanation:</span>
                  <p className="text-theme-secondary leading-relaxed font-medium">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResultPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { examService } from '../../services/api';
import { CheckCircle2, XCircle, Trophy, Download, BarChart2, AlertCircle } from 'lucide-react';

const ResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

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
        <Link to="/student/subjects" className="btn btn-primary mt-4 text-sm">Back to Subjects</Link>
      </div>
    );
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const metrics = [
    { label: 'Total Score', value: `${result.score} / ${result.maxScore}`, color: 'text-indigo-500', border: 'border-indigo-500/30' },
    { label: 'Percentage', value: `${result.percentage}%`, color: 'text-purple-500', border: 'border-purple-500/30' },
    { label: 'Correct', value: result.correctAnswersCount, color: 'text-emerald-500', border: 'border-emerald-500/30' },
    { label: 'Wrong', value: result.wrongAnswersCount, color: 'text-rose-500', border: 'border-rose-500/30' },
    { label: 'Time Taken', value: formatTime(result.timeTakenSeconds), color: 'text-amber-500', border: 'border-amber-500/30' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Result Banner */}
      <div className={`glass-card p-8 text-center border-2 ${result.isPassed ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-theme-input shadow-xl mb-1">
            {result.isPassed
              ? <Trophy size={48} className="text-amber-400 animate-bounce" />
              : <XCircle size={48} className="text-rose-500" />
            }
          </div>
          <h1 className="text-3xl font-extrabold text-theme-primary">
            {result.isPassed ? 'Congratulations! You Passed!' : 'Assessment Complete'}
          </h1>
          <p className="text-xs text-theme-muted font-semibold">
            {result.testTitle} ({result.subjectName}) • {new Date(result.completedAt).toLocaleDateString()}
          </p>
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${
            result.isPassed
              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40'
              : 'bg-rose-500/15 text-rose-500 border-rose-500/40'
          }`}>
            {result.isPassed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className={`glass-card p-4 text-center border ${m.border}`}>
            <span className="text-[11px] font-bold text-theme-muted block mb-1 uppercase tracking-wider">{m.label}</span>
            <span className={`text-xl font-extrabold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-theme pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'summary' ? 'bg-indigo-600 text-white' : 'text-theme-secondary hover:text-theme-primary'}`}
        >
          Topic Performance Breakdown
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'review' ? 'bg-indigo-600 text-white' : 'text-theme-secondary hover:text-theme-primary'}`}
        >
          Solutions & Explanations ({result.questionReviews?.length || 0})
        </button>
        <Link to="/student/reports" className="ml-auto btn btn-secondary text-xs py-1.5 px-3">
          <Download size={14} /> Download PDF
        </Link>
      </div>

      {/* Tab: Topic Summary */}
      {activeTab === 'summary' && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-theme-primary border-b border-theme pb-3 flex items-center gap-2">
            <BarChart2 size={18} className="text-indigo-500" /> Topic-Wise Accuracy Analysis
          </h3>
          <div className="space-y-4">
            {result.topicBreakdown?.length > 0 ? result.topicBreakdown.map((top, idx) => (
              <div key={idx} className="space-y-1.5 bg-theme-input p-4 rounded-xl border border-theme">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-theme-primary">{top.topic}</span>
                  <span className="text-indigo-500">{top.accuracyPercentage}% ({top.correctCount}/{top.totalQuestions})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-theme-secondary overflow-hidden">
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

      {/* Tab: Question Reviews */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {result.questionReviews?.map((q, idx) => (
            <div key={q.questionId} className={`glass-card p-6 border-l-4 space-y-4 ${q.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-theme-input text-theme-secondary border border-theme">
                  Question {idx + 1}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${q.isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {q.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {q.isCorrect ? `+${q.marksObtained} Marks` : '0 Marks'}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-theme-primary leading-relaxed">{q.questionText}</h4>

              {q.codeSnippet && (
                <pre className="code-block text-xs">{q.codeSnippet}</pre>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options?.map((opt) => {
                  const isSelected = q.selectedAnswer === opt.optionLabel;
                  const isCorrect = q.correctAnswer === opt.optionLabel;
                  let style = 'bg-theme-input border-theme text-theme-muted';
                  if (isCorrect) style = 'bg-emerald-500/15 border-emerald-500 text-emerald-500 font-bold';
                  else if (isSelected && !isCorrect) style = 'bg-rose-500/15 border-rose-500 text-rose-500 font-bold';

                  return (
                    <div key={opt.id} className={`p-3 rounded-xl border flex items-center gap-3 ${style}`}>
                      <span className="w-6 h-6 rounded-md bg-theme-secondary text-center leading-6 font-bold text-[11px] shrink-0">
                        {opt.optionLabel}
                      </span>
                      <span>{opt.optionText}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                <span className="font-bold text-indigo-500 block">Explanation:</span>
                <p className="text-theme-secondary leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPage;

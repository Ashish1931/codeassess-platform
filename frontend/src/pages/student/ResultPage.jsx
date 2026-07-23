import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { examService } from '../../services/api';
import { 
  Award, CheckCircle2, XCircle, Clock, Trophy, Download, 
  BarChart2, HelpCircle, ArrowLeft, Code, FileText 
} from 'lucide-react';

const ResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'review'

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
      <div className="p-8 text-center text-slate-400">
        Result not found for this attempt.
      </div>
    );
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Top Banner Card */}
      <div className={`
        glass-card p-8 text-center relative overflow-hidden border-2
        ${result.isPassed ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/30 to-slate-900' : 'border-rose-500/50 bg-gradient-to-b from-rose-950/30 to-slate-900'}
      `}>
        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-slate-900/80 shadow-xl mb-1">
            {result.isPassed ? (
              <Trophy size={48} className="text-amber-400 animate-bounce" />
            ) : (
              <XCircle size={48} className="text-rose-400" />
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100">
            {result.isPassed ? 'Congratulations! You Passed!' : 'Assessment Complete'}
          </h1>
          <p className="text-xs text-slate-400">
            {result.testTitle} ({result.subjectName}) • Attempted on {new Date(result.completedAt).toLocaleDateString()}
          </p>

          {/* Pass / Fail Badge */}
          <div className="pt-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${
              result.isPassed 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
            }`}>
              {result.isPassed ? 'PASSED STATUS' : 'NEEDS IMPROVEMENT'}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="glass-card p-4 text-center border-indigo-500/30">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Score</span>
          <span className="text-xl font-extrabold text-indigo-400">{result.score} / {result.maxScore}</span>
        </div>

        <div className="glass-card p-4 text-center border-purple-500/30">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Percentage</span>
          <span className="text-xl font-extrabold text-purple-400">{result.percentage}%</span>
        </div>

        <div className="glass-card p-4 text-center border-emerald-500/30">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Correct Answers</span>
          <span className="text-xl font-extrabold text-emerald-400">{result.correctAnswersCount}</span>
        </div>

        <div className="glass-card p-4 text-center border-rose-500/30">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Wrong Answers</span>
          <span className="text-xl font-extrabold text-rose-400">{result.wrongAnswersCount}</span>
        </div>

        <div className="glass-card p-4 text-center border-amber-500/30 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Time Taken</span>
          <span className="text-xl font-extrabold text-amber-400">{formatTime(result.timeTakenSeconds)}</span>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 pb-2">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'summary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Topic Performance Breakdown
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'review' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Detailed Solutions & Explanations ({result.questionReviews?.length || 0})
        </button>

        <Link to="/student/reports" className="ml-auto btn btn-secondary text-xs py-1.5 px-3">
          <Download size={14} /> Download PDF
        </Link>
      </div>

      {/* Tab 1: Topic Performance */}
      {activeTab === 'summary' && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
            <BarChart2 size={18} className="text-indigo-400" /> Topic-Wise Accuracy Analysis
          </h3>

          <div className="space-y-4">
            {result.topicBreakdown?.map((top, idx) => (
              <div key={idx} className="space-y-1.5 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{top.topic}</span>
                  <span className="text-indigo-400">{top.accuracyPercentage}% Accuracy ({top.correctCount}/{top.totalQuestions})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${top.accuracyPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Question Reviews */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {result.questionReviews?.map((q, idx) => (
            <div key={q.questionId} className={`glass-card p-6 border-l-4 space-y-4 ${q.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  Question {idx + 1}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${q.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {q.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {q.isCorrect ? `+${q.marksObtained} Marks` : '0 Marks'}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-100">{q.questionText}</h4>

              {q.codeSnippet && (
                <pre className="code-block text-xs border-slate-800">{q.codeSnippet}</pre>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options?.map((opt) => {
                  const isSelected = q.selectedAnswer === opt.optionLabel;
                  const isCorrect = q.correctAnswer === opt.optionLabel;

                  let optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-400';
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                  }

                  return (
                    <div key={opt.id} className={`p-3 rounded-xl border flex items-center gap-3 ${optionStyle}`}>
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-center leading-6 font-bold text-[11px]">
                        {opt.optionLabel}
                      </span>
                      <span>{opt.optionText}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                <span className="font-bold text-indigo-300 block">Detailed Solution Explanation:</span>
                <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPage;

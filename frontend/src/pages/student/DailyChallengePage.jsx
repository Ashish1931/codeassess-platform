import React, { useState } from 'react';
import { Flame, Award, CheckCircle, Zap, ArrowRight } from 'lucide-react';

const DailyChallengePage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = {
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="glass-card p-6 border-amber-500/40 text-center space-y-3 bg-gradient-to-r from-amber-950/20 via-slate-900 to-indigo-950/30">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Flame size={32} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">Daily Programming Challenge</h1>
        <p className="text-xs text-slate-400">Solve today's question to maintain your practice streak and earn +{challenge.bonusXp} XP!</p>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <span className="text-xs font-bold text-indigo-400">{challenge.subject} • {challenge.topic}</span>
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1"><Zap size={14} /> +{challenge.bonusXp} Bonus XP</span>
        </div>

        <h3 className="text-base font-semibold text-slate-100">{challenge.question}</h3>

        <div className="space-y-3">
          {challenge.options.map((opt) => (
            <label
              key={opt.label}
              onClick={() => !submitted && setSelectedOption(opt.label)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                selectedOption === opt.label ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg text-center leading-7 font-bold text-xs ${selectedOption === opt.label ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {opt.label}
              </div>
              <span className="text-sm">{opt.text}</span>
            </label>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full btn btn-primary py-3 text-xs font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-40"
          >
            Submit Answer
          </button>
        ) : (
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            <span className="font-bold text-sm block flex items-center gap-2">
              {isCorrect ? <CheckCircle size={18} /> : null}
              {isCorrect ? 'Correct Answer! +50 XP Earned!' : `Incorrect! Correct option was (${challenge.correctAnswer})`}
            </span>
            <p className="text-slate-300 leading-relaxed pt-1">{challenge.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallengePage;

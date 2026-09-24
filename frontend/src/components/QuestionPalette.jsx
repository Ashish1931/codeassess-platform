import React from 'react';

const QuestionPalette = ({ questions, answers, currentIndex, onSelectQuestion }) => {
  return (
    <div className="glass-card p-5 space-y-4 shadow-md">
      <h3 className="text-sm sm:text-base font-bold text-theme-primary border-b border-theme pb-2.5">
        Question Overview Palette
      </h3>

      {/* Palette Legend */}
      <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-theme-secondary">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm shrink-0"></span> Answered
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm shrink-0"></span> Review
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm shrink-0"></span> Unanswered
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-400 dark:bg-slate-600 shadow-sm shrink-0"></span> Unvisited
        </div>
      </div>

      {/* Number Buttons Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const ansState = answers[q.id];
          const hasAnswer = ansState?.selectedAnswer !== undefined && ansState?.selectedAnswer !== null;
          const isReview = ansState?.isMarkedForReview;
          const isCurrent = idx === currentIndex;

          let btnColor = 'bg-theme-input text-theme-muted border-theme'; // default unvisited

          if (isReview) {
            btnColor = 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500 font-black';
          } else if (hasAnswer) {
            btnColor = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500 font-black';
          } else if (ansState) {
            btnColor = 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500 font-black';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`
                h-10 w-full rounded-xl font-mono text-xs sm:text-sm font-bold border flex items-center justify-center transition-all
                ${btnColor}
                ${isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--bg-primary)] scale-105 shadow-md' : 'hover:border-indigo-500'}
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;

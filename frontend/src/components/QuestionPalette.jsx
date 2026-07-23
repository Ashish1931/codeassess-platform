import React from 'react';
import { CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';

const QuestionPalette = ({ questions, answers, currentIndex, onSelectQuestion }) => {
  return (
    <div className="glass-card p-4 space-y-4">
      <h4 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-2">
        Question Overview Palette
      </h4>

      {/* Palette Legend */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Answered
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span> Review
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span> Unanswered
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-700"></span> Unvisited
        </div>
      </div>

      {/* Number Buttons Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const ansState = answers[q.id];
          const hasAnswer = ansState?.selectedAnswer !== undefined && ansState?.selectedAnswer !== null;
          const isReview = ansState?.isMarkedForReview;
          const isCurrent = idx === currentIndex;

          let btnColor = 'bg-slate-800 text-slate-400 border-slate-700'; // default unvisited

          if (isReview) {
            btnColor = 'bg-purple-600/30 text-purple-300 border-purple-500';
          } else if (hasAnswer) {
            btnColor = 'bg-emerald-600/30 text-emerald-300 border-emerald-500';
          } else if (ansState) {
            btnColor = 'bg-amber-600/30 text-amber-300 border-amber-500';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`
                h-9 w-full rounded-lg font-mono text-xs font-bold border flex items-center justify-center transition-all
                ${btnColor}
                ${isCurrent ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-105' : 'hover:opacity-80'}
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

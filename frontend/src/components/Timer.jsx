import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const Timer = ({ secondsRemaining }) => {
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isWarning = secondsRemaining < 120; // less than 2 minutes

  return (
    <div className={`
      flex items-center gap-2.5 px-4 py-2 rounded-xl font-mono text-sm font-bold border transition-all duration-300
      ${isWarning 
        ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse' 
        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'}
    `}>
      {isWarning ? <AlertTriangle size={18} className="text-rose-400 animate-bounce" /> : <Clock size={18} />}
      <span>{formatTime(secondsRemaining)}</span>
    </div>
  );
};

export default Timer;

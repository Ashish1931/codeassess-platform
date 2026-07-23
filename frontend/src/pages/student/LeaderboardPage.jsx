import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../../services/api';
import { Trophy, Medal, Award, Flame, User } from 'lucide-react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await leaderboardService.getGlobalLeaderboard();
      setLeaderboard(res.data);
    } catch (err) {
      console.error('Failed to fetch leaderboard', err);
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

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="border-b border-slate-700/60 pb-4 text-center sm:text-left">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center justify-center sm:justify-start gap-2.5">
          <Trophy className="text-amber-400" /> Global Student Leaderboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time rankings calculated from cumulative test scores and subject accuracies</p>
      </div>

      <div className="glass-card overflow-hidden border-indigo-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 text-center">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4 text-center">Tests Completed</th>
                <th className="p-4 text-center">Average Accuracy</th>
                <th className="p-4 text-center">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboard.map((item) => (
                <tr key={item.userId} className="hover:bg-indigo-500/5 transition-colors">
                  <td className="p-4 text-center">
                    {item.rank === 1 ? (
                      <span className="inline-flex w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold items-center justify-center border border-amber-500/40">1</span>
                    ) : item.rank === 2 ? (
                      <span className="inline-flex w-7 h-7 rounded-full bg-slate-400/20 text-slate-300 font-bold items-center justify-center border border-slate-400/40">2</span>
                    ) : item.rank === 3 ? (
                      <span className="inline-flex w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 font-bold items-center justify-center border border-amber-700/40">3</span>
                    ) : (
                      <span className="font-mono text-slate-400 font-bold">#{item.rank}</span>
                    )}
                  </td>

                  <td className="p-4 font-semibold text-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold">
                      {item.studentName ? item.studentName.charAt(0) : 'U'}
                    </div>
                    <span>{item.studentName}</span>
                  </td>

                  <td className="p-4 text-center font-bold text-slate-300">{item.testsCompleted}</td>
                  <td className="p-4 text-center font-bold text-purple-400">{item.averagePercentage}%</td>
                  <td className="p-4 text-center font-bold text-emerald-400">{item.totalScore} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

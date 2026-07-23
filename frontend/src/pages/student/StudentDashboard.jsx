import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/api';
import { 
  FileCheck, CheckCircle2, Clock, Award, TrendingUp, AlertTriangle, 
  Target, BarChart2, BookOpen, Flame, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await userService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
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

  const statCards = [
    { label: 'Total Available Tests', value: stats?.totalTestsAvailable || 0, icon: FileCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Attempted Tests', value: stats?.attemptedTestsCount || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Pending Tests', value: stats?.pendingTestsCount || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Average Score', value: `${stats?.averageScorePercentage || 0}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Best Score', value: `${stats?.bestScorePercentage || 0}%`, icon: Award, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { label: 'Weak Subject', value: stats?.weakSubject || 'None', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Latest Test', value: stats?.latestTestTitle || 'N/A', icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Overall Accuracy', value: `${stats?.overallAccuracy || 0}%`, icon: BarChart2, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 md:p-10 relative overflow-hidden bg-gradient-to-r from-indigo-900/70 via-purple-900/50 to-slate-900/90 border border-indigo-500/40 shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold border border-indigo-500/40 backdrop-blur-md">
            <Flame size={16} className="text-amber-400 animate-pulse" /> 5 Day Active Streak!
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Student Assessment Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Track your programming MCQ scores, analyze subject weaknesses, download detailed PDF performance reports, and excel in technical interviews.
          </p>
          <div className="pt-3 flex flex-wrap gap-4">
            <Link to="/student/subjects" className="btn btn-primary text-sm sm:text-base py-3 px-6 shadow-lg shadow-indigo-500/25">
              <BookOpen size={18} /> Browse Subjects
            </Link>
            <Link to="/student/daily-challenge" className="btn btn-secondary text-sm sm:text-base py-3 px-6">
              <Flame size={18} className="text-amber-400" /> Daily Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Dashboard Cards - Expanded Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-card p-6 border ${card.bg} flex flex-col justify-between hover:scale-[1.02] transition-all duration-200 shadow-md`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <div className={`p-3 rounded-xl bg-slate-900/60 dark:bg-slate-950/80 ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight truncate">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Trend Line Chart */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
            <h3 className="font-bold text-slate-100 text-base sm:text-lg flex items-center gap-2.5">
              <TrendingUp size={22} className="text-indigo-400" /> Score Progress Trend Over Time
            </h3>
            <span className="text-xs sm:text-sm text-slate-400 font-medium">Recent Attempts</span>
          </div>
          <div className="h-72 sm:h-80 w-full">
            {stats?.scoreTrendOverTime && stats.scoreTrendOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.scoreTrendOverTime}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '13px' }}
                  />
                  <Line type="monotone" dataKey="scorePercentage" stroke="#6366f1" strokeWidth={3.5} dot={{ fill: '#8b5cf6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-sm text-slate-400 gap-2">
                <BarChart2 size={32} className="text-slate-600" />
                <span>Attempt mock tests to visualize your score progression.</span>
              </div>
            )}
          </div>
        </div>

        {/* Subject-Wise Performance Bar Chart */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
            <h3 className="font-bold text-slate-100 text-base sm:text-lg flex items-center gap-2.5">
              <BarChart2 size={22} className="text-purple-400" /> Subject-Wise Accuracy (%)
            </h3>
            <span className="text-xs sm:text-sm text-slate-400 font-medium">By Subject</span>
          </div>
          <div className="h-72 sm:h-80 w-full">
            {stats?.subjectPerformance && stats.subjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.subjectPerformance}>
                  <XAxis dataKey="subjectName" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '13px' }}
                  />
                  <Bar dataKey="accuracyPercentage" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-sm text-slate-400 gap-2">
                <Target size={32} className="text-slate-600" />
                <span>No subject performance data available yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic Diagnostics: Weak & Strong Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 sm:p-8 border-l-4 border-l-rose-500 space-y-4 shadow-md">
          <h4 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2.5">
            <AlertTriangle size={22} className="text-rose-400" /> Weak Topics to Focus On
          </h4>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {stats?.weakTopics?.map((topic, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 border-l-4 border-l-emerald-500 space-y-4 shadow-md">
          <h4 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2.5">
            <CheckCircle2 size={22} className="text-emerald-400" /> Strong Topics (Mastered)
          </h4>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {stats?.strongTopics?.map((topic, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

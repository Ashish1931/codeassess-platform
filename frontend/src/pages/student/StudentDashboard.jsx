import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FileCheck, CheckCircle2, Clock, Award, TrendingUp, AlertTriangle, 
  Target, BarChart2, BookOpen, Flame, Crown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Available Tests', value: stats?.totalTestsAvailable || 0, icon: FileCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    { label: 'Attempted Tests', value: stats?.attemptedTestsCount || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Pending Tests', value: stats?.pendingTestsCount || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' },
    { label: 'Average Score', value: `${stats?.averageScorePercentage || 0}%`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/30' },
    { label: 'Best Score', value: `${stats?.bestScorePercentage || 0}%`, icon: Award, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/30' },
    { label: 'Weak Subject', value: stats?.weakSubject || 'None', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/30' },
    { label: 'Latest Test', value: stats?.latestTestTitle || 'N/A', icon: Target, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { label: 'Overall Accuracy', value: `${stats?.overallAccuracy || 0}%`, icon: BarChart2, color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/30' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Banner */}
      <div className="page-band p-6 sm:p-8 md:p-10 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-500 text-sm font-bold border border-indigo-500/40 backdrop-blur-md">
            <Flame size={18} className="text-amber-400 animate-pulse" /> 5 Day Active Streak!
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-primary tracking-tight">
            Student Assessment Dashboard
          </h1>
          <p className="text-base text-theme-secondary max-w-3xl leading-relaxed font-semibold">
            Track your programming MCQ scores, analyze subject weaknesses, download detailed PDF performance reports, and excel in technical interviews.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link to="/student/subjects" className="btn btn-primary text-base py-3 px-6 shadow-lg shadow-indigo-500/25">
              <BookOpen size={20} /> Browse Subjects
            </Link>
            <Link to="/student/daily-challenge" className="btn btn-secondary text-base py-3 px-6">
              <Flame size={20} className="text-amber-500" /> Daily Challenge
            </Link>
            <Link to="/student/subscription" className={`btn btn-outline text-base py-3 px-6 border ${
              user?.subscription?.plan === 'PREMIUM' ? 'border-amber-500 text-amber-500 hover:bg-amber-500/10' :
              user?.subscription?.plan === 'PRO'     ? 'border-indigo-500 text-indigo-500' : ''
            }`}>
              <Crown size={20} /> {user?.subscription?.planName || 'Free'} Plan
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
                <span className="text-sm font-bold text-theme-secondary uppercase tracking-wider">{card.label}</span>
                <div className={`p-3 rounded-xl bg-theme-primary ${card.color} border border-theme shadow-sm`}>
                  <Icon size={24} />
                </div>
              </div>
              <span className="text-3xl font-extrabold text-theme-primary tracking-tight truncate">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Trend Line Chart */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-theme pb-4">
            <h3 className="font-extrabold text-theme-primary text-lg flex items-center gap-3">
              <TrendingUp size={24} className="text-indigo-500" /> Score Progress Trend
            </h3>
            <span className="text-sm font-bold text-theme-muted">Recent Attempts</span>
          </div>
          <div className="h-72 sm:h-80 w-full">
            {stats?.scoreTrendOverTime && stats.scoreTrendOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.scoreTrendOverTime}>
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={13} fontWeight={600} />
                  <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={13} fontWeight={600} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-primary)' }}
                  />
                  <Line type="monotone" dataKey="scorePercentage" stroke="#6366f1" strokeWidth={3.5} dot={{ fill: '#8b5cf6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-sm font-semibold text-theme-muted gap-2">
                <BarChart2 size={36} className="text-theme-muted" />
                <span>Attempt mock tests to visualize your score progression.</span>
              </div>
            )}
          </div>
        </div>

        {/* Subject-Wise Performance Bar Chart */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-theme pb-4">
            <h3 className="font-extrabold text-theme-primary text-lg flex items-center gap-3">
              <BarChart2 size={24} className="text-purple-500" /> Subject-Wise Accuracy (%)
            </h3>
            <span className="text-sm font-bold text-theme-muted">By Subject</span>
          </div>
          <div className="h-72 sm:h-80 w-full">
            {stats?.subjectPerformance && stats.subjectPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.subjectPerformance}>
                  <XAxis dataKey="subjectName" stroke="var(--text-muted)" fontSize={13} fontWeight={600} />
                  <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={13} fontWeight={600} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="accuracyPercentage" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-sm font-semibold text-theme-muted gap-2">
                <Target size={36} className="text-theme-muted" />
                <span>No subject performance data available yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic Diagnostics: Weak & Strong Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 sm:p-8 border-l-4 border-l-rose-500 space-y-4 shadow-md">
          <h4 className="font-extrabold text-lg text-theme-primary flex items-center gap-3">
            <AlertTriangle size={24} className="text-rose-500" /> Weak Topics to Focus On
          </h4>
          <div className="flex flex-wrap gap-3 pt-1">
            {stats?.weakTopics?.map((topic, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-sm font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 border-l-4 border-l-emerald-500 space-y-4 shadow-md">
          <h4 className="font-extrabold text-lg text-theme-primary flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-500" /> Strong Topics (Mastered)
          </h4>
          <div className="flex flex-wrap gap-3 pt-1">
            {stats?.strongTopics?.map((topic, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-sm font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
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

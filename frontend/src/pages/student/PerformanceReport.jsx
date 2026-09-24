import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { BarChart3, TrendingUp, PieChart as PieIcon, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'var(--bg-secondary)',
  borderColor: 'var(--border-color)',
  borderRadius: '12px',
  fontSize: '13px',
  color: 'var(--text-primary)',
};

const PerformanceReport = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await userService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch performance stats', err);
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

  const accuracy = stats?.overallAccuracy || 0;
  const pieData = [
    { name: 'Correct', value: accuracy, color: '#10b981' },
    { name: 'Incorrect', value: Math.max(0, 100 - accuracy), color: '#ef4444' },
  ];

  const EmptyState = ({ icon: Icon, text }) => (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-theme-muted">
      <Icon size={36} />
      <span className="text-sm font-semibold">{text}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="page-band p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-primary flex items-center gap-3">
          <BarChart3 className="text-indigo-500" /> Performance & Analytics Report
        </h1>
        <p className="text-sm text-theme-muted mt-1 font-semibold">
          Deep analysis of your accuracy, historical progress trends, and topic strengths
        </p>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Score', value: `${stats?.averageScorePercentage || 0}%`, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/30' },
          { label: 'Best Score', value: `${stats?.bestScorePercentage || 0}%`, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' },
          { label: 'Overall Accuracy', value: `${accuracy}%`, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/30' },
          { label: 'Tests Attempted', value: stats?.attemptedTestsCount || 0, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' },
        ].map((s) => (
          <div key={s.label} className={`glass-card p-5 border ${s.bg} text-center`}>
            <p className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-theme-primary border-b border-theme pb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-500" /> Score Trend Over Time
          </h3>
          <div className="h-64 w-full">
            {stats?.scoreTrendOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.scoreTrendOverTime}>
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
                  <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="scorePercentage" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingUp} text="Attempt tests to see your score trend." />
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-theme-primary border-b border-theme pb-3 flex items-center gap-2">
            <PieIcon size={18} className="text-pink-500" /> Accuracy Ratio
          </h3>
          <div className="h-64 w-full">
            {stats?.attemptedTestsCount > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={PieIcon} text="No data yet." />
            )}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-theme-primary border-b border-theme pb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-500" /> Subject-Wise Accuracy (%)
        </h3>
        <div className="h-64 w-full">
          {stats?.subjectPerformance?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subjectPerformance}>
                <XAxis dataKey="subjectName" stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="accuracyPercentage" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={BarChart3} text="No subject performance data available yet." />
          )}
        </div>
      </div>

      {/* Weak / Strong Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-rose-500 space-y-3">
          <h4 className="font-bold text-theme-primary flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-500" /> Weak Topics to Focus On
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats?.weakTopics?.length > 0
              ? stats.weakTopics.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30">{t}</span>
                ))
              : <span className="text-sm text-theme-muted font-semibold">No weak topics identified yet.</span>
            }
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500 space-y-3">
          <h4 className="font-bold text-theme-primary flex items-center gap-2">
            <Target size={18} className="text-emerald-500" /> Strong Topics (Mastered)
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats?.strongTopics?.length > 0
              ? stats.strongTopics.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">{t}</span>
                ))
              : <span className="text-sm text-theme-muted font-semibold">Keep practicing to identify strong topics.</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReport;

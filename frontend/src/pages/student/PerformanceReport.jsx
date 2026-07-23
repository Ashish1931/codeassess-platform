import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { BarChart3, TrendingUp, PieChart as PieIcon, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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

  const pieData = [
    { name: 'Correct Answers', value: stats?.overallAccuracy || 75, color: '#10b981' },
    { name: 'Incorrect Answers', value: 100 - (stats?.overallAccuracy || 75), color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <BarChart3 className="text-indigo-400" /> Student Performance & Analytics Report
        </h1>
        <p className="text-xs text-slate-400 mt-1">Deep longitudinal analysis of your accuracy, historical progress trends, and topic strengths</p>
      </div>

      {/* 3 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-400" /> Performance Trend Over Time (Line Graph)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.scoreTrendOverTime || []}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="scorePercentage" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
            <PieIcon size={18} className="text-pink-400" /> Overall Accuracy Ratio (Pie Chart)
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart: Subject Performance */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-400" /> Subject-Wise Comparison (Bar Graph)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.subjectPerformance || []}>
              <XAxis dataKey="subjectName" stroke="#64748b" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="accuracyPercentage" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReport;

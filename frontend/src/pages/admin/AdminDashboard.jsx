import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { 
  Users, BookOpen, FileCheck, Clock, TrendingUp, Award, AlertCircle, 
  ShieldCheck, PlusCircle, HelpCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
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

  const cards = [
    { label: 'Total Enrolled Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    { label: 'Total Subjects', value: stats?.totalSubjects || 0, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/30' },
    { label: 'Total Mock Tests', value: stats?.totalTests || 0, icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: "Today's Attempts", value: stats?.todayAttempts || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' },
    { label: 'Platform Avg Score', value: `${stats?.averageScore || 0}%`, icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/30' },
    { label: 'Highest Score Recorded', value: `${stats?.highestScore || 0}%`, icon: Award, color: 'text-teal-500', bg: 'bg-teal-500/10 border-teal-500/30' },
    { label: 'Lowest Score Recorded', value: `${stats?.lowestScore || 0}%`, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/30' },
    { label: 'Pending Results', value: stats?.pendingResultsCount || 0, icon: ShieldCheck, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 border-indigo-500/40 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-slate-900/40 dark:from-indigo-950/80 dark:to-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block mb-2">Administrator Control Center</span>
            <h1 className="text-3xl font-extrabold text-theme-primary tracking-tight">EdTech Management Overview</h1>
            <p className="text-sm font-semibold text-theme-secondary mt-2">Manage MCQ question banks, test publishing status, student records, and platform analytics</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/admin/tests" className="btn btn-primary text-sm py-2.5 px-4">
              <PlusCircle size={18} /> Create Test
            </Link>
            <Link to="/admin/questions" className="btn btn-secondary text-sm py-2.5 px-4">
              <HelpCircle size={18} /> Add MCQs
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Admin Dashboard Metric Cards */}
      <div className="dashboard-grid">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className={`glass-card p-6 border ${c.bg} flex flex-col justify-between hover:shadow-lg transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-theme-secondary">{c.label}</span>
                <div className={`p-3 rounded-xl bg-theme-primary ${c.color} border border-theme shadow-sm`}>
                  <Icon size={22} />
                </div>
              </div>
              <span className="text-3xl font-extrabold text-theme-primary tracking-tight">{c.value}</span>
            </div>
          );
        })}
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/subjects" className="glass-card p-6 border-indigo-500/30 hover:border-indigo-500 transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
            <BookOpen size={26} />
          </div>
          <h3 className="text-lg font-bold text-theme-primary group-hover:text-indigo-500 transition-colors">Subject Management</h3>
          <p className="text-sm font-semibold text-theme-secondary">Create, edit, or delete programming subjects (DSA, Java, C++, Python, SQL, DBMS, OS, CN).</p>
        </Link>

        <Link to="/admin/tests" className="glass-card p-6 border-purple-500/30 hover:border-purple-500 transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold">
            <FileCheck size={26} />
          </div>
          <h3 className="text-lg font-bold text-theme-primary group-hover:text-purple-500 transition-colors">Test Paper & Status Control</h3>
          <p className="text-sm font-semibold text-theme-secondary">Publish or unpublish test papers, set passing marks, duration, and difficulty ratings.</p>
        </Link>

        <Link to="/admin/questions" className="glass-card p-6 border-emerald-500/30 hover:border-emerald-500 transition-all space-y-3 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
            <HelpCircle size={26} />
          </div>
          <h3 className="text-lg font-bold text-theme-primary group-hover:text-emerald-500 transition-colors">MCQ Question Bank</h3>
          <p className="text-sm font-semibold text-theme-secondary">Add multiple choice questions with code snippets, 4 options A/B/C/D, and detailed explanations.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

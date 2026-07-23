import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { 
  Users, BookOpen, FileCheck, Clock, TrendingUp, Award, AlertCircle, 
  ShieldCheck, PlusCircle, HelpCircle, Eye 
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
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Enrolled Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Total Subjects', value: stats?.totalSubjects || 0, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Total Mock Tests', value: stats?.totalTests || 0, icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: "Today's Attempts", value: stats?.todayAttempts || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Platform Avg Score', value: `${stats?.averageScore || 0}%`, icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { label: 'Highest Score Recorded', value: `${stats?.highestScore || 0}%`, icon: Award, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Lowest Score Recorded', value: `${stats?.lowestScore || 0}%`, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'Pending Results', value: stats?.pendingResultsCount || 0, icon: ShieldCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-6 md:p-8 border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">Administrator Control Center</span>
            <h1 className="text-2xl font-extrabold text-slate-100">EdTech Management Overview</h1>
            <p className="text-xs text-slate-400 mt-1">Manage MCQ question banks, test publishing status, student records, and platform analytics</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/admin/tests" className="btn btn-primary text-xs py-2 px-3">
              <PlusCircle size={15} /> Create Test
            </Link>
            <Link to="/admin/questions" className="btn btn-secondary text-xs py-2 px-3">
              <HelpCircle size={15} /> Add MCQs
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Admin Dashboard Metric Cards */}
      <div className="dashboard-grid">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className={`glass-card p-5 border ${c.bg} flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{c.label}</span>
                <div className={`p-2.5 rounded-xl bg-slate-900/60 ${c.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <span className="text-xl font-extrabold text-slate-100">{c.value}</span>
            </div>
          );
        })}
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/subjects" className="glass-card p-6 border-indigo-500/30 hover:border-indigo-500 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <BookOpen size={22} />
          </div>
          <h3 className="text-base font-bold text-slate-200 group-hover:text-indigo-400">Subject Management</h3>
          <p className="text-xs text-slate-400">Create, edit, or delete programming subjects (DSA, Java, C++, Python, SQL, DBMS, OS, CN).</p>
        </Link>

        <Link to="/admin/tests" className="glass-card p-6 border-purple-500/30 hover:border-purple-500 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <FileCheck size={22} />
          </div>
          <h3 className="text-base font-bold text-slate-200 group-hover:text-purple-400">Test Paper & Status Control</h3>
          <p className="text-xs text-slate-400">Publish or unpublish test papers, set passing marks, duration, and difficulty ratings.</p>
        </Link>

        <Link to="/admin/questions" className="glass-card p-6 border-emerald-500/30 hover:border-emerald-500 transition-all space-y-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle size={22} />
          </div>
          <h3 className="text-base font-bold text-slate-200 group-hover:text-emerald-400">MCQ Question Bank</h3>
          <p className="text-xs text-slate-400">Add multiple choice questions with code snippets, 4 options A/B/C/D, and detailed explanations.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

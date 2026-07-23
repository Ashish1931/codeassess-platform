import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, BookOpen, FileCheck, BarChart3, Download, 
  Settings, LogOut, Bookmark, Zap, Trophy, ShieldCheck, Users, HelpCircle, Flame
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, isAdmin } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/student/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/student/mock-tests', label: 'Mock Tests', icon: FileCheck },
    { to: '/student/performance', label: 'Performance Report', icon: BarChart3 },
    { to: '/student/reports', label: 'Download Reports', icon: Download },
    { to: '/student/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/student/wrong-answers', label: 'Practice Mistakes', icon: Zap },
    { to: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/student/daily-challenge', label: 'Daily Challenge', icon: Flame },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: ShieldCheck },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/admin/tests', label: 'Mock Tests', icon: FileCheck },
    { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
  ];

  const navLinks = isAdmin() ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/70 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      <aside className={`
        fixed top-[70px] left-0 bottom-0 z-30 w-[var(--sidebar-width)] 
        glass-card border-r border-slate-700/60 rounded-none p-4 
        flex flex-col justify-between overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          <div className="px-3 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
              {isAdmin() ? 'ADMINISTRATION PANEL' : 'STUDENT PORTAL'}
            </span>
            <p className="text-xs text-slate-300 font-medium">
              {isAdmin() ? 'Content & User Control' : 'MCQ Assessment & Practice'}
            </p>
          </div>

          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
                    transition-all duration-200 decoration-none
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 translate-x-1' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout button */}
        <div className="pt-4 border-t border-slate-700/60">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all text-left"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

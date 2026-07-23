import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Code2, Sun, Moon, LogOut, User, ShieldCheck, Bell, 
  Search, BookOpen, Award, Menu, X 
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-nav sticky top-0 z-40 w-full h-[70px] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Brand & Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        {user && (
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-slate-300"
          >
            <Menu size={22} />
          </button>
        )}
        <Link to={user ? (isAdmin() ? '/admin/dashboard' : '/student/dashboard') : '/'} className="flex items-center gap-3 decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Code2 size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-gradient">CodeAssess <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold ml-1">PRO</span></span>
            <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">Programming Assessment Platform</span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      {user && (
        <div className="hidden md:flex items-center gap-2 bg-slate-900/60 dark:bg-slate-950/60 border border-slate-700/50 rounded-xl px-3.5 py-1.5 w-72 focus-within:w-80 focus-within:border-indigo-500 transition-all duration-300">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search subjects, tests, MCQs..."
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
          />
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/80 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 border border-slate-700/60 transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/80 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 border border-slate-700/60 transition-all relative"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"></span>
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-card p-4 shadow-2xl z-50 animate-fade-in border border-slate-700">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-3">
                    <span className="font-semibold text-sm text-slate-200">Notifications</span>
                    <span className="text-xs text-indigo-400 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-slate-300">
                      <p className="font-semibold text-indigo-300 mb-0.5">New Test Available!</p>
                      <p className="text-slate-400">Data Structures Core Test #4 is now published.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
                      <p className="font-semibold text-emerald-400 mb-0.5">Daily Challenge Complete</p>
                      <p className="text-slate-400">You earned +50 XP bonus today!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/60 dark:bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200">{user.firstName} {user.lastName}</span>
                  <span className="text-[10px] text-indigo-400 font-medium">
                    {isAdmin() ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-card py-2 shadow-2xl z-50 animate-fade-in border border-slate-700/80">
                  <div className="px-4 py-2 border-b border-slate-700/60 mb-1">
                    <p className="text-xs font-bold text-slate-200">{user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link 
                    to={isAdmin() ? '/admin/dashboard' : '/student/profile'}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
                  >
                    <User size={15} /> My Profile
                  </Link>
                  {isAdmin() && (
                    <Link 
                      to="/admin/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                    >
                      <ShieldCheck size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left border-t border-slate-700/60 mt-1"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link to="/login" className="btn btn-secondary text-sm px-5 py-2.5">Sign In</Link>
            <Link to="/register" className="btn btn-primary text-sm px-5 py-2.5 shadow-md shadow-indigo-500/20">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

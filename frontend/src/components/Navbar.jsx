import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Code2, Sun, Moon, LogOut, User, ShieldCheck, Bell, 
  Search, Menu
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
            className="md:hidden p-2 rounded-lg hover:bg-indigo-500/10 text-theme-secondary"
          >
            <Menu size={24} />
          </button>
        )}
        <Link to={user ? (isAdmin() ? '/admin/dashboard' : '/student/dashboard') : '/'} className="flex items-center gap-3 decoration-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Code2 size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-gradient">
              CodeAssess <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 font-bold ml-1">PRO</span>
            </span>
            <span className="text-[11px] text-theme-muted font-bold tracking-wider uppercase">Programming Assessment Platform</span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      {user && (
        <div className="hidden md:flex items-center gap-2 bg-theme-input border border-theme rounded-xl px-4 py-2 w-72 focus-within:w-80 focus-within:border-indigo-500 transition-all duration-300">
          <Search size={18} className="text-theme-muted" />
          <input 
            type="text" 
            placeholder="Search subjects, tests, MCQs..."
            className="bg-transparent border-none outline-none text-sm font-semibold text-theme-primary placeholder-theme-muted w-full"
          />
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-theme-card hover:bg-indigo-500/10 text-theme-secondary hover:text-indigo-500 border border-theme transition-all"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>

        {user ? (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-theme-card hover:bg-indigo-500/10 text-theme-secondary hover:text-indigo-500 border border-theme transition-all relative"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-card p-4 shadow-2xl z-50 animate-fade-in border border-theme">
                  <div className="flex items-center justify-between pb-2 border-b border-theme mb-3">
                    <span className="font-bold text-sm text-theme-primary">Notifications</span>
                    <span className="text-xs font-bold text-indigo-500 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-theme-primary">
                      <p className="font-bold text-indigo-500 mb-0.5">New Test Available!</p>
                      <p className="text-theme-secondary">Data Structures Core Test #4 is now published.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-theme-primary border border-theme text-theme-primary">
                      <p className="font-bold text-emerald-500 mb-0.5">Daily Challenge Complete</p>
                      <p className="text-theme-secondary">You earned +50 XP bonus today!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-theme-card border border-theme hover:border-indigo-500/50 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-bold text-theme-primary">{user.firstName} {user.lastName}</span>
                  <span className="text-xs text-indigo-500 font-bold">
                    {isAdmin() ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-60 glass-card py-2 shadow-2xl z-50 animate-fade-in border border-theme">
                  <div className="px-4 py-2 border-b border-theme mb-1">
                    <p className="text-sm font-bold text-theme-primary">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-theme-muted truncate">{user.email}</p>
                  </div>
                  <Link 
                    to={isAdmin() ? '/admin/dashboard' : '/student/profile'}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-theme-secondary hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors"
                  >
                    <User size={18} /> My Profile
                  </Link>
                  {isAdmin() && (
                    <Link 
                      to="/admin/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-amber-500 hover:bg-amber-500/10 transition-colors"
                    >
                      <ShieldCheck size={18} /> Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors text-left border-t border-theme mt-1"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary text-sm px-5 py-2.5">Sign In</Link>
            <Link to="/register" className="btn btn-primary text-sm px-5 py-2.5 shadow-md shadow-indigo-500/20">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { FileCheck, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 border border-purple-500/30">
        <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <FileCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">Terms of Service</h1>
            <p className="text-sm text-slate-400 mt-1">Platform Rules & User Agreement • CodeAssess Pro</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="glass-card p-6 md:p-10 space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileCheck size={20} className="text-indigo-400" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or registering an account on CodeAssess Pro, you agree to comply with all platform rules, honor examination time limits, and maintain academic honesty during live assessments.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-700/60">
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" /> 2. Fair Conduct & Anti-Cheating
          </h2>
          <p>
            Automated scripts, web scraping, refreshing the browser to bypass countdown timers, or sharing test questions is strictly prohibited. Violations may result in student account suspension or score invalidation.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;

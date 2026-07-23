import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/30">
        <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">Privacy Policy</h1>
            <p className="text-sm text-slate-400 mt-1">Last Updated: July 2026 • CodeAssess Pro Platform</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="glass-card p-6 md:p-10 space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Lock size={20} className="text-indigo-400" /> 1. Data Protection & Security
          </h2>
          <p>
            At CodeAssess Pro, we prioritize the protection of your personal information and academic evaluation data. All student passwords are strictly encrypted using BCrypt hashing algorithms before database persistence. Account credentials and JWT session tokens are stored securely in local browser memory and are never exposed to unauthorized third parties.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-700/60">
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Eye size={20} className="text-purple-400" /> 2. Information We Collect
          </h2>
          <p>
            We collect basic profile details (First Name, Last Name, Email Address, Mobile Number, Subject Preferences) solely for identity verification, leaderboard rank compilation, and assessment performance reporting. We do NOT sell, rent, or trade your personal data to external advertisers.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-700/60">
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText size={20} className="text-emerald-400" /> 3. Examination Data Integrity
          </h2>
          <p>
            Mock exam attempt timestamps, answer selections, calculated scores, and time-taken analytics are retained in your student history to generate accurate diagnostic reports and downloadable PDF transcripts.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

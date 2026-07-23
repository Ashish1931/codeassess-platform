import React from 'react';
import { HelpCircle, Mail, MessageSquare, PhoneCall, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportPage = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-emerald-900/60 via-indigo-900/40 to-slate-900/80 border border-emerald-500/30">
        <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <HelpCircle size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">Help & Support Center</h1>
            <p className="text-sm text-slate-400 mt-1">We are here to assist with your programming assessment journey</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border border-slate-700/60 flex flex-col items-center text-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Mail size={28} />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Email Support</h3>
          <p className="text-xs text-slate-400">Send us your queries or technical feedback directly.</p>
          <a href="mailto:support@codeassess.com" className="text-xs font-semibold text-indigo-400 hover:underline">support@codeassess.com</a>
        </div>

        <div className="glass-card p-6 border border-slate-700/60 flex flex-col items-center text-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <MessageSquare size={28} />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Live FAQ</h3>
          <p className="text-xs text-slate-400">Check common answers for exam timer, scoring & certificates.</p>
          <span className="text-xs font-semibold text-purple-400">24/7 Available</span>
        </div>

        <div className="glass-card p-6 border border-slate-700/60 flex flex-col items-center text-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PhoneCall size={28} />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Direct Helpline</h3>
          <p className="text-xs text-slate-400">Call our platform administrators during working hours.</p>
          <span className="text-xs font-semibold text-emerald-400">+1 (800) 555-CODE</span>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

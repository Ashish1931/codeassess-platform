import React from 'react';
import { BookOpen, Cpu, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocumentationPage = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/80 border border-blue-500/30">
        <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">Platform Documentation</h1>
            <p className="text-sm text-slate-400 mt-1">Complete guide on subjects, scoring algorithm, & PDF certificate generation</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 md:p-10 space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu size={20} className="text-indigo-400" /> Assessment Topics Supported
          </h2>
          <p>
            CodeAssess Pro features 8 core computer science subject banks: Data Structures, C++, Java, Python, SQL, DBMS, Operating Systems, and Computer Networks.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-700/60">
          <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-400" /> Evaluation & Grading Formula
          </h2>
          <p>
            Scores are computed automatically upon exam submission. Each correct response earns positive marks specified per question. No negative marking is applied by default unless configured by the Administrator.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DocumentationPage;

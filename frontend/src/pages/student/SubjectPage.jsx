import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subjectService } from '../../services/api';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectService.getAllSubjects();
      setSubjects(res.data);
    } catch (err) {
      console.error('Failed to fetch subjects', err);
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

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-3">
            <BookOpen className="text-indigo-400" size={32} /> Programming Subjects Catalog
          </h1>
          <p className="text-sm text-slate-400 mt-1">Select a subject area to view available mock tests and practice MCQ sets</p>
        </div>
        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-semibold self-start sm:self-auto">
          {subjects.length} Subjects Active
        </span>
      </div>

      {/* Subject Cards Grid - Full Width & Scaled */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((sub) => (
          <div key={sub.id} className="glass-card overflow-hidden flex flex-col justify-between hover:scale-[1.02] hover:border-indigo-500/50 transition-all duration-300 group shadow-lg">
            <div>
              {/* Subject Header Image */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-800">
                <img 
                  src={sub.imageUrl || 'https://images.unsplash.com/photo-1516116211223-48a9896886a6?w=600&auto=format&fit=crop&q=80'} 
                  alt={sub.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-xs font-mono font-bold text-indigo-300 border border-indigo-500/40">
                  {sub.code}
                </span>
                <h3 className="absolute bottom-3.5 left-4 text-xl font-extrabold text-white drop-shadow-md">
                  {sub.name}
                </h3>
              </div>

              {/* Subject Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed font-normal">
                  {sub.description}
                </p>

                <div className="flex items-center gap-2.5 text-sm text-indigo-400 font-semibold pt-1">
                  <FileText size={18} />
                  <span>{sub.totalTests || 0} Mock Tests Available</span>
                </div>
              </div>
            </div>

            {/* Card Action */}
            <div className="p-6 pt-0">
              <Link 
                to={`/student/mock-test/${sub.id}`} 
                className="w-full btn btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
              >
                <span>View Mock Tests</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectPage;

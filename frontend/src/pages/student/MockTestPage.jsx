import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { testService, subjectService } from '../../services/api';
import { FileCheck, Clock, Award, CheckCircle2, ArrowLeft, Play, AlertCircle } from 'lucide-react';

const MockTestPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  useEffect(() => {
    fetchTestsAndSubject();
  }, [subjectId]);

  const fetchTestsAndSubject = async () => {
    try {
      setLoading(true);
      if (subjectId) {
        const subRes = await subjectService.getSubjectById(subjectId);
        setSubject(subRes.data);
        const testRes = await testService.getTestsBySubject(subjectId);
        setTests(testRes.data);
      } else {
        const testRes = await testService.getAllTests();
        setTests(testRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch tests', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter((t) => {
    if (filterDifficulty === 'ALL') return true;
    return t.difficulty === filterDifficulty;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div>
          <Link to="/student/subjects" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline mb-2">
            <ArrowLeft size={14} /> Back to Subjects
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FileCheck className="text-indigo-400" /> {subject ? `${subject.name} Mock Tests` : 'All Available Mock Tests'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Select a test paper to start your live timed MCQ examination</p>
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/60 text-xs">
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${filterDifficulty === diff ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <AlertCircle size={36} className="text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Tests Found</h3>
          <p className="text-xs text-slate-500">No mock tests available matching the selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    test.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                    test.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                    'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}>
                    {test.difficulty}
                  </span>
                  <span className="text-[11px] text-indigo-400 font-semibold">{test.subjectName}</span>
                </div>

                <h3 className="text-base font-bold text-slate-100 line-clamp-2">{test.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{test.description}</p>

                {/* Metrics Details */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <FileCheck size={14} className="text-indigo-400" />
                    <span>{test.totalQuestions || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-400" />
                    <span>{test.durationMinutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award size={14} className="text-purple-400" />
                    <span>{test.totalMarks} Marks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Pass: {test.passingMarks}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/student/exam/${test.id}`)}
                  className="w-full btn btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  <Play size={15} />
                  <span>Attempt Test Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockTestPage;

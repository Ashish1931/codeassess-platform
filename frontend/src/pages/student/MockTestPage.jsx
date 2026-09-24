import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { testService, subjectService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileCheck, Clock, Award, CheckCircle2, ArrowLeft, Play, AlertCircle, Crown, Lock } from 'lucide-react';

const MockTestPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tests, setTests] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  const subscription = user?.subscription;
  const monthlyLimit = subscription?.monthlyTestLimit ?? 5;
  const isUnlimited = monthlyLimit === -1;
  const planName = subscription?.planName || 'Free';

  useEffect(() => {
    fetchTestsAndSubject();
  }, [subjectId]);

  const fetchTestsAndSubject = async () => {
    try {
      setLoading(true);
      if (subjectId) {
        const [subRes, testRes] = await Promise.all([
          subjectService.getSubjectById(subjectId),
          testService.getTestsBySubject(subjectId),
        ]);
        setSubject(subRes.data);
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

  const filteredTests = tests.filter((t) =>
    filterDifficulty === 'ALL' ? true : t.difficulty === filterDifficulty
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="page-band p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/student/subjects" className="inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:underline mb-2 font-semibold">
              <ArrowLeft size={14} /> Back to Subjects
            </Link>
            <h1 className="text-2xl font-extrabold text-theme-primary flex items-center gap-2.5">
              <FileCheck className="text-indigo-500" />
              {subject ? `${subject.name} Mock Tests` : 'All Available Mock Tests'}
            </h1>
            <p className="text-sm text-theme-muted mt-1 font-semibold">Select a test paper to start your live timed MCQ examination</p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-theme-input border border-theme p-1 rounded-xl text-xs self-start sm:self-auto">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterDifficulty === diff ? 'bg-indigo-600 text-white shadow-md' : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Limit Banner */}
      {!isUnlimited && (
        <div className="limit-banner flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Crown size={20} className="text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-theme-primary">
                {planName} Plan — {isUnlimited ? 'Unlimited' : `${monthlyLimit} attempts/month`}
              </p>
              <p className="text-xs text-theme-muted font-semibold">
                Upgrade to Pro or Premium for more attempts and advanced analytics.
              </p>
            </div>
          </div>
          <Link to="/student/subscription" className="btn btn-primary text-xs py-2 px-4 shrink-0">
            <Crown size={14} /> Upgrade Plan
          </Link>
        </div>
      )}

      {filteredTests.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <AlertCircle size={36} className="text-theme-muted mx-auto" />
          <h3 className="text-base font-bold text-theme-primary">No Tests Found</h3>
          <p className="text-sm text-theme-muted">No mock tests available matching the selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all duration-200 hover:shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    test.difficulty === 'EASY'   ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                    test.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                                                   'bg-rose-500/10 text-rose-500 border-rose-500/30'
                  }`}>
                    {test.difficulty}
                  </span>
                  <span className="text-[11px] text-indigo-500 font-bold">{test.subjectName}</span>
                </div>

                <h3 className="text-base font-bold text-theme-primary line-clamp-2">{test.title}</h3>
                <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed font-semibold">{test.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-theme-secondary bg-theme-input p-3 rounded-xl border border-theme">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <FileCheck size={14} className="text-indigo-500" />
                    <span>{test.totalQuestions || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock size={14} className="text-amber-500" />
                    <span>{test.durationMinutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Award size={14} className="text-purple-500" />
                    <span>{test.totalMarks} Marks</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Pass: {test.passingMarks}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/student/exam/${test.id}`)}
                className="w-full btn btn-primary py-2.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <Play size={15} />
                Attempt Test Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockTestPage;

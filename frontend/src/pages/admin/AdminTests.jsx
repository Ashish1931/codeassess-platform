import React, { useState, useEffect } from 'react';
import { testService, subjectService } from '../../services/api';
import { FileCheck, Plus, Edit2, Trash2, X, Save, Eye } from 'lucide-react';

const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTest, setEditTest] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    description: '',
    difficulty: 'EASY',
    durationMinutes: 15,
    totalMarks: 30,
    passingMarks: 18,
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchTestsAndSubjects();
  }, []);

  const fetchTestsAndSubjects = async () => {
    try {
      setLoading(true);
      const subRes = await subjectService.getAllSubjects();
      setSubjects(subRes.data);
      const testRes = await testService.getAllTests();
      setTests(testRes.data);
      if (subRes.data.length > 0 && !formData.subjectId) {
        setFormData((prev) => ({ ...prev, subjectId: subRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch tests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (test = null) => {
    if (test) {
      setEditTest(test);
      setFormData({
        subjectId: test.subjectId,
        title: test.title,
        description: test.description || '',
        difficulty: test.difficulty,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        status: test.status,
      });
    } else {
      setEditTest(null);
      setFormData({
        subjectId: subjects[0]?.id || '',
        title: '',
        description: '',
        difficulty: 'EASY',
        durationMinutes: 15,
        totalMarks: 30,
        passingMarks: 18,
        status: 'DRAFT',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTest) {
        await testService.updateTest(editTest.id, formData);
      } else {
        await testService.createTest(formData);
      }
      setShowModal(false);
      fetchTestsAndSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save test.');
    }
  };

  const handleToggleStatus = async (testId, newStatus) => {
    try {
      await testService.updateTestStatus(testId, newStatus);
      fetchTestsAndSubjects();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await testService.deleteTest(id);
        fetchTestsAndSubjects();
      } catch (err) {
        alert('Failed to delete test.');
      }
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FileCheck className="text-indigo-400" /> Mock Test Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage test duration, passing marks, difficulty, and publish status</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-indigo-500/25"
        >
          <Plus size={16} /> Create New Test
        </button>
      </div>

      <div className="glass-card overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Test Title</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Marks (Pass / Total)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-slate-100">{t.title}</td>
                  <td className="p-4 text-indigo-400 font-semibold">{t.subjectName}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      {t.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{t.durationMinutes} Mins</td>
                  <td className="p-4 text-slate-300">{t.passingMarks} / {t.totalMarks}</td>
                  <td className="p-4">
                    <select
                      value={t.status}
                      onChange={(e) => handleToggleStatus(t.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-[11px] font-bold rounded-lg px-2 py-1 text-slate-200"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="RESULT_PUBLISHED">RESULT PUBLISHED</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(t)}
                        className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
                        title="Edit Test"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        title="Delete Test"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-lg w-full border border-slate-700 shadow-2xl animate-fade-in space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100">
                {editTest ? 'Edit Mock Test' : 'Create New Mock Test'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="form-select"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id} className="bg-slate-900">
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Test Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Data Structures Core Assessment #1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="form-select"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Passing Marks</label>
                  <input
                    type="number"
                    required
                    value={formData.passingMarks}
                    onChange={(e) => setFormData({ ...formData, passingMarks: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Publish Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-select"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="RESULT_PUBLISHED">RESULT PUBLISHED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  <Save size={14} /> {editTest ? 'Save Changes' : 'Create Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTests;

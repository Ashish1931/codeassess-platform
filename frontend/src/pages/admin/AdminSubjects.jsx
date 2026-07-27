import React, { useState, useEffect } from 'react';
import { subjectService } from '../../services/api';
import { BookOpen, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSubject, setEditSubject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    imageUrl: '',
  });

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

  const handleOpenModal = (sub = null) => {
    if (sub) {
      setEditSubject(sub);
      setFormData({
        name: sub.name,
        code: sub.code,
        description: sub.description || '',
        imageUrl: sub.imageUrl || '',
      });
    } else {
      setEditSubject(null);
      setFormData({ name: '', code: '', description: '', imageUrl: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSubject) {
        await subjectService.updateSubject(editSubject.id, formData);
      } else {
        await subjectService.createSubject(formData);
      }
      setShowModal(false);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save subject.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectService.deleteSubject(id);
        fetchSubjects();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete subject.');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-theme pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-theme-primary flex items-center gap-3">
            <BookOpen className="text-indigo-500" size={28} /> Subject Management
          </h1>
          <p className="text-sm font-semibold text-theme-secondary mt-1">Create, edit, or remove programming subjects in the platform catalog</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary text-sm py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-indigo-500/25"
        >
          <Plus size={18} /> Create New Subject
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="cards-grid">
        {subjects.map((s) => (
          <div key={s.id} className="glass-card p-6 flex flex-col justify-between space-y-5 border-theme hover:border-indigo-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
                  {s.code}
                </span>
                <span className="text-xs font-bold text-theme-muted">{s.totalTests || 0} Tests</span>
              </div>

              <h3 className="text-lg font-bold text-theme-primary">{s.name}</h3>
              <p className="text-sm font-semibold text-theme-secondary line-clamp-3 leading-relaxed">{s.description}</p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-theme">
              <button
                onClick={() => handleOpenModal(s)}
                className="flex-1 btn btn-secondary text-sm py-2 flex items-center justify-center gap-2"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-theme transition-colors"
                title="Delete Subject"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full border border-theme shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <h3 className="text-lg font-bold text-theme-primary">
                {editSubject ? 'Edit Subject' : 'Create New Subject'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-theme-muted hover:text-theme-primary">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Data Structures"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. DSA"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Subject overview and topics covered..."
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-sm">
                  <Save size={16} /> {editSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubjects;

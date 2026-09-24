import React, { useState, useEffect } from 'react';
import { questionService, testService } from '../../services/api';
import { HelpCircle, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const AdminQuestions = () => {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  const [formData, setFormData] = useState({
    testId: '',
    questionText: '',
    codeSnippet: '',
    difficulty: 'EASY',
    marks: 10,
    topic: 'Core Concepts',
    explanation: '',
    correctAnswer: 'A',
    options: [
      { optionLabel: 'A', optionText: '' },
      { optionLabel: 'B', optionText: '' },
      { optionLabel: 'C', optionText: '' },
      { optionLabel: 'D', optionText: '' },
    ],
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await testService.getAllTests();
      setTests(res.data);
      if (res.data.length > 0) {
        setSelectedTestId(res.data[0].id);
        fetchQuestions(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch tests', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (tId) => {
    try {
      const res = await questionService.getQuestionsByTest(tId);
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions', err);
    }
  };

  const handleTestChange = (e) => {
    const tId = e.target.value;
    setSelectedTestId(tId);
    fetchQuestions(tId);
  };

  const handleOpenModal = (q = null) => {
    if (q) {
      setEditQuestion(q);
      setFormData({
        testId: q.testId,
        questionText: q.questionText,
        codeSnippet: q.codeSnippet || '',
        difficulty: q.difficulty,
        marks: q.marks,
        topic: q.topic,
        explanation: q.explanation,
        correctAnswer: q.correctAnswer,
        options: q.options || [
          { optionLabel: 'A', optionText: '' },
          { optionLabel: 'B', optionText: '' },
          { optionLabel: 'C', optionText: '' },
          { optionLabel: 'D', optionText: '' },
        ],
      });
    } else {
      setEditQuestion(null);
      setFormData({
        testId: selectedTestId,
        questionText: '',
        codeSnippet: '',
        difficulty: 'EASY',
        marks: 10,
        topic: 'Core Concepts',
        explanation: '',
        correctAnswer: 'A',
        options: [
          { optionLabel: 'A', optionText: '' },
          { optionLabel: 'B', optionText: '' },
          { optionLabel: 'C', optionText: '' },
          { optionLabel: 'D', optionText: '' },
        ],
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editQuestion) {
        await questionService.updateQuestion(editQuestion.id, formData);
      } else {
        await questionService.createQuestion(formData);
      }
      setShowModal(false);
      fetchQuestions(selectedTestId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save question.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this question from question bank?')) {
      try {
        await questionService.deleteQuestion(id);
        fetchQuestions(selectedTestId);
      } catch (err) {
        alert('Failed to delete question.');
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
            <HelpCircle className="text-indigo-400" /> MCQ Question Bank Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Create, update, and organize MCQ questions, code snippets, and solutions</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTestId}
            onChange={handleTestChange}
            className="form-select text-xs w-64"
          >
            {tests.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900">
                {t.title} ({t.subjectName})
              </option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/25"
          >
            <Plus size={16} /> Add New Question
          </button>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="glass-card p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Question #{idx + 1}
                </span>
                <span className="text-xs text-slate-400">Topic: {q.topic}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">{q.marks} Marks</span>
                <button
                  onClick={() => handleOpenModal(q)}
                  className="p-1 rounded-lg text-slate-300 hover:bg-slate-800"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-100">{q.questionText}</h3>

            {q.codeSnippet && (
              <pre className="code-block text-xs border-slate-800">{q.codeSnippet}</pre>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {q.options?.map((opt) => (
                <div
                  key={opt.id || opt.optionLabel}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    q.correctAnswer === opt.optionLabel
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-center leading-6 font-bold text-[11px]">
                    {opt.optionLabel}
                  </span>
                  <span>{opt.optionText}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="font-bold text-indigo-300">Explanation: </span>
              <span className="text-slate-300">{q.explanation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-2xl w-full border border-slate-700 shadow-2xl animate-fade-in space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100">
                {editQuestion ? 'Edit MCQ Question' : 'Add New MCQ Question'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea
                  rows={2}
                  required
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter MCQ statement..."
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.codeSnippet}
                  onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                  placeholder="Paste Java/C++/Python code snippet..."
                  className="form-textarea font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                  <label className="form-label">Marks</label>
                  <input
                    type="number"
                    required
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Arrays"
                    className="form-input"
                  />
                </div>
              </div>

              {/* 4 Options Input */}
              <div className="space-y-3">
                <label className="form-label font-bold text-indigo-400">Options (A, B, C, D)</label>
                {formData.options.map((opt, idx) => (
                  <div key={opt.optionLabel} className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold text-center leading-8 text-xs shrink-0">
                      {opt.optionLabel}
                    </span>
                    <input
                      type="text"
                      required
                      value={opt.optionText}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[idx].optionText = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      placeholder={`Option ${opt.optionLabel} text...`}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Correct Option</label>
                <select
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  className="form-select font-bold text-emerald-400"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Solution Explanation</label>
                <textarea
                  rows={2}
                  required
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why this option is correct..."
                  className="form-textarea"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  <Save size={14} /> {editQuestion ? 'Save Changes' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;

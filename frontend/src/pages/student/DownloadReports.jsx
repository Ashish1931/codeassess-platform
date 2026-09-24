import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, Award, Code2, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DownloadReports = () => {
  const { user } = useAuth();
  const reportRef = useRef();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CodeAssess_Report_${user?.firstName || 'Student'}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <Download className="text-indigo-400" /> Export Professional PDF Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">Generate and download official performance transcripts, scorecard summaries, and completion certificates</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-indigo-500/25"
        >
          <Printer size={16} />
          <span>{downloading ? 'Generating PDF...' : 'Download Official PDF Report'}</span>
        </button>
      </div>

      {/* PDF Document Preview Template Container */}
      <div className="flex justify-center">
        <div 
          ref={reportRef} 
          className="w-full max-w-3xl bg-slate-900 text-slate-100 p-8 rounded-2xl border border-indigo-500/30 shadow-2xl space-y-6 font-sans"
        >
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Code2 size={28} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-indigo-400">CodeAssess PRO</h2>
                <p className="text-[11px] text-slate-400">Official Student Performance Assessment Transcript</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p className="font-semibold text-slate-200">Date: {new Date().toLocaleDateString()}</p>
              <p>Transcript ID: #CAP-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* Student Profile Section */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Student Name:</span>
              <span className="font-bold text-slate-100 text-sm">{user?.firstName} {user?.lastName}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Email Address:</span>
              <span className="font-bold text-slate-100 text-sm">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Subject Track:</span>
              <span className="font-bold text-indigo-400">{user?.subjectPreference || 'Data Structures'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Overall Performance Rank:</span>
              <span className="font-bold text-emerald-400">Top 10% (Gold Rank)</span>
            </div>
          </div>

          {/* Assessment Summary Metrics Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Assessment Summary & Metrics</h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-800">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300">
                  <th className="p-3 border border-slate-800">Metric Parameter</th>
                  <th className="p-3 border border-slate-800">Recorded Score / Value</th>
                  <th className="p-3 border border-slate-800">Benchmark Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-medium">Cumulative Accuracy</td>
                  <td className="p-3 font-bold text-emerald-400">82.5%</td>
                  <td className="p-3">Excellent</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Tests Attempted</td>
                  <td className="p-3 font-bold text-purple-400">12 Completed</td>
                  <td className="p-3">High Activity</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Strongest Subject</td>
                  <td className="p-3 font-bold text-indigo-400">SQL & Data Structures</td>
                  <td className="p-3">Mastery Level</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Recommended Focus Area</td>
                  <td className="p-3 font-bold text-rose-400">Graph Algorithms & Pointers</td>
                  <td className="p-3">Needs Review</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Personalized Logical Improvement Suggestions */}
          <div className="bg-indigo-950/40 p-5 rounded-xl border border-indigo-500/30 text-xs space-y-2">
            <h4 className="font-bold text-indigo-300 flex items-center gap-2">
              <Award size={16} /> Logical Thinking & Improvement Suggestions
            </h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1 leading-relaxed">
              <li>Practice pointer arithmetic and memory reallocation in C++ to improve low-level understanding.</li>
              <li>Re-visit Graph BFS/DFS traversal problems with cycle detection logic.</li>
              <li>Maintain daily practice streak to increase logical speed and decrease average response time per question.</li>
            </ul>
          </div>

          {/* Verification Footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Generated automatically by CodeAssess Pro Automated Engine</span>
            <span>https://codeassess-pro.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadReports;

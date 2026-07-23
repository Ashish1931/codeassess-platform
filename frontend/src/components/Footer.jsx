import React from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 md:px-8 border-t border-slate-700/50 bg-slate-900/60 dark:bg-slate-950/80 text-center text-xs md:text-sm text-slate-400 mt-auto">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-indigo-400" />
          <span className="font-semibold text-slate-200">CodeAssess Pro</span>
          <span>© {new Date().getFullYear()} All Rights Reserved.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 font-medium">
          <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
          <Link to="/documentation" className="hover:text-indigo-400 transition-colors">Documentation</Link>
          <Link to="/support" className="hover:text-indigo-400 transition-colors">Support</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

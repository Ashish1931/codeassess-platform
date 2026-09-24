import React from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

const Footer = () => (
  <footer className="w-full py-5 px-4 md:px-8 border-t border-theme glass-nav mt-auto">
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm">
      <div className="flex items-center gap-2 text-theme-secondary font-semibold">
        <Code2 size={18} className="text-indigo-500" />
        <span className="font-bold text-theme-primary">CodeAssess Pro</span>
        <span>© {new Date().getFullYear()} All Rights Reserved.</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5 text-theme-muted font-semibold">
        <Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms of Service</Link>
        <Link to="/documentation" className="hover:text-indigo-500 transition-colors">Documentation</Link>
        <Link to="/support" className="hover:text-indigo-500 transition-colors">Support</Link>
      </div>
    </div>
  </footer>
);

export default Footer;

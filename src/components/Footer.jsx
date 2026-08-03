import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-8 px-6 mt-20 text-center text-xs text-slate-500 space-y-3">
      <p>&copy; {new Date().getFullYear()} Universal Contract Generator Pro. All rights reserved.</p>
      <div className="flex justify-center space-x-6 font-medium text-slate-400">
        <a 
          href="/privacy-policy" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-blue-400 transition"
        >
          Privacy Policy
        </a>
        <span className="text-slate-700">•</span>
        <a 
          href="/terms-of-service" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-blue-400 transition"
        >
          Terms & Conditions
        </a>
      </div>
    </footer>
  );
}

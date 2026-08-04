import './globals.css';
import { Scale, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden antialiased">
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white block leading-none">Universal Contract</span>
                <span className="text-xs text-blue-400 font-medium tracking-wide">Professional Legal Suite</span>
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}

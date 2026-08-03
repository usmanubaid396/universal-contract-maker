import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, FileText, ArrowRight, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import ContractWizard from './components/ContractWizard';

const contractTemplates = [
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement (NDA)',
    category: 'Business',
    description: 'Protect confidential information, business ideas, and trade secrets when pitching or partnering.',
    keywords: ['nda', 'confidentiality', 'secret', 'protect idea', 'investor pitch', 'privacy', 'non disclosure']
  },
  {
    id: 'freelance',
    title: 'Independent Contractor Agreement',
    category: 'Freelance',
    description: 'Define scope, project deliverables, payment milestones, and deadlines for freelance work.',
    keywords: ['freelance', 'contractor', 'developer agreement', 'designer gig', 'project work', 'client contract', 'service provider']
  },
  {
    id: 'employment',
    title: 'Employment Offer Letter',
    category: 'HR',
    description: 'Standard employment agreement outlining salary, job title, duties, and company policies.',
    keywords: ['hire employee', 'job offer', 'staff contract', 'work agreement', 'salary', 'position', 'hr']
  },
  {
    id: 'lease',
    title: 'Residential Lease Agreement',
    category: 'Real Estate',
    description: 'Establish rental terms, security deposits, monthly rent, and property rules for tenants.',
    keywords: ['rent house', 'tenant lease', 'apartment rental', 'landlord agreement', 'property', 'monthly rent']
  },
  {
    id: 'partnership',
    title: 'Business Partnership Agreement',
    category: 'Business',
    description: 'Outline profit sharing, roles, responsibilities, and dispute resolution for business partners.',
    keywords: ['partner', 'co-founder', 'business split', 'shares', 'company partnership', 'joint venture']
  },
  {
    id: 'sales',
    title: 'Sales of Goods Agreement',
    category: 'Commercial',
    description: 'Contract for buying and selling physical products, delivery terms, and warranties.',
    keywords: ['sell product', 'buying goods', 'purchase contract', 'commercial transaction', 'supplier']
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedContract, setSelectedContract] = useState(null);

  const fuse = useMemo(() => {
    return new Fuse(contractTemplates, {
      keys: ['title', 'description', 'keywords', 'category'],
      threshold: 0.4,
    });
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      if (selectedCategory === 'All') return contractTemplates;
      return contractTemplates.filter(t => t.category === selectedCategory);
    }
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [searchQuery, selectedCategory, fuse]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Decorative 3D Ambient Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => { setSelectedContract(null); setSearchQuery(''); }}
          >
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Universal Contract
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-semibold tracking-wide shadow-inner">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>AI Legal Engine Active</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {!selectedContract ? (
          <>
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs mb-6 shadow-sm">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                <span>Smart Multi-Template Drafting Suite</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-tight">
                Create Any Legal Agreement in Minutes
              </h1>
              <p className="text-slate-400 text-lg sm:text-xl mb-10 font-normal leading-relaxed">
                Search via natural language or random keywords, instantly generate customized terms, add brand logos, and export professional PDFs.
              </p>

              {/* 3D Glass Search Bar */}
              <div className="relative max-w-2xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-md opacity-30 group-hover:opacity-75 transition duration-500 pointer-events-none"></div>
                <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl p-2 backdrop-blur-xl">
                  <Search className="h-5 w-5 text-slate-400 ml-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search random terms e.g., 'hire a developer', 'nda', 'rent property'..."
                    className="w-full px-4 py-3 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base"
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap justify-center gap-2.5 mt-8">
                {['All', 'Business', 'Freelance', 'HR', 'Real Estate', 'Commercial'].map((category) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setSearchQuery(''); }}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === category && !searchQuery
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Template 3D Tilt Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedContract(template)}
                  className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 rounded-3xl p-7 hover:border-blue-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {template.category}
                      </span>
                      <div className="p-2 rounded-xl bg-slate-800/50 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex items-center text-blue-400 text-sm font-bold group-hover:translate-x-1.5 transition-transform duration-300">
                    <span>Build Agreement</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
                <p className="text-slate-400 text-lg mb-4">No matching agreements found for "{searchQuery}".</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
                >
                  View All Templates
                </button>
              </div>
            )}
          </>
        ) : (
          /* Active Contract Wizard Container */
          <ContractWizard 
            template={selectedContract} 
            onBack={() => setSelectedContract(null)} 
          />
        )}
      </main>
    </div>
  );
}

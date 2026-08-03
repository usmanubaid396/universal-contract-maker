import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, FileText, ArrowRight, ShieldCheck, Sparkles, CheckCircle, Scale, Zap, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden">
      
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Professional Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { setSelectedContract(null); setSearchQuery(''); }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">Universal Contract</span>
              <span className="text-xs text-blue-400 font-medium tracking-wide">Builder & Legal Suite</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-300">
            <span className="flex items-center"><Zap className="w-4 h-4 text-amber-400 mr-1.5" /> Instant PDF Export</span>
            <span className="flex items-center"><Lock className="w-4 h-4 text-emerald-400 mr-1.5" /> Secure & Private</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10">
        {!selectedContract ? (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Legal Document Automation</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Draft Any Professional Contract in Seconds
              </h1>
              
              <p className="text-slate-400 text-lg sm:text-xl font-normal leading-relaxed">
                Search via keywords or browse structured templates, customize clauses, add your brand logos, and generate export-ready agreements instantly.
              </p>

              {/* Advanced Search Bar Section */}
              <div className="pt-4">
                <div className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300 pointer-events-none" />
                  <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 shadow-inner">
                    <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search keywords e.g., 'hire a developer', 'nda', 'rent house'..."
                      className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base font-medium"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {['All', 'Business', 'Freelance', 'HR', 'Real Estate', 'Commercial'].map((category) => (
                    <button
                      key={category}
                      onClick={() => { setSelectedCategory(category); setSearchQuery(''); }}
                      className={`px-4.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        selectedCategory === category && !searchQuery
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Grid Section */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FileText className="w-5 h-5 text-blue-500 mr-2" /> Featured Contract Templates
                </h2>
                <span className="text-xs text-slate-400 font-medium">Showing {filteredTemplates.length} templates</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedContract(template)}
                    className="group bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {template.category}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {template.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Fully Customizable
                      </span>
                      <button className="inline-flex items-center text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                        Build Now <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-base mb-4">No matching agreements found for "{searchQuery}".</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
                  >
                    Reset Search & View All
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Active Contract Wizard Container */
          <ContractWizard 
            template={selectedContract} 
            onBack={() => setSelectedContract(null)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Universal Contract Builder. Professional Legal Document Automation Suite.</p>
        </div>
      </footer>

    </div>
  );
}

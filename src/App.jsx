import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, FileText, ArrowRight, Shield } from 'lucide-react';
import ContractWizard from './components/ContractWizard';

// Sample database of contracts with rich keyword tags for fuzzy/random searches
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

  // Initialize Fuse.js for fuzzy and random keyword search
  const fuse = useMemo(() => {
    return new Fuse(contractTemplates, {
      keys: ['title', 'description', 'keywords', 'category'],
      threshold: 0.4, // Allows typos and partial matching
    });
  }, []);

  // Filter templates based on search query or category pills
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      if (selectedCategory === 'All') return contractTemplates;
      return contractTemplates.filter(t => t.category === selectedCategory);
    }
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [searchQuery, selectedCategory, fuse]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setSelectedContract(null); setSearchQuery(''); }}>
            <FileText className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight text-white">Universal Contract Builder</span>
          </div>
          <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-medium">
            AI-Powered Legal Drafting
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!selectedContract ? (
          <>
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Create Any Legal Agreement in Minutes
              </h1>
              <p className="text-slate-400 text-lg mb-8">
                Type what you need in plain words, choose from smart templates, customize clauses, and add your brand logos instantly.
              </p>

              {/* Smart Search Bar */}
              <div className="relative max-w-2xl mx-auto shadow-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type random keywords e.g., 'hire a freelancer', 'nda', 'rent house'..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/90 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {['All', 'Business', 'Freelance', 'HR', 'Real Estate', 'Commercial'].map((category) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setSearchQuery(''); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      selectedCategory === category && !searchQuery
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedContract(template)}
                  className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 hover:bg-slate-800 hover:border-blue-500/50 transition cursor-pointer flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-700 text-blue-400">
                        {template.category}
                      </span>
                      <Shield className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                      {template.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition duration-200">
                    <span>Build Agreement</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400 text-lg mb-4">No matching agreements found for "{searchQuery}".</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition"
                >
                  View All Templates
                </button>
              </div>
            )}
          </>
        ) : (
          /* Active Contract Wizard */
          <ContractWizard 
            template={selectedContract} 
            onBack={() => setSelectedContract(null)} 
          />
        )}
      </main>
    </div>
  );
}

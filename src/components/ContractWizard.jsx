import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, User, Download, Plus, Trash2, Save, Sparkles, Scale, FileText, Stamp, Palette, Shield } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ContractWizard({ template, onBack }) {
  const [activeTab, setActiveTab] = useState('partyA');
  
  // Party A & B states
  const [partyA, setPartyA] = useState({ name: '', representative: '', designation: '', address: '', logo: '', showAdvanced: false, website: '', email: '', phone: '', taxId: '' });
  const [partyB, setPartyB] = useState({ name: '', representative: '', designation: '', address: '', logo: '', showAdvanced: false, website: '', email: '', phone: '', taxId: '' });

  // Contract Metadata & Body
  const [agreementTitle, setAgreementTitle] = useState(template.title);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityPeriod, setValidityPeriod] = useState('1 Year');
  const [contractBody, setContractBody] = useState(template.description);
  
  // Clauses
  const [customClauses, setCustomClauses] = useState([
    'Both parties agree to maintain strict confidentiality regarding all project details.',
    'Any disputes arising from this agreement shall be resolved through mutual negotiation.'
  ]);
  const [newClause, setNewClause] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Legal Setup
  const [governingLaw, setGoverningLaw] = useState('Pakistan');
  const [disputeResolution, setDisputeResolution] = useState('Binding Arbitration');
  const [includeNotary, setIncludeNotary] = useState(true);
  const [includeSealArea, setIncludeSealArea] = useState(true);

  // Formatting, Watermark & Theme Library
  const [watermark, setWatermark] = useState('None (Clean)');
  const [selectedTheme, setSelectedTheme] = useState('Corporate Standard');

  const [saveStatus, setSaveStatus] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Theme styles mapping
  const themes = {
    'Corporate Standard': { font: 'font-serif', primary: 'text-slate-900', border: 'border-slate-200', accent: 'bg-slate-100' },
    'Modern Sans': { font: 'font-sans', primary: 'text-slate-900', border: 'border-slate-300', accent: 'bg-blue-50' },
    'Executive Blue': { font: 'font-serif', primary: 'text-blue-950', border: 'border-blue-200', accent: 'bg-blue-50/50' },
    'Legal Minimalist': { font: 'font-mono', primary: 'text-black', border: 'border-black', accent: 'bg-gray-50' },
    'Crimson Authority': { font: 'font-serif', primary: 'text-rose-950', border: 'border-rose-200', accent: 'bg-rose-50/40' }
  };

  const currentTheme = themes[selectedTheme] || themes['Corporate Standard'];

  useEffect(() => {
    const saved = localStorage.getItem(`pro_max_draft_${template.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.partyA) setPartyA(data.partyA);
        if (data.partyB) setPartyB(data.partyB);
        if (data.agreementTitle) setAgreementTitle(data.agreementTitle);
        if (data.effectiveDate) setEffectiveDate(data.effectiveDate);
        if (data.validityPeriod) setValidityPeriod(data.validityPeriod);
        if (data.contractBody) setContractBody(data.contractBody);
        if (data.customClauses) setCustomClauses(data.customClauses);
        if (data.governingLaw) setGoverningLaw(data.governingLaw);
        if (data.disputeResolution) setDisputeResolution(data.disputeResolution);
        if (data.watermark) setWatermark(data.watermark);
        if (data.selectedTheme) setSelectedTheme(data.selectedTheme);
      } catch (e) {
        console.error('Failed to load draft');
      }
    }
  }, [template.id]);

  const saveDraft = () => {
    const draftData = { partyA, partyB, agreementTitle, effectiveDate, validityPeriod, contractBody, customClauses, governingLaw, disputeResolution, watermark, selectedTheme };
    localStorage.setItem(`pro_max_draft_${template.id}`, JSON.stringify(draftData));
    setSaveStatus('Draft Saved Successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleLogoUpload = (e, party) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (party === 'A') setPartyA({ ...partyA, logo: reader.result });
        else setPartyB({ ...partyB, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addClause = () => {
    if (newClause.trim()) {
      setCustomClauses([...customClauses, newClause.trim()]);
      setNewClause('');
    }
  };

  const removeClause = (index) => {
    setCustomClauses(customClauses.filter((_, i) => i !== index));
  };

  const handleAIGenerateClause = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      let generated = `The parties agree that ${aiPrompt}. Non-compliance may result in immediate termination.`;
      setCustomClauses([...customClauses, generated]);
      setAiPrompt('');
      setIsGeneratingAI(false);
    }, 600);
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('printable-agreement');
    const options = {
      margin: 10,
      filename: `${template.id}-agreement.pdf`,
      image: { type: 'jpeg', quality: 0.90 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save().then(() => {
      setIsDownloading(false);
    }).catch(() => {
      setIsDownloading(false);
      alert('Failed to generate PDF. Please try again.');
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl shadow-xl">
        <button onClick={onBack} className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Library
        </button>

        <div className="flex items-center space-x-3">
          {saveStatus && <span className="text-xs text-emerald-400 font-medium animate-pulse">{saveStatus}</span>}
          <button onClick={saveDraft} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center border border-slate-700 transition">
            <Save className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> Save Draft
          </button>
          <button onClick={handleDownloadPDF} disabled={isDownloading} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center shadow-lg shadow-emerald-600/25 disabled:opacity-50">
            <Download className="h-4 w-4 mr-1.5" /> {isDownloading ? 'Exporting...' : 'Export to PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Configuration Tabs */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Document Generator Pro</h2>
            <p className="text-xs text-slate-400">Configure formatting, watermarks, and clauses.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'partyA', label: 'First Party' },
              { id: 'partyB', label: 'Second Party' },
              { id: 'text', label: 'Text' },
              { id: 'legal', label: 'Legal' },
              { id: 'watermark', label: 'Watermark' },
              { id: 'themes', label: 'Themes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: FIRST PARTY */}
          {activeTab === 'partyA' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><Building2 className="h-4 w-4 mr-1.5" /> First Party Details</h3>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company Logo</label>
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'A')} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer bg-slate-950 rounded-xl border border-slate-800 p-1" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company Name</label>
                <input type="text" value={partyA.name} onChange={(e) => setPartyA({...partyA, name: e.target.value})} placeholder="Your Company Name Ltd." className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Representative</label>
                  <input type="text" value={partyA.representative} onChange={(e) => setPartyA({...partyA, representative: e.target.value})} placeholder="John Doe" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Designation</label>
                  <input type="text" value={partyA.designation} onChange={(e) => setPartyA({...partyA, designation: e.target.value})} placeholder="CEO" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Address</label>
                <input type="text" value={partyA.address} onChange={(e) => setPartyA({...partyA, address: e.target.value})} placeholder="123 Business Ave" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <button onClick={() => setPartyA({...partyA, showAdvanced: !partyA.showAdvanced})} className="text-xs text-blue-400 hover:underline font-semibold pt-1 block">
                {partyA.showAdvanced ? '- Hide Advanced Info' : '+ Add Advanced Contact Info'}
              </button>
              {partyA.showAdvanced && (
                <div className="space-y-3 pt-2 border-t border-slate-800 bg-slate-950/40 p-3 rounded-xl">
                  <input type="text" value={partyA.website} onChange={(e) => setPartyA({...partyA, website: e.target.value})} placeholder="Website URL" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <input type="email" value={partyA.email} onChange={(e) => setPartyA({...partyA, email: e.target.value})} placeholder="Official Email" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <input type="text" value={partyA.phone} onChange={(e) => setPartyA({...partyA, phone: e.target.value})} placeholder="Phone Number" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <input type="text" value={partyA.taxId} onChange={(e) => setPartyA({...partyA, taxId: e.target.value})} placeholder="Tax ID / Registration Number" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SECOND PARTY */}
          {activeTab === 'partyB' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><User className="h-4 w-4 mr-1.5" /> Second Party Details</h3>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company Logo</label>
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 'B')} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer bg-slate-950 rounded-xl border border-slate-800 p-1" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Partner Organization</label>
                <input type="text" value={partyB.name} onChange={(e) => setPartyB({...partyB, name: e.target.value})} placeholder="Partner Organization Inc." className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Representative</label>
                  <input type="text" value={partyB.representative} onChange={(e) => setPartyB({...partyB, representative: e.target.value})} placeholder="Jane Smith" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Designation</label>
                  <input type="text" value={partyB.designation} onChange={(e) => setPartyB({...partyB, designation: e.target.value})} placeholder="Director" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Address</label>
                <input type="text" value={partyB.address} onChange={(e) => setPartyB({...partyB, address: e.target.value})} placeholder="456 Corporate Blvd" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <button onClick={() => setPartyB({...partyB, showAdvanced: !partyB.showAdvanced})} className="text-xs text-blue-400 hover:underline font-semibold pt-1 block">
                {partyB.showAdvanced ? '- Hide Advanced Info' : '+ Add Advanced Contact Info'}
              </button>
              {partyB.showAdvanced && (
                <div className="space-y-3 pt-2 border-t border-slate-800 bg-slate-950/40 p-3 rounded-xl">
                  <input type="text" value={partyB.website} onChange={(e) => setPartyB({...partyB, website: e.target.value})} placeholder="Website URL" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <input type="email" value={partyB.email} onChange={(e) => setPartyB({...partyB, email: e.target.value})} placeholder="Official Email" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <input type="text" value={partyB.phone} onChange={(e) => setPartyB({...partyB, phone: e.target.value})} placeholder="Phone Number" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <input type="text" value={partyB.taxId} onChange={(e) => setPartyB({...partyB, taxId: e.target.value})} placeholder="Tax ID / Registration Number" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEXT & CLAUSES */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><FileText className="h-4 w-4 mr-1.5" /> Text & Clauses</h3>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Agreement Title</label>
                <input type="text" value={agreementTitle} onChange={(e) => setAgreementTitle(e.target.value)} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Effective Date</label>
                  <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Validity Period</label>
                  <input type="text" value={validityPeriod} onChange={(e) => setValidityPeriod(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Main Scope</label>
                <textarea rows={3} value={contractBody} onChange={(e) => setContractBody(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 p-3 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-blue-400 flex items-center"><Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" /> AI Clause Writer</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. advance deposit..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <button onClick={handleAIGenerateClause} disabled={isGeneratingAI} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Add</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Custom Clauses</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {customClauses.map((clause, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <span className="text-slate-300 pr-2"><strong>{idx + 1}.</strong> {clause}</span>
                      <button onClick={() => removeClause(idx)} className="text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input type="text" placeholder="Add clause..." value={newClause} onChange={(e) => setNewClause(e.target.value)} className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                  <button onClick={addClause} className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL SETUP */}
          {activeTab === 'legal' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><Scale className="h-4 w-4 mr-1.5" /> Legal Setup</h3>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Governing Jurisdiction</label>
                <input type="text" value={governingLaw} onChange={(e) => setGoverningLaw(e.target.value)} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Dispute Resolution</label>
                <select value={disputeResolution} onChange={(e) => setDisputeResolution(e.target.value)} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="Binding Arbitration">Binding Arbitration</option>
                  <option value="Civil Litigation in Local Courts">Civil Litigation in Local Courts</option>
                  <option value="Mutual Negotiation & Mediation">Mutual Negotiation & Mediation</option>
                </select>
              </div>
              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeNotary} onChange={(e) => setIncludeNotary(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600" />
                  <span>Include Witness / Notary Public Block</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeSealArea} onChange={(e) => setIncludeSealArea(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600" />
                  <span>Include Company Stamp & Seal Box</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: WATERMARK */}
          {activeTab === 'watermark' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><Stamp className="h-4 w-4 mr-1.5" /> Document Watermark</h3>
              <p className="text-xs text-slate-400">Select an overlay watermark for the document preview and PDF export.</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {['None (Clean)', 'DRAFT', 'CONFIDENTIAL', 'REVIEW COPY'].map((wm) => (
                  <button
                    key={wm}
                    onClick={() => setWatermark(wm)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                      watermark === wm ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {wm}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: THEME LIBRARY */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><Palette className="h-4 w-4 mr-1.5" /> Theme Library</h3>
              <p className="text-xs text-slate-400">Choose a professional aesthetic palette and font styling.</p>
              <div className="space-y-2.5 pt-2">
                {Object.keys(themes).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setSelectedTheme(themeName)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      selectedTheme === themeName ? 'bg-blue-600/10 border-blue-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{themeName}</p>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">The quick brown fox jumps over the lazy dog.</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border border-slate-600 ${selectedTheme === themeName ? 'bg-blue-500' : 'bg-slate-800'}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Professional Live Legal Document Preview */}
        <div id="printable-agreement" className={`lg:col-span-7 bg-white rounded-3xl p-10 shadow-2xl relative border ${currentTheme.border} ${currentTheme.font} ${currentTheme.primary} space-y-6 overflow-hidden`}>
          
          {/* Watermark Overlay */}
          {watermark !== 'None (Clean)' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.07]">
              <span className="text-8xl font-black uppercase tracking-widest text-black rotate-[-30deg]">
                {watermark}
              </span>
            </div>
          )}

          <div className="relative z-10 space-y-6">
            {/* Header Logos & Title */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-6">
              <div className="w-32">
                {partyA.logo ? <img src={partyA.logo} alt="Logo A" className="h-12 object-contain" /> : <div className="text-[9px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 text-center rounded bg-slate-50">[Company Logo]</div>}
              </div>
              <div className="text-center font-sans px-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Binding Master Agreement</h4>
                <p className="text-sm font-extrabold mt-0.5">{agreementTitle}</p>
              </div>
              <div className="w-32 text-right">
                {partyB.logo ? <img src={partyB.logo} alt="Logo B" className="h-12 object-contain ml-auto" /> : <div className="text-[9px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 text-center rounded bg-slate-50">[Partner Logo]</div>}
              </div>
            </div>

            {/* Intro Paragraph */}
            <div className="text-xs font-sans leading-relaxed space-y-4">
              <p>
                This <strong>{agreementTitle}</strong> ("Agreement") is entered into and made effective as of <strong>{effectiveDate}</strong>, with a validity duration of <strong>{validityPeriod}</strong>, by and between the following authorized entities:
              </p>

              {/* Parties Box */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3.5 rounded-xl border ${currentTheme.border} ${currentTheme.accent} space-y-1`}>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">First Party (Issuer)</p>
                  <p className="font-bold text-xs">{partyA.name || '[Company Name]'}</p>
                  <p className="text-slate-600 text-[10px]">Rep: {partyA.representative || '[Name]'} ({partyA.designation || 'CEO'})</p>
                  <p className="text-slate-600 text-[10px]">Location: {partyA.address || '[Address]'}</p>
                  {partyA.showAdvanced && partyA.taxId && <p className="text-slate-600 text-[10px]">Tax ID: {partyA.taxId}</p>}
                </div>

                <div className={`p-3.5 rounded-xl border ${currentTheme.border} ${currentTheme.accent} space-y-1`}>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Second Party (Recipient)</p>
                  <p className="font-bold text-xs">{partyB.name || '[Partner Name]'}</p>
                  <p className="text-slate-600 text-[10px]">Rep: {partyB.representative || '[Name]'} ({partyB.designation || 'Director'})</p>
                  <p className="text-slate-600 text-[10px]">Location: {partyB.address || '[Address]'}</p>
                  {partyB.showAdvanced && partyB.taxId && <p className="text-slate-600 text-[10px]">Tax ID: {partyB.taxId}</p>}
                </div>
              </div>

              {/* Scope */}
              <div>
                <h5 className="font-bold text-xs mb-1">1. Purpose & Scope</h5>
                <p className="text-slate-700">{contractBody}</p>
              </div>

              {/* Clauses */}
              <div>
                <h5 className="font-bold text-xs mb-1.5">2. Terms, Conditions & Clauses</h5>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
                  {customClauses.map((clause, idx) => (
                    <li key={idx} className="pl-1">{clause}</li>
                  ))}
                </ol>
              </div>

              {/* Legal Setup & Dispute Resolution */}
              <div>
                <h5 className="font-bold text-xs mb-1">3. Governing Law & Dispute Resolution</h5>
                <p className="text-slate-700">
                  This Agreement shall be governed by the laws of <strong>{governingLaw}</strong>. Any unresolved disputes shall be settled through <strong>{disputeResolution}</strong>.
                </p>
              </div>
            </div>

            {/* Execution Signatures & Stamp Blocks */}
            <div className="pt-8 border-t border-slate-200 font-sans text-xs space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <p className="font-bold mb-1">For: {partyA.name || 'First Party'}</p>
                    <div className="h-14 border-b border-slate-400 flex items-end pb-1">
                      <span className="text-[10px] text-slate-400 italic">Authorized Signature & Date</span>
                    </div>
                  </div>
                  {includeSealArea && (
                    <div className="w-28 h-28 border border-dashed border-slate-400 rounded-full flex flex-col items-center justify-center text-center p-2 text-slate-400 text-[9px]">
                      <Stamp className="h-5 w-5 mb-1 text-slate-300" />
                      <span>[ Company Stamp / Seal ]</span>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <div>
                    <p className="font-bold mb-1">For: {partyB.name || 'Second Party'}</p>
                    <div className="h-14 border-b border-slate-400 flex items-end pb-1">
                      <span className="text-[10px] text-slate-400 italic">Authorized Signature & Date</span>
                    </div>
                  </div>
                  {includeSealArea && (
                    <div className="w-28 h-28 border border-dashed border-slate-400 rounded-full flex flex-col items-center justify-center text-center p-2 text-slate-400 text-[9px]">
                      <Stamp className="h-5 w-5 mb-1 text-slate-300" />
                      <span>[ Partner Seal ]</span>
                    </div>
                  )}
                </div>
              </div>

              {includeNotary && (
                <div className="pt-4 border-t border-dashed border-slate-300 grid grid-cols-2 gap-10 text-[11px]">
                  <div>
                    <p className="font-semibold text-slate-700">Witness 1:</p>
                    <div className="h-10 border-b border-slate-400 mt-2"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Witness 2 / Notary Public:</p>
                    <div className="h-10 border-b border-slate-400 mt-2"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, User, Download, Plus, Trash2, Save, Sparkles, Scale, FileText, Stamp, Palette, Search } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ContractWizard({ template, onBack }) {
  const [activeTab, setActiveTab] = useState('partyA');
  
  // Party A & B states with custom dynamic fields support
  const [partyA, setPartyA] = useState({ 
    name: '', representative: '', designation: '', address: '', logo: '', 
    showAdvanced: false, website: '', email: '', phone: '', taxId: '',
    customFields: [] 
  });
  
  const [partyB, setPartyB] = useState({ 
    name: '', representative: '', designation: '', address: '', logo: '', 
    showAdvanced: false, website: '', email: '', phone: '', taxId: '',
    customFields: [] 
  });

  const addPartyCustomField = (partyKey) => {
    if (partyKey === 'A') {
      setPartyA({ ...partyA, customFields: [...partyA.customFields, { label: '', value: '' }] });
    } else {
      setPartyB({ ...partyB, customFields: [...partyB.customFields, { label: '', value: '' }] });
    }
  };

  const updatePartyCustomField = (partyKey, index, fieldKey, val) => {
    if (partyKey === 'A') {
      const updated = [...partyA.customFields];
      updated[index][fieldKey] = val;
      setPartyA({ ...partyA, customFields: updated });
    } else {
      const updated = [...partyB.customFields];
      updated[index][fieldKey] = val;
      setPartyB({ ...partyB, customFields: updated });
    }
  };

  const removePartyCustomField = (partyKey, index) => {
    if (partyKey === 'A') {
      setPartyA({ ...partyA, customFields: partyA.customFields.filter((_, i) => i !== index) });
    } else {
      setPartyB({ ...partyB, customFields: partyB.customFields.filter((_, i) => i !== index) });
    }
  };

  // Check if current agreement template actually requires legal setup & dispute options
  // (e.g. strict business, commercial, employment, vendor, service, financial contracts)
  const templateTitleLower = (template.title || '').toLowerCase();
  const templateDescLower = (template.description || '').toLowerCase();
  
  const isCasualOrNonLegalTemplate = 
    templateTitleLower.includes('thank') || 
    templateTitleLower.includes('birthday') || 
    templateTitleLower.includes('note') || 
    templateTitleLower.includes('invitation') || 
    templateTitleLower.includes('casual') || 
    templateTitleLower.includes('personal letter') ||
    templateDescLower.includes('informal') ||
    templateDescLower.includes('personal greeting');

  const requiresLegalSetup = !isCasualOrNonLegalTemplate;

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

  // Legal Setup & Dispute Options (Only for eligible templates)
  const [governingLaw, setGoverningLaw] = useState('Pakistan');
  const [disputeResolution, setDisputeResolution] = useState('Binding Arbitration');
  const [disputeSearchQuery, setDisputeSearchQuery] = useState('');
  
  const disputeTypesList = [
    'Direct negotiation', 'Informal discussion', 'Internal complaint procedure', 'Manager-led resolution',
    'Workplace grievance procedure', 'Internal appeal', 'Settlement discussion', 'Settlement conference',
    'Without-prejudice negotiation', 'Demand letter / letter before action', 'Mediation', 'Facilitative mediation',
    'Evaluative mediation', 'Transformative mediation', 'Narrative mediation', 'Online mediation',
    'Court-annexed mediation', 'Employment mediation', 'Family mediation', 'Community mediation',
    'Commercial mediation', 'Conciliation', 'Pre-claim conciliation', 'Shuttle diplomacy',
    'Facilitated negotiation', 'Neutral evaluation', 'Early neutral evaluation (ENE)', 'Case evaluation',
    'Mini-trial', 'Expert determination', 'Independent valuation', 'Dispute review board (DRB)',
    'Dispute adjudication board (DAB)', 'Technical adjudication', 'Ombuds / ombudsman process', 'Independent investigation',
    'Fact-finding', 'Special master or referee review', 'Arbitration', 'Domestic arbitration',
    'International commercial arbitration', 'Institutional arbitration', 'Ad hoc arbitration', 'Expedited arbitration',
    'Emergency arbitration', 'Documents-only arbitration', 'Baseball arbitration / final-offer arbitration', 'Interest arbitration',
    'Rights arbitration / grievance arbitration', 'Labour arbitration', 'Consumer arbitration', 'Construction arbitration',
    'Investment treaty arbitration', 'Sports arbitration', 'Domain-name arbitration', 'Med-arb',
    'Arb-med', 'Arb-med-arb', 'Adjudication', 'Statutory adjudication',
    'Civil court litigation', 'Commercial court litigation', 'Small-claims court', 'Employment tribunal',
    'Labour court', 'Administrative tribunal', 'Administrative hearing', 'Wage claim / labour-standards claim',
    'Labour inspectorate complaint', 'Human-rights or equality commission complaint', 'Consumer-protection authority complaint', 'Data-protection authority complaint',
    'Financial ombudsman complaint', 'Housing tribunal / tenancy board', 'Tax appeal or tax tribunal', 'Social-security appeal',
    'Immigration appeal', 'Public procurement challenge', 'Judicial review', 'Appeal',
    'Reconsideration / review', 'Enforcement proceeding', 'Injunction or interim-relief application', 'Collective bargaining grievance procedure',
    'Works council consultation/dispute process', 'Professional-body complaint', 'Medical malpractice or healthcare complaint process', 'Insurance appraisal process',
    'Chargeback process', 'Platform dispute process', 'E-commerce online dispute resolution (ODR)', 'Cross-border mediation',
    'Choice-of-court agreement', 'Forum-selection clause process', 'Recognition and enforcement of foreign judgment', 'Recognition and enforcement of arbitral award',
    'Diplomatic protection / state-to-state process', 'Interstate dispute settlement', 'International Court of Justice proceedings', 'World Trade Organization dispute settlement',
    'Investor–state conciliation', 'Treaty-based claims commission'
  ];

  const filteredDisputeTypes = disputeTypesList.filter(type => 
    type.toLowerCase().includes(disputeSearchQuery.toLowerCase())
  );

  // Checkboxes for Clauses and Blocks
  const [includeGoverningLawClause, setIncludeGoverningLawClause] = useState(true);
  const [includeSeverabilityClause, setIncludeSeverabilityClause] = useState(true);
  const [includeEntireAgreementClause, setIncludeEntireAgreementClause] = useState(true);
  const [includeConfidentialityClause, setIncludeConfidentialityClause] = useState(true);
  const [includeLimitationOfLiability, setIncludeLimitationOfLiability] = useState(true);
  const [includeForceMajeure, setIncludeForceMajeure] = useState(true);
  const [includeNotary, setIncludeNotary] = useState(true);
  const [includeSealArea, setIncludeSealArea] = useState(true);

  // Watermark
  const [watermark, setWatermark] = useState('None (Clean)');

  // 50+ Professional Color Palettes
  const colorThemes = {
    'Classic Slate': { primary: 'text-slate-900', border: 'border-slate-200', accent: 'bg-slate-50' },
    'Executive Navy': { primary: 'text-blue-950', border: 'border-blue-200', accent: 'bg-blue-50/50' },
    'Forest Green': { primary: 'text-emerald-950', border: 'border-emerald-200', accent: 'bg-emerald-50/50' },
    'Royal Burgundy': { primary: 'text-rose-950', border: 'border-rose-200', accent: 'bg-rose-50/50' },
    'Midnight Charcoal': { primary: 'text-gray-900', border: 'border-gray-300', accent: 'bg-gray-100' },
    'Amber Prestige': { primary: 'text-amber-950', border: 'border-amber-200', accent: 'bg-amber-50/50' },
    'Sapphire Blue': { primary: 'text-sky-950', border: 'border-sky-200', accent: 'bg-sky-50/50' },
    'Crimson Authority': { primary: 'text-red-950', border: 'border-red-200', accent: 'bg-red-50/50' },
    'Deep Indigo': { primary: 'text-indigo-950', border: 'border-indigo-200', accent: 'bg-indigo-50/50' },
    'Violet Sovereign': { primary: 'text-purple-950', border: 'border-purple-200', accent: 'bg-purple-50/50' },
    'Teal Executive': { primary: 'text-teal-950', border: 'border-teal-200', accent: 'bg-teal-50/50' },
    'Cyan Trust': { primary: 'text-cyan-950', border: 'border-cyan-200', accent: 'bg-cyan-50/50' },
    'Olive Professional': { primary: 'text-lime-950', border: 'border-lime-200', accent: 'bg-lime-50/50' },
    'Bronze Enterprise': { primary: 'text-orange-950', border: 'border-orange-200', accent: 'bg-orange-50/50' },
    'Zinc Minimalist': { primary: 'text-zinc-900', border: 'border-zinc-200', accent: 'bg-zinc-50' },
    'Stone Neutral': { primary: 'text-stone-900', border: 'border-stone-200', accent: 'bg-stone-50' },
    'Neutral Corporate': { primary: 'text-neutral-900', border: 'border-neutral-200', accent: 'bg-neutral-50' },
    'Fuchsia Royalty': { primary: 'text-fuchsia-950', border: 'border-fuchsia-200', accent: 'bg-fuchsia-50/50' },
    'Pink Executive': { primary: 'text-pink-950', border: 'border-pink-200', accent: 'bg-pink-50/50' },
    'Warm Copper': { primary: 'text-yellow-950', border: 'border-yellow-200', accent: 'bg-yellow-50/50' },
    'Steel Blue': { primary: 'text-blue-900', border: 'border-blue-300', accent: 'bg-blue-50' },
    'Mint Official': { primary: 'text-emerald-900', border: 'border-emerald-300', accent: 'bg-emerald-50' },
    'Slate Professional': { primary: 'text-slate-800', border: 'border-slate-300', accent: 'bg-slate-100' },
    'Navy Formal': { primary: 'text-blue-900', border: 'border-blue-400', accent: 'bg-blue-50/80' },
    'Charcoal Legal': { primary: 'text-gray-800', border: 'border-gray-400', accent: 'bg-gray-50' },
    'Green Governance': { primary: 'text-green-950', border: 'border-green-200', accent: 'bg-green-50/50' },
    'Red Compliance': { primary: 'text-rose-900', border: 'border-rose-300', accent: 'bg-rose-50' },
    'Purple Protocol': { primary: 'text-purple-900', border: 'border-purple-300', accent: 'bg-purple-50' },
    'Teal Standard': { primary: 'text-teal-900', border: 'border-teal-300', accent: 'bg-teal-50' },
    'Orange Enterprise': { primary: 'text-orange-900', border: 'border-orange-300', accent: 'bg-orange-50' },
    'Sky Corporate': { primary: 'text-sky-900', border: 'border-sky-300', accent: 'bg-sky-50' },
    'Indigo Master': { primary: 'text-indigo-900', border: 'border-indigo-300', accent: 'bg-indigo-50' },
    'Emerald Trust': { primary: 'text-emerald-900', border: 'border-emerald-400', accent: 'bg-emerald-50' },
    'Amber Legal': { primary: 'text-amber-900', border: 'border-amber-300', accent: 'bg-amber-50' },
    'Rose Governance': { primary: 'text-rose-900', border: 'border-rose-300', accent: 'bg-rose-50' },
    'Cyan Official': { primary: 'text-cyan-900', border: 'border-cyan-300', accent: 'bg-cyan-50' },
    'Zinc Corporate': { primary: 'text-zinc-800', border: 'border-zinc-300', accent: 'bg-zinc-100' },
    'Stone Executive': { primary: 'text-stone-800', border: 'border-stone-300', accent: 'bg-stone-100' },
    'Neutral Legal': { primary: 'text-neutral-800', border: 'border-neutral-300', accent: 'bg-neutral-100' },
    'Blue Sovereign': { primary: 'text-blue-950', border: 'border-blue-400', accent: 'bg-blue-100/50' },
    'Slate Authority': { primary: 'text-slate-950', border: 'border-slate-400', accent: 'bg-slate-100/80' },
    'Charcoal Enterprise': { primary: 'text-gray-950', border: 'border-gray-400', accent: 'bg-gray-100/80' },
    'Green Sovereign': { primary: 'text-emerald-950', border: 'border-emerald-400', accent: 'bg-emerald-100/50' },
    'Burgundy Authority': { primary: 'text-rose-950', border: 'border-rose-400', accent: 'bg-rose-100/50' },
    'Indigo Sovereign': { primary: 'text-indigo-950', border: 'border-indigo-400', accent: 'bg-indigo-100/50' },
    'Amber Sovereign': { primary: 'text-amber-950', border: 'border-amber-400', accent: 'bg-amber-100/50' },
    'Violet Sovereign': { primary: 'text-purple-950', border: 'border-purple-400', accent: 'bg-purple-100/50' },
    'Teal Sovereign': { primary: 'text-teal-950', border: 'border-teal-400', accent: 'bg-teal-100/50' },
    'Cyan Sovereign': { primary: 'text-cyan-950', border: 'border-cyan-400', accent: 'bg-cyan-100/50' },
    'Classic Black': { primary: 'text-black', border: 'border-black', accent: 'bg-gray-50' }
  };
  const [selectedColorTheme, setSelectedColorTheme] = useState('Classic Slate');

  const currentColor = colorThemes[selectedColorTheme] || colorThemes['Classic Slate'];

  const [saveStatus, setSaveStatus] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`pro_conditional_legal_${template.id}`);
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
        if (data.selectedColorTheme) setSelectedColorTheme(data.selectedColorTheme);
        if (data.includeGoverningLawClause !== undefined) setIncludeGoverningLawClause(data.includeGoverningLawClause);
        if (data.includeSeverabilityClause !== undefined) setIncludeSeverabilityClause(data.includeSeverabilityClause);
        if (data.includeEntireAgreementClause !== undefined) setIncludeEntireAgreementClause(data.includeEntireAgreementClause);
        if (data.includeConfidentialityClause !== undefined) setIncludeConfidentialityClause(data.includeConfidentialityClause);
        if (data.includeLimitationOfLiability !== undefined) setIncludeLimitationOfLiability(data.includeLimitationOfLiability);
        if (data.includeForceMajeure !== undefined) setIncludeForceMajeure(data.includeForceMajeure);
      } catch (e) {
        console.error('Failed to load draft');
      }
    }
  }, [template.id]);

  const saveDraft = () => {
    const draftData = { 
      partyA, partyB, agreementTitle, effectiveDate, validityPeriod, contractBody, 
      customClauses, governingLaw, disputeResolution, watermark, selectedColorTheme,
      includeGoverningLawClause, includeSeverabilityClause, includeEntireAgreementClause,
      includeConfidentialityClause, includeLimitationOfLiability, includeForceMajeure 
    };
    localStorage.setItem(`pro_conditional_legal_${template.id}`, JSON.stringify(draftData));
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
            <p className="text-xs text-slate-400">
              {requiresLegalSetup ? 'Commercial/Legal Agreement Mode: Includes Dispute & Jurisdiction controls.' : 'Standard Document Mode: Legal options omitted for non-legal template type.'}
            </p>
          </div>

          {/* Navigation Tabs (Conditional Legal tab) */}
          <div className={`grid ${requiresLegalSetup ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800`}>
            {[
              { id: 'partyA', label: 'Party A' },
              { id: 'partyB', label: 'Party B' },
              { id: 'text', label: 'Text' },
              ...(requiresLegalSetup ? [{ id: 'legal', label: 'Legal' }] : []),
              { id: 'watermark', label: 'Watermark' },
              { id: 'colors', label: 'Colors' }
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
                  
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300">Custom Fields:</p>
                    {partyA.customFields.map((cf, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" placeholder="Label" value={cf.label} onChange={(e) => updatePartyCustomField('A', idx, 'label', e.target.value)} className="w-1/3 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white" />
                        <input type="text" placeholder="Value" value={cf.value} onChange={(e) => updatePartyCustomField('A', idx, 'value', e.target.value)} className="flex-1 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white" />
                        <button onClick={() => removePartyCustomField('A', idx)} className="text-red-400 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => addPartyCustomField('A')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Line
                    </button>
                  </div>
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
                  
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <p className="text-[11px] font-bold text-slate-300">Custom Fields:</p>
                    {partyB.customFields.map((cf, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" placeholder="Label" value={cf.label} onChange={(e) => updatePartyCustomField('B', idx, 'label', e.target.value)} className="w-1/3 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white" />
                        <input type="text" placeholder="Value" value={cf.value} onChange={(e) => updatePartyCustomField('B', idx, 'value', e.target.value)} className="flex-1 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white" />
                        <button onClick={() => removePartyCustomField('B', idx)} className="text-red-400 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => addPartyCustomField('B')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Custom Line
                    </button>
                  </div>
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

          {/* TAB 4: LEGAL SETUP (Only rendered if requiresLegalSetup is true) */}
          {activeTab === 'legal' && requiresLegalSetup && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><Scale className="h-4 w-4 mr-1.5" /> Legal Setup & Dispute Search</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Governing Jurisdiction Country / State</label>
                <input type="text" value={governingLaw} onChange={(e) => setGoverningLaw(e.target.value)} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>

              {/* SEARCHABLE DISPUTE RESOLUTION TYPES (102 Types) */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold text-blue-400 flex items-center">
                  <Search className="h-3.5 w-3.5 mr-1" /> Search & Select Dispute Method (102 types)
                </label>
                <input 
                  type="text" 
                  placeholder="Search keywords (e.g. mediation, arbitration, tribunal)..." 
                  value={disputeSearchQuery} 
                  onChange={(e) => setDisputeSearchQuery(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 pt-1">
                  {filteredDisputeTypes.map((dt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDisputeResolution(dt)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                        disputeResolution === dt ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {dt}
                    </button>
                  ))}
                  {filteredDisputeTypes.length === 0 && (
                    <p className="text-[11px] text-slate-500 text-center py-2">No dispute method found.</p>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 pt-1">Selected: <strong className="text-amber-400">{disputeResolution}</strong></p>
              </div>

              {/* SELECTABLE BLUE TICK CLAUSES */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-300">Select Standard Legal Clauses to Include:</p>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeGoverningLawClause} onChange={(e) => setIncludeGoverningLawClause(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Governing Law & Jurisdiction Clause</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeSeverabilityClause} onChange={(e) => setIncludeSeverabilityClause(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Severability Clause</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeEntireAgreementClause} onChange={(e) => setIncludeEntireAgreementClause(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Entire Agreement Clause</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeConfidentialityClause} onChange={(e) => setIncludeConfidentialityClause(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Confidentiality & Non-Disclosure Clause</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeLimitationOfLiability} onChange={(e) => setIncludeLimitationOfLiability(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Limitation of Liability Clause</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeForceMajeure} onChange={(e) => setIncludeForceMajeure(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Force Majeure Clause</span>
                </label>
              </div>

              {/* EXECUTION BLOCKS & STAMP AREAS */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-300">Execution Blocks & Stamp Areas:</p>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeNotary} onChange={(e) => setIncludeNotary(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Include Witness / Notary Public Block</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={includeSealArea} onChange={(e) => setIncludeSealArea(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                  <span>Include Company Stamp & Seal Box</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB: WATERMARK */}
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

          {/* TAB: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><Palette className="h-4 w-4 mr-1.5" /> 50+ Professional Color Palettes</h3>
              <p className="text-xs text-slate-400">Choose from 50+ professional executive color palettes.</p>
              <div className="space-y-2 pt-2 max-h-96 overflow-y-auto pr-1">
                {Object.keys(colorThemes).map((colorName) => (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColorTheme(colorName)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      selectedColorTheme === colorName ? 'bg-blue-600/10 border-blue-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{colorName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Executive border & title tone</p>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border border-slate-600 ${selectedColorTheme === colorName ? 'bg-blue-500' : 'bg-slate-800'}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Professional Live Legal Document Preview */}
        <div id="printable-agreement" className={`lg:col-span-7 bg-white rounded-3xl p-10 shadow-2xl relative border ${currentColor.border} font-serif ${currentColor.primary} space-y-6 overflow-hidden`}>
          
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
            <div className={`flex justify-between items-center border-b ${currentColor.border} pb-6`}>
              <div className="w-32">
                {partyA.logo ? <img src={partyA.logo} alt="Logo A" className="h-12 object-contain" /> : <div className="text-[9px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 text-center rounded bg-slate-50">[Company Logo]</div>}
              </div>
              <div className="text-center font-sans px-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {requiresLegalSetup ? 'Binding Master Agreement' : 'Document Statement'}
                </h4>
                <p className="text-sm font-extrabold mt-0.5">{agreementTitle}</p>
              </div>
              <div className="w-32 text-right">
                {partyB.logo ? <img src={partyB.logo} alt="Logo B" className="h-12 object-contain ml-auto" /> : <div className="text-[9px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 text-center rounded bg-slate-50">[Partner Logo]</div>}
              </div>
            </div>

            {/* Intro Paragraph */}
            <div className="text-xs font-sans leading-relaxed space-y-4">
              <p>
                This <strong>{agreementTitle}</strong> is entered into and made effective as of <strong>{effectiveDate}</strong>, with a validity duration of <strong>{validityPeriod}</strong>, by and between the following authorized entities:
              </p>

              {/* Parties Box with Custom User Added Lines */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3.5 rounded-xl border ${currentColor.border} ${currentColor.accent} space-y-1`}>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">First Party (Issuer)</p>
                  <p className="font-bold text-xs">{partyA.name || '[Company Name]'}</p>
                  <p className="text-slate-600 text-[10px]">Rep: {partyA.representative || '[Name]'} ({partyA.designation || 'CEO'})</p>
                  <p className="text-slate-600 text-[10px]">Location: {partyA.address || '[Address]'}</p>
                  {partyA.showAdvanced && partyA.taxId && <p className="text-slate-600 text-[10px]">Tax ID: {partyA.taxId}</p>}
                  {partyA.showAdvanced && partyA.website && <p className="text-slate-600 text-[10px]">Web: {partyA.website}</p>}
                  {partyA.showAdvanced && partyA.email && <p className="text-slate-600 text-[10px]">Email: {partyA.email}</p>}
                  {partyA.showAdvanced && partyA.phone && <p className="text-slate-600 text-[10px]">Phone: {partyA.phone}</p>}
                  {partyA.showAdvanced && partyA.customFields.map((cf, i) => (
                    cf.label && <p key={i} className="text-slate-600 text-[10px]">{cf.label}: {cf.value}</p>
                  ))}
                </div>

                <div className={`p-3.5 rounded-xl border ${currentColor.border} ${currentColor.accent} space-y-1`}>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Second Party (Recipient)</p>
                  <p className="font-bold text-xs">{partyB.name || '[Partner Name]'}</p>
                  <p className="text-slate-600 text-[10px]">Rep: {partyB.representative || '[Name]'} ({partyB.designation || 'Director'})</p>
                  <p className="text-slate-600 text-[10px]">Location: {partyB.address || '[Address]'}</p>
                  {partyB.showAdvanced && partyB.taxId && <p className="text-slate-600 text-[10px]">Tax ID: {partyB.taxId}</p>}
                  {partyB.showAdvanced && partyB.website && <p className="text-slate-600 text-[10px]">Web: {partyB.website}</p>}
                  {partyB.showAdvanced && partyB.email && <p className="text-slate-600 text-[10px]">Email: {partyB.email}</p>}
                  {partyB.showAdvanced && partyB.phone && <p className="text-slate-600 text-[10px]">Phone: {partyB.phone}</p>}
                  {partyB.showAdvanced && partyB.customFields.map((cf, i) => (
                    cf.label && <p key={i} className="text-slate-600 text-[10px]">{cf.label}: {cf.value}</p>
                  ))}
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

              {/* Legal Setup Section rendered conditionally if requiresLegalSetup is true */}
              {requiresLegalSetup && (
                <div className="space-y-3 pt-2">
                  <h5 className="font-bold text-xs mb-1">3. Legal Governance & Dispute Resolution</h5>
                  
                  {includeGoverningLawClause && (
                    <p className="text-slate-700">
                      <strong>Governing Law:</strong> This Agreement shall be interpreted, construed, and governed in accordance with the laws of <strong>{governingLaw}</strong>.
                    </p>
                  )}

                  <p className="text-slate-700">
                    <strong>Dispute Resolution Method:</strong> Any dispute arising from this contract shall be resolved via <strong>{disputeResolution}</strong> in accordance with applicable rules.
                  </p>

                  {includeSeverabilityClause && (
                    <p className="text-slate-700">
                      <strong>Severability:</strong> If any provision of this Agreement is held invalid, the remainder shall continue in full force and effect.
                    </p>
                  )}

                  {includeEntireAgreementClause && (
                    <p className="text-slate-700">
                      <strong>Entire Agreement:</strong> This document constitutes the entire agreement between the parties and supersedes all prior discussions.
                    </p>
                  )}

                  {includeConfidentialityClause && (
                    <p className="text-slate-700">
                      <strong>Confidentiality:</strong> Both parties agree to protect proprietary data and not disclose confidential information to third parties without prior written consent.
                    </p>
                  )}

                  {includeLimitationOfLiability && (
                    <p className="text-slate-700">
                      <strong>Limitation of Liability:</strong> Neither party shall be liable for indirect, incidental, or consequential damages arising out of this agreement.
                    </p>
                  )}

                  {includeForceMajeure && (
                    <p className="text-slate-700">
                      <strong>Force Majeure:</strong> Neither party shall be liable for failure to perform due to acts beyond reasonable control (e.g., natural disasters, war, strikes).
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Execution Signatures & Stamp Blocks */}
            <div className={`pt-8 border-t ${currentColor.border} font-sans text-xs space-y-8`}>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <p className="font-bold mb-1">For: {partyA.name || 'First Party'}</p>
                    <div className="h-14 border-b border-slate-400 flex items-end pb-1">
                      <span className="text-[10px] text-slate-400 italic">Authorized Signature & Date</span>
                    </div>
                  </div>
                  {requiresLegalSetup && includeSealArea && (
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
                  {requiresLegalSetup && includeSealArea && (
                    <div className="w-28 h-28 border border-dashed border-slate-400 rounded-full flex flex-col items-center justify-center text-center p-2 text-slate-400 text-[9px]">
                      <Stamp className="h-5 w-5 mb-1 text-slate-300" />
                      <span>[ Partner Seal ]</span>
                    </div>
                  )}
                </div>
              </div>

              {requiresLegalSetup && includeNotary && (
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

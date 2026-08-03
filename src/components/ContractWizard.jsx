import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, User, Download, Plus, Trash2, Save, Sparkles, Scale, FileText, Stamp, Palette, Search, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ContractWizard({ template, onBack }) {
  const [activeTab, setActiveTab] = useState('partyA');
  
  // Party A & B states
  const [partyA, setPartyA] = useState({ 
    titleLabel: 'First Party (Issuer)',
    name: '', representative: '', designation: '', address: '', logo: '', 
    showAdvanced: false, website: '', email: '', phone: '', taxId: '',
    customFields: [] 
  });
  
  const [partyB, setPartyB] = useState({ 
    titleLabel: 'Second Party (Recipient)',
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

  // Check if template requires legal setup
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

  // Fully Editable PDF Headings, Subheadings & Text Sections
  const [topHeaderLabel, setTopHeaderLabel] = useState('BINDING MASTER AGREEMENT');
  const [agreementTitle, setAgreementTitle] = useState(template.title);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityPeriod, setValidityPeriod] = useState('1 Year');

  // Introductory Sentence text before parties
  const [introTextBefore, setIntroTextBefore] = useState('This ');
  const [introTextMiddle, setIntroTextMiddle] = useState(' is entered into and made effective as of ');
  const [introTextAfter, setIntroTextAfter] = useState(', with a validity duration of ');
  const [introTextEnding, setIntroTextEnding] = useState(', by and between the following authorized entities:');

  // Section 1 Headings & Content
  const [sec1Heading, setSec1Heading] = useState('1. Scope & Contract Terms');
  const [contractBody, setContractBody] = useState(template.description);

  // Section 2 Headings & Clauses
  const [sec2Heading, setSec2Heading] = useState('2. Additional Terms & Conditions');
  const [customClauses, setCustomClauses] = useState([
    'Both parties agree to maintain strict confidentiality regarding all project details.',
    'Any disputes arising from this agreement shall be resolved through mutual negotiation.'
  ]);
  const [newClause, setNewClause] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const updateClauseText = (index, newText) => {
    const updated = [...customClauses];
    updated[index] = newText;
    setCustomClauses(updated);
  };

  // Section 3 Headings & Editable Legal Clauses
  const [sec3Heading, setSec3Heading] = useState('3. Legal Governance & Dispute Resolution');
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

  // Fully Editable Legal Governance Texts & Labels
  const [governingLawLabel, setGoverningLawLabel] = useState('Governing Law:');
  const [governingLawText, setGoverningLawText] = useState('This Agreement shall be interpreted, construed, and governed in accordance with the laws of Pakistan.');
  const [disputeLabel, setDisputeLabel] = useState('Dispute Resolution Method');
  const [disputeClauseText, setDisputeClauseText] = useState('Any dispute arising from this contract shall be resolved via the selected method in accordance with applicable rules.');
  const [severabilityLabel, setSeverabilityLabel] = useState('Severability:');
  const [severabilityText, setSeverabilityText] = useState('If any provision of this Agreement is held invalid, the remainder shall continue in full force and effect.');
  const [entireAgreementLabel, setEntireAgreementLabel] = useState('Entire Agreement:');
  const [entireAgreementText, setEntireAgreementText] = useState('This document constitutes the entire agreement between the parties and supersedes all prior discussions.');
  const [confidentialityLabel, setConfidentialityLabel] = useState('Confidentiality:');
  const [confidentialityText, setConfidentialityText] = useState('Both parties agree to protect proprietary data and not disclose confidential information to third parties without prior written consent.');
  const [liabilityLabel, setLiabilityLabel] = useState('Limitation of Liability:');
  const [liabilityText, setLiabilityText] = useState('Neither party shall be liable for indirect, incidental, or consequential damages arising out of this agreement.');
  const [forceMajeureLabel, setForceMajeureLabel] = useState('Force Majeure:');
  const [forceMajeureText, setForceMajeureText] = useState('Neither party shall be liable for failure to perform due to acts beyond reasonable control (e.g., natural disasters, war, strikes).');

  // Checkboxes for Clauses and Blocks
  const [includeGoverningLawClause, setIncludeGoverningLawClause] = useState(false);
  const [includeSeverabilityClause, setIncludeSeverabilityClause] = useState(false);
  const [includeEntireAgreementClause, setIncludeEntireAgreementClause] = useState(false);
  const [includeConfidentialityClause, setIncludeConfidentialityClause] = useState(false);
  const [includeLimitationOfLiability, setIncludeLimitationOfLiability] = useState(false);
  const [includeForceMajeure, setIncludeForceMajeure] = useState(false);
  const [includeNotary, setIncludeNotary] = useState(false);
  const [includeSealArea, setIncludeSealArea] = useState(false);

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
    const saved = localStorage.getItem(`pro_unselectable_dispute_${template.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.partyA) setPartyA(data.partyA);
        if (data.partyB) setPartyB(data.partyB);
        if (data.topHeaderLabel) setTopHeaderLabel(data.topHeaderLabel);
        if (data.agreementTitle) setAgreementTitle(data.agreementTitle);
        if (data.effectiveDate) setEffectiveDate(data.effectiveDate);
        if (data.validityPeriod) setValidityPeriod(data.validityPeriod);
        if (data.introTextBefore) setIntroTextBefore(data.introTextBefore);
        if (data.introTextMiddle) setIntroTextMiddle(data.introTextMiddle);
        if (data.introTextAfter) setIntroTextAfter(data.introTextAfter);
        if (data.introTextEnding) setIntroTextEnding(data.introTextEnding);
        if (data.sec1Heading) setSec1Heading(data.sec1Heading);
        if (data.contractBody) setContractBody(data.contractBody);
        if (data.sec2Heading) setSec2Heading(data.sec2Heading);
        if (data.customClauses) setCustomClauses(data.customClauses);
        if (data.sec3Heading) setSec3Heading(data.sec3Heading);
        if (data.governingLaw) setGoverningLaw(data.governingLaw);
        if (data.disputeResolution !== undefined) setDisputeResolution(data.disputeResolution);
        if (data.watermark) setWatermark(data.watermark);
        if (data.selectedColorTheme) setSelectedColorTheme(data.selectedColorTheme);
        if (data.includeGoverningLawClause !== undefined) setIncludeGoverningLawClause(data.includeGoverningLawClause);
        if (data.includeSeverabilityClause !== undefined) setIncludeSeverabilityClause(data.includeSeverabilityClause);
        if (data.includeEntireAgreementClause !== undefined) setIncludeEntireAgreementClause(data.includeEntireAgreementClause);
        if (data.includeConfidentialityClause !== undefined) setIncludeConfidentialityClause(data.includeConfidentialityClause);
        if (data.includeLimitationOfLiability !== undefined) setIncludeLimitationOfLiability(data.includeLimitationOfLiability);
        if (data.includeForceMajeure !== undefined) setIncludeForceMajeure(data.includeForceMajeure);
        if (data.includeNotary !== undefined) setIncludeNotary(data.includeNotary);
        if (data.includeSealArea !== undefined) setIncludeSealArea(data.includeSealArea);
        if (data.governingLawLabel) setGoverningLawLabel(data.governingLawLabel);
        if (data.governingLawText) setGoverningLawText(data.governingLawText);
        if (data.disputeLabel) setDisputeLabel(data.disputeLabel);
        if (data.disputeClauseText) setDisputeClauseText(data.disputeClauseText);
        if (data.severabilityLabel) setSeverabilityLabel(data.severabilityLabel);
        if (data.severabilityText) setSeverabilityText(data.severabilityText);
        if (data.entireAgreementLabel) setEntireAgreementLabel(data.entireAgreementLabel);
        if (data.entireAgreementText) setEntireAgreementText(data.entireAgreementText);
        if (data.confidentialityLabel) setConfidentialityLabel(data.confidentialityLabel);
        if (data.confidentialityText) setConfidentialityText(data.confidentialityText);
        if (data.liabilityLabel) setLiabilityLabel(data.liabilityLabel);
        if (data.liabilityText) setLiabilityText(data.liabilityText);
        if (data.forceMajeureLabel) setForceMajeureLabel(data.forceMajeureLabel);
        if (data.forceMajeureText) setForceMajeureText(data.forceMajeureText);
      } catch (e) {
        console.error('Failed to load draft');
      }
    }
  }, [template.id]);

  const saveDraft = () => {
    const draftData = { 
      partyA, partyB, topHeaderLabel, agreementTitle, effectiveDate, validityPeriod, 
      introTextBefore, introTextMiddle, introTextAfter, introTextEnding,
      sec1Heading, contractBody, sec2Heading, customClauses, sec3Heading,
      governingLaw, disputeResolution, watermark, selectedColorTheme,
      includeGoverningLawClause, includeSeverabilityClause, includeEntireAgreementClause,
      includeConfidentialityClause, includeLimitationOfLiability, includeForceMajeure,
      includeNotary, includeSealArea, governingLawLabel, governingLawText, disputeLabel, disputeClauseText, 
      severabilityLabel, severabilityText, entireAgreementLabel, entireAgreementText, 
      confidentialityLabel, confidentialityText, liabilityLabel, liabilityText, forceMajeureLabel, forceMajeureText
    };
    localStorage.setItem(`pro_unselectable_dispute_${template.id}`, JSON.stringify(draftData));
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
            <p className="text-xs text-slate-400">Customize every heading, section intro, and legal clause.</p>
          </div>

          {/* Navigation Tabs */}
          <div className={`grid ${requiresLegalSetup ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800`}>
            {[
              { id: 'partyA', label: 'Party A' },
              { id: 'partyB', label: 'Party B' },
              { id: 'text', label: 'Text & Headings' },
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
                <label className="block text-xs font-medium text-slate-400 mb-1">Section Title Label</label>
                <input type="text" value={partyA.titleLabel} onChange={(e) => setPartyA({...partyA, titleLabel: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
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
                <label className="block text-xs font-medium text-slate-400 mb-1">Section Title Label</label>
                <input type="text" value={partyB.titleLabel} onChange={(e) => setPartyB({...partyB, titleLabel: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
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

          {/* TAB 3: TEXT & HEADINGS */}
          {activeTab === 'text' && (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><FileText className="h-4 w-4 mr-1.5" /> Edit All Headings & Text Sections</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Top Header Label</label>
                <input type="text" value={topHeaderLabel} onChange={(e) => setTopHeaderLabel(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Main Agreement Title</label>
                <input type="text" value={agreementTitle} onChange={(e) => setAgreementTitle(e.target.value)} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
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

              {/* Section 1 */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold text-blue-400">Section 1 Heading & Content</label>
                <input type="text" value={sec1Heading} onChange={(e) => setSec1Heading(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white font-bold" />
                <textarea rows={4} value={contractBody} onChange={(e) => setContractBody(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white leading-relaxed" />
              </div>

              {/* Section 2 */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold text-blue-400">Section 2 Heading & Clauses</label>
                <input type="text" value={sec2Heading} onChange={(e) => setSec2Heading(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white font-bold" />
                
                <div className="space-y-2 pt-1">
                  {customClauses.map((clause, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-xs font-bold text-slate-400 pt-1">{idx + 1}.</span>
                      <textarea rows={2} value={clause} onChange={(e) => updateClauseText(idx, e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white" />
                      <button onClick={() => removeClause(idx)} className="text-red-400 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <input type="text" placeholder="Add new clause..." value={newClause} onChange={(e) => setNewClause(e.target.value)} className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white" />
                    <button onClick={addClause} className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-bold flex items-center"><Plus className="h-3.5 w-3.5 mr-1" /> Add</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL SETUP (With unselectable dispute option) */}
          {activeTab === 'legal' && requiresLegalSetup && (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center"><Scale className="h-4 w-4 mr-1.5" /> Legal Setup & Dispute Search</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Section 3 Heading Title</label>
                <input type="text" value={sec3Heading} onChange={(e) => setSec3Heading(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Governing Jurisdiction Country / State</label>
                <input type="text" value={governingLaw} onChange={(e) => setGoverningLaw(e.target.value)} className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>

              {/* SEARCHABLE DISPUTE RESOLUTION TYPES WITH UNSELECT BUTTON */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-400 flex items-center">
                    <Search className="h-3.5 w-3.5 mr-1" /> Search & Select Dispute Method (102 types)
                  </label>
                  {disputeResolution && (
                    <button 
                      onClick={() => setDisputeResolution('')} 
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30"
                    >
                      <X className="h-3 w-3 mr-1" /> Clear Selection
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="Search keywords..." 
                  value={disputeSearchQuery} 
                  onChange={(e) => setDisputeSearchQuery(e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" 
                />
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1 pt-1">
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
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Selected: <strong className="text-amber-400">{disputeResolution || 'None (Unselected)'}</strong>
                </p>
              </div>

              {/* SELECTABLE & FULLY EDITABLE CLAUSE TEXTS */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-300">Select & Customize Legal Governance Text:</p>
                
                {/* Governing Law */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex gap-2 items-center">
                    <input type="checkbox" checked={includeGoverningLawClause} onChange={(e) => setIncludeGoverningLawClause(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <input type="text" value={governingLawLabel} onChange={(e) => setGoverningLawLabel(e.target.value)} className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white" />
                  </div>
                  {includeGoverningLawClause && (
                    <textarea rows={2} value={governingLawText} onChange={(e) => setGoverningLawText(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  )}
                </div>

                {/* Dispute Resolution Text */}
                {disputeResolution && (
                  <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <input type="text" value={disputeLabel} onChange={(e) => setDisputeLabel(e.target.value)} className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white mb-1" />
                    <textarea rows={2} value={disputeClauseText} onChange={(e) => setDisputeClauseText(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  </div>
                )}

                {/* Severability */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex gap-2 items-center">
                    <input type="checkbox" checked={includeSeverabilityClause} onChange={(e) => setIncludeSeverabilityClause(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <input type="text" value={severabilityLabel} onChange={(e) => setSeverabilityLabel(e.target.value)} className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white" />
                  </div>
                  {includeSeverabilityClause && (
                    <textarea rows={2} value={severabilityText} onChange={(e) => setSeverabilityText(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  )}
                </div>

                {/* Entire Agreement */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex gap-2 items-center">
                    <input type="checkbox" checked={includeEntireAgreementClause} onChange={(e) => setIncludeEntireAgreementClause(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <input type="text" value={entireAgreementLabel} onChange={(e) => setEntireAgreementLabel(e.target.value)} className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white" />
                  </div>
                  {includeEntireAgreementClause && (
                    <textarea rows={2} value={entireAgreementText} onChange={(e) => setEntireAgreementText(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  )}
                </div>

                {/* Confidentiality */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex gap-2 items-center">
                    <input type="checkbox" checked={includeConfidentialityClause} onChange={(e) => setIncludeConfidentialityClause(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <input type="text" value={confidentialityLabel} onChange={(e) => setConfidentialityLabel(e.target.value)} className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white" />
                  </div>
                  {includeConfidentialityClause && (
                    <textarea rows={2} value={confidentialityText} onChange={(e) => setConfidentialityText(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  )}
                </div>

                {/* Limitation of Liability */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex gap-2 items-center">
                    <input type="checkbox" checked={includeLimitationOfLiability} onChange={(e) => setIncludeLimitationOfLiability(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <input type="text" value={liabilityLabel} onChange={(e) => setLiabilityLabel(e.target.value)} className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white" />
                  </div>
                  {includeLimitationOfLiability && (
                    <textarea rows={2} value={liabilityText} onChange={(e) => setLiabilityText(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  )}
                </div>

                {/* Force Majeure */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex gap-2 items-center">
                    <input type="checkbox" checked={includeForceMajeure} onChange={(e) => setIncludeForceMajeure(e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-blue-600" />
                    <input type="text" value={forceMajeureLabel} onChange={(e) => setForceMajeureLabel(e.target.value)} className="flex-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-white" />
                  </div>
                  {includeForceMajeure && (
                    <textarea rows={2} value={forceMajeureText} onChange={(e) => setForceMajeureText(e.target.value)} className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                  )}
                </div>
              </div>

              {/* EXECUTION BLOCKS & STAMP AREAS */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-300">Execution Blocks & Stamp Areas:</p>
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
            {/* Header Logos & Fully Editable Main Headings */}
            <div className={`flex justify-between items-center border-b ${currentColor.border} pb-6`}>
              <div className="w-32">
                {partyA.logo ? <img src={partyA.logo} alt="Logo A" className="h-12 object-contain" /> : <div className="text-[9px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 text-center rounded bg-slate-50">[Company Logo]</div>}
              </div>
              <div className="text-center font-sans px-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{topHeaderLabel}</h4>
                <p className="text-sm font-extrabold mt-0.5">{agreementTitle}</p>
              </div>
              <div className="w-32 text-right">
                {partyB.logo ? <img src={partyB.logo} alt="Logo B" className="h-12 object-contain ml-auto" /> : <div className="text-[9px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 text-center rounded bg-slate-50">[Partner Logo]</div>}
              </div>
            </div>

            {/* Fully Editable Intro Paragraph */}
            <div className="text-xs font-sans leading-relaxed space-y-4">
              <p>
                {introTextBefore}<strong>{agreementTitle}</strong>{introTextMiddle}<strong>{effectiveDate}</strong>{introTextAfter}<strong>{validityPeriod}</strong>{introTextEnding}
              </p>

              {/* Parties Box with Editable Labels */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3.5 rounded-xl border ${currentColor.border} ${currentColor.accent} space-y-1`}>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{partyA.titleLabel}</p>
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
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{partyB.titleLabel}</p>
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

              {/* Section 1 */}
              <div>
                <h5 className="font-bold text-xs mb-1">{sec1Heading}</h5>
                <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {contractBody}
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h5 className="font-bold text-xs mb-1.5">{sec2Heading}</h5>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
                  {customClauses.map((clause, idx) => (
                    <li key={idx} className="pl-1 leading-relaxed">{clause}</li>
                  ))}
                </ol>
              </div>

              {/* Section 3 Legal Setup */}
              {requiresLegalSetup && (
                <div className="space-y-3 pt-2">
                  <h5 className="font-bold text-xs mb-1">{sec3Heading}</h5>
                  
                  {includeGoverningLawClause && (
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{governingLawLabel}</strong> {governingLawText}
                    </p>
                  )}

                  {disputeResolution && (
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{disputeLabel} ({disputeResolution}):</strong> {disputeClauseText}
                    </p>
                  )}

                  {includeSeverabilityClause && (
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{severabilityLabel}</strong> {severabilityText}
                    </p>
                  )}

                  {includeEntireAgreementClause && (
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{entireAgreementLabel}</strong> {entireAgreementText}
                    </p>
                  )}

                  {includeConfidentialityClause && (
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{confidentialityLabel}</strong> {confidentialityText}
                    </p>
                  )}

                  {includeLimitationOfLiability && (
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{liabilityLabel}</strong> {liabilityText}
                    </p>
                  )}

                  {includeForceMajeure && (
                    <p className="text-slate-700 leading-relaxed">
                      <strong>{forceMajeureLabel}</strong> {forceMajeureText}
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
                    <p className="font-bold mb-1">For: {partyA.name || partyA.titleLabel}</p>
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
                    <p className="font-bold mb-1">For: {partyB.name || partyB.titleLabel}</p>
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

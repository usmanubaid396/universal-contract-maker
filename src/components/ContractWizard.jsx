import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Building2, User, Download, Plus, Trash2, Save, Sparkles, PenTool } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import html2pdf from 'html2pdf.js';

export default function ContractWizard({ template, onBack }) {
  const [step, setStep] = useState(1);
  
  const [partyA, setPartyA] = useState({ name: '', representative: '', address: '', logo: '' });
  const [partyB, setPartyB] = useState({ name: '', representative: '', address: '', logo: '' });
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [governingLaw, setGoverningLaw] = useState('Pakistan');
  const [customClauses, setCustomClauses] = useState([
    'Both parties agree to maintain strict confidentiality regarding all project details.',
    'Any disputes arising from this agreement shall be resolved through mutual negotiation.'
  ]);
  const [newClause, setNewClause] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const sigPadA = useRef(null);
  const sigPadB = useRef(null);
  const [signatureA, setSignatureA] = useState('');
  const [signatureB, setSignatureB] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`draft_${template.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.partyA) setPartyA(data.partyA);
        if (data.partyB) setPartyB(data.partyB);
        if (data.effectiveDate) setEffectiveDate(data.effectiveDate);
        if (data.governingLaw) setGoverningLaw(data.governingLaw);
        if (data.customClauses) setCustomClauses(data.customClauses);
      } catch (e) {
        console.error('Failed to load draft');
      }
    }
  }, [template.id]);

  const saveDraft = () => {
    const draftData = { partyA, partyB, effectiveDate, governingLaw, customClauses };
    localStorage.setItem(`draft_${template.id}`, JSON.stringify(draftData));
    setSaveStatus('Draft Saved Locally!');
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
      const promptLower = aiPrompt.toLowerCase();
      let generated = `The parties agree that ${aiPrompt}. Non-compliance may result in immediate termination of this agreement.`;
      
      if (promptLower.includes('payment') || promptLower.includes('fee') || promptLower.includes('deposit')) {
        generated = `Financial Terms: ${aiPrompt}. Payments shall be transferred via secure channels within 5 business days of invoicing.`;
      } else if (promptLower.includes('deadline') || promptLower.includes('time') || promptLower.includes('delay')) {
        generated = `Timeline & Scheduling: ${aiPrompt}. Time is of the essence, and extensions must be mutually agreed in writing.`;
      } else if (promptLower.includes('terminate') || promptLower.includes('cancel')) {
        generated = `Termination Clause: Either party may terminate this agreement with 14 days written notice provided to the opposing party.`;
      }

      setCustomClauses([...customClauses, generated]);
      setAiPrompt('');
      setIsGeneratingAI(false);
    }, 600);
  };

  const handleSaveSignature = (party) => {
    if (party === 'A' && sigPadA.current) {
      setSignatureA(sigPadA.current.getTrimmedCanvas().toDataURL('image/png'));
    } else if (party === 'B' && sigPadB.current) {
      setSignatureB(sigPadB.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  const handleClearSignature = (party) => {
    if (party === 'A' && sigPadA.current) {
      sigPadA.current.clear();
      setSignatureA('');
    } else if (party === 'B' && sigPadB.current) {
      sigPadB.current.clear();
      setSignatureB('');
    }
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('printable-agreement');
    const options = {
      margin: 10,
      filename: `${template.id}-agreement.pdf`,
      image: { type: 'jpeg', quality: 0.85 },
      html2canvas: { scale: 1.5, useCORS: true, logging: false },
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to all templates
        </button>

        <div className="flex items-center space-x-3">
          {saveStatus && <span className="text-xs text-emerald-400 font-medium animate-pulse">{saveStatus}</span>}
          <button
            onClick={saveDraft}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center border border-slate-700 transition shadow"
          >
            <Save className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold">Step {step} of 3</span>
              <h2 className="text-xl font-bold text-white mt-1">
                {step === 1 && 'Parties & Branding'}
                {step === 2 && 'Terms & AI Clauses'}
                {step === 3 && 'Signatures & Export'}
              </h2>
            </div>
            <div className="flex space-x-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-8 bg-blue-500' : s < step ? 'w-2.5 bg-blue-900' : 'w-2.5 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-blue-400 flex items-center">
                  <Building2 className="h-4 w-4 mr-2" /> Party A Details (Issuer)
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Company / Party Name"
                    value={partyA.name}
                    onChange={(e) => setPartyA({ ...partyA, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Representative Name & Title"
                    value={partyA.representative}
                    onChange={(e) => setPartyA({ ...partyA, representative: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'A')}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-slate-900 rounded-xl border border-slate-800 p-1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-blue-400 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Party B Details (Recipient)
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Party B / Client Name"
                    value={partyB.name}
                    onChange={(e) => setPartyB({ ...partyB, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Representative Name & Title"
                    value={partyB.representative}
                    onChange={(e) => setPartyB({ ...partyB, representative: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Party B Logo (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'B')}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-slate-900 rounded-xl border border-slate-800 p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Effective Date</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Governing Law</label>
                  <input
                    type="text"
                    value={governingLaw}
                    onChange={(e) => setGoverningLaw(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 p-4 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-blue-400 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5 animate-pulse text-amber-400" /> Free AI Clause Assistant
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., 50% deposit required upfront..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAIGenerateClause}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow"
                  >
                    {isGeneratingAI ? 'Writing...' : 'Generate'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-400">Current Agreement Clauses</label>
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {customClauses.map((clause, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-300 pr-2 leading-relaxed"><strong>{index + 1}.</strong> {clause}</span>
                      <button onClick={() => removeClause(index)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add manual clause..."
                    value={newClause}
                    onChange={(e) => setNewClause(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
                  />
                  <button
                    onClick={addClause}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center">
                <PenTool className="h-4 w-4 mr-2" /> Draw Digital Signatures
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                  <span>Party A Signature</span>
                  <button onClick={() => handleClearSignature('A')} className="text-red-400 hover:underline">Clear</button>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border border-slate-700 h-28">
                  <SignatureCanvas
                    ref={sigPadA}
                    penColor="black"
                    canvasProps={{ className: 'w-full h-full cursor-crosshair' }}
                  />
                </div>
                <button
                  onClick={() => handleSaveSignature('A')}
                  className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-xs font-semibold transition"
                >
                  Capture Party A Signature
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                  <span>Party B Signature</span>
                  <button onClick={() => handleClearSignature('B')} className="text-red-400 hover:underline">Clear</button>
                </div>
                <div className="bg-white rounded-lg overflow-hidden border border-slate-700 h-28">
                  <SignatureCanvas
                    ref={sigPadB}
                    penColor="black"
                    canvasProps={{ className: 'w-full h-full cursor-crosshair' }}
                  />
                </div>
                <button
                  onClick={() => handleSaveSignature('B')}
                  className="w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-xs font-semibold transition"
                >
                  Capture Party B Signature
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                Previous Step
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/25 ml-auto"
              >
                Continue to Next Step
              </button>
            ) : (
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center shadow-lg shadow-emerald-600/25 ml-auto disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" /> {isDownloading ? 'Generating PDF...' : 'Download PDF Document'}
              </button>
            )}
          </div>
        </div>

        <div id="printable-agreement" className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-10 shadow-2xl font-serif relative border border-slate-200">
          <div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-8 mb-8 mt-2">
              <div className="w-36">
                {partyA.logo ? (
                  <img src={partyA.logo} alt="Party A Logo" className="h-14 object-contain max-w-full" />
                ) : (
                  <div className="text-[10px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-3 text-center rounded-lg bg-slate-50">
                    [ Company Logo ]
                  </div>
                )}
              </div>
              <div className="text-center font-sans px-4">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Binding Agreement</h4>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{template.title}</p>
              </div>
              <div className="w-36 text-right">
                {partyB.logo ? (
                  <img src={partyB.logo} alt="Party B Logo" className="h-14 object-contain ml-auto max-w-full" />
                ) : (
                  <div className="text-[10px] font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-3 text-center rounded-lg bg-slate-50">
                    [ Party B Logo ]
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5 text-xs leading-relaxed text-slate-800 font-sans">
              <p className="text-slate-700">
                This <strong>{template.title}</strong> ("Agreement") is executed and made effective as of <strong>{effectiveDate}</strong>, by and between the following authorized entities:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Party A (Issuer)</p>
                  <p className="font-bold text-slate-900 text-sm">{partyA.name || '[Company / Issuer Name]'}</p>
                  <p className="text-slate-600 text-[11px]">Rep: {partyA.representative || '[Representative Name]'}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Party B (Recipient)</p>
                  <p className="font-bold text-slate-900 text-sm">{partyB.name || '[Client / Recipient Name]'}</p>
                  <p className="text-slate-600 text-[11px]">Rep: {partyB.representative || '[Representative Name]'}</p>
                </div>
              </div>

              <div className="pt-2">
                <h5 className="font-bold text-slate-900 text-sm mb-1">1. Purpose & Scope</h5>
                <p className="text-slate-700">{template.description}</p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-2">2. Terms, Conditions & Clauses</h5>
                <ol className="list-decimal pl-4 space-y-2 text-slate-700">
                  {customClauses.map((clause, idx) => (
                    <li key={idx} className="pl-1 leading-normal">{clause}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-sm mb-1">3. Governing Jurisdiction</h5>
                <p className="text-slate-700">This Agreement shall be interpreted, governed, and construed in accordance with the laws of <strong>{governingLaw}</strong>.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 pt-16 mt-12 border-t border-slate-200 font-sans text-xs">
            <div className="space-y-2">
              <div className="h-16 border-b border-slate-300 flex items-end pb-1">
                {signatureA ? (
                  <img src={signatureA} alt="Signature A" className="h-14 object-contain" />
                ) : (
                  <span className="text-[10px] text-slate-400 italic">[Pending Signature]</span>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900">For: {partyA.name || 'Party A (Issuer)'}</p>
                <p className="text-slate-500 text-[11px]">Authorized Corporate Signature</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-16 border-b border-slate-300 flex items-end pb-1">
                {signatureB ? (
                  <img src={signatureB} alt="Signature B" className="h-14 object-contain" />
                ) : (
                  <span className="text-[10px] text-slate-400 italic">[Pending Signature]</span>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900">For: {partyB.name || 'Party B (Recipient)'}</p>
                <p className="text-slate-500 text-[11px]">Authorized Signature / Acceptance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

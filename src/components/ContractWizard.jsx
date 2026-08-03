import React, { useState } from 'react';
import { ArrowLeft, Building2, User, FileCheck, Download, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function ContractWizard({ template, onBack }) {
  const [step, setStep] = useState(1);
  
  // Form State
  const [partyA, setPartyA] = useState({ name: '', representative: '', address: '', logo: '' });
  const [partyB, setPartyB] = useState({ name: '', representative: '', address: '', logo: '' });
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [governingLaw, setGoverningLaw] = useState('Pakistan');
  const [customClauses, setCustomClauses] = useState([
    'Both parties agree to maintain strict confidentiality regarding all project details.',
    'Any disputes arising from this agreement shall be resolved through mutual negotiation.'
  ]);
  const [newClause, setNewClause] = useState('');

  // Handle Logo Image Upload to Base64
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to all templates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Professional Wizard Form Steps */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-extrabold">Step {step} of 3</span>
              <h2 className="text-xl font-bold text-white mt-1">
                {step === 1 && 'Parties & Branding'}
                {step === 2 && 'Terms & Conditions'}
                {step === 3 && 'Final Review'}
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

          {/* STEP 1: Parties & Logos */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Party A */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-blue-400 flex items-center">
                  <Building2 className="h-4 w-4 mr-2" /> Party A Details (Issuer / Company)
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

              {/* Party B */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-blue-400 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Party B Details (Client / Recipient)
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

          {/* STEP 2: Terms & Clauses */}
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

              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-400">Custom Agreement Clauses</label>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {customClauses.map((clause, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-300 pr-2 leading-relaxed"><strong>{index + 1}.</strong> {clause}</span>
                      <button onClick={() => removeClause(index)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom clause..."
                    value={newClause}
                    onChange={(e) => setNewClause(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
                  />
                  <button
                    onClick={addClause}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center shadow-md shadow-blue-600/20"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Finalize */}
          {step === 3 && (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <FileCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Agreement Ready for Export</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Your contract is fully customized and formatted. Review the live document preview on the right and download or print your PDF.
              </p>
            </div>
          )}

          {/* Wizard Action Buttons */}
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
                onClick={() => window.print()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center shadow-lg shadow-emerald-600/25 ml-auto"
              >
                <Download className="h-4 w-4 mr-2" /> Download / Print PDF
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Professional Document Live Preview */}
        <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-10 shadow-2xl font-serif relative border border-slate-200">
          <div className="absolute top-4 right-6 uppercase tracking-widest text-[10px] font-sans font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Live Legal Preview
          </div>

          <div>
            {/* Logos & Header Section */}
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

            {/* Document Body Content */}
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

          {/* Professional Signature Block */}
          <div className="grid grid-cols-2 gap-10 pt-16 mt-12 border-t border-slate-200 font-sans text-xs">
            <div className="space-y-3">
              <div className="border-b-2 border-slate-300 pb-12"></div>
              <div>
                <p className="font-bold text-slate-900">For: {partyA.name || 'Party A (Issuer)'}</p>
                <p className="text-slate-500 text-[11px]">Authorized Corporate Signature</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="border-b-2 border-slate-300 pb-12"></div>
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

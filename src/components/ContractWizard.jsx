import React, { useState } from 'react';
import { ArrowLeft, Building2, User, FileCheck, Download, Plus, Trash2 } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto">
      {/* Top Header Navigation */}
      <button
        onClick={onBack}
        className="flex items-center text-sm text-blue-400 hover:text-blue-300 mb-6 font-medium transition"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to all templates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Wizard Form Steps */}
        <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Step {step} of 3</span>
              <h2 className="text-xl font-bold text-white mt-1">
                {step === 1 && 'Parties & Branding'}
                {step === 2 && 'Terms & Conditions'}
                {step === 3 && 'Review & Download'}
              </h2>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    s === step ? 'bg-blue-500' : s < step ? 'bg-blue-900' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Parties & Logos */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Party A */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                  <Building2 className="h-4 w-4 mr-2" /> Party A Details (Issuer / Company)
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Company / Party Name"
                    value={partyA.name}
                    onChange={(e) => setPartyA({ ...partyA, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Representative Name & Title"
                    value={partyA.representative}
                    onChange={(e) => setPartyA({ ...partyA, representative: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Upload Company Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'A')}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Party B */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" /> Party B Details (Client / Recipient)
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Party B / Client Name"
                    value={partyB.name}
                    onChange={(e) => setPartyB({ ...partyB, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Representative Name & Title"
                    value={partyB.representative}
                    onChange={(e) => setPartyB({ ...partyB, representative: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Upload Party B Logo (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'B')}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
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
                  <label className="block text-xs text-slate-400 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Governing Jurisdiction</label>
                  <input
                    type="text"
                    value={governingLaw}
                    onChange={(e) => setGoverningLaw(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Agreement Clauses</label>
                <div className="space-y-2 mb-4">
                  {customClauses.map((clause, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-700 text-sm">
                      <span className="text-slate-300 pr-2">{index + 1}. {clause}</span>
                      <button onClick={() => removeClause(index)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom clause..."
                    value={newClause}
                    onChange={(e) => setNewClause(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={addClause}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Finalize */}
          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <FileCheck className="h-16 w-16 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Agreement Ready for Review!</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Your contract has been successfully generated based on your specifications. Review the live document on the right and download it.
              </p>
            </div>
          )}

          {/* Wizard Action Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t border-slate-700">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition"
              >
                Previous
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition flex items-center shadow-lg shadow-emerald-500/20"
              >
                <Download className="h-4 w-4 mr-2" /> Download / Print PDF
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Live Document Preview */}
        <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl p-8 shadow-2xl font-serif flex flex-col justify-between min-h-[600px]">
          <div>
            {/* Logos Header */}
            <div className="flex justify-between items-center border-b pb-6 mb-6">
              <div className="w-32">
                {partyA.logo ? (
                  <img src={partyA.logo} alt="Party A Logo" className="h-12 object-contain" />
                ) : (
                  <span className="text-xs font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 block text-center rounded">[ Party A Logo ]</span>
                )}
              </div>
              <div className="text-center font-sans">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Official Agreement</h4>
                <p className="text-sm font-bold text-slate-800">{template.title}</p>
              </div>
              <div className="w-32 text-right">
                {partyB.logo ? (
                  <img src={partyB.logo} alt="Party B Logo" className="h-12 object-contain ml-auto" />
                ) : (
                  <span className="text-xs font-sans font-bold text-slate-400 border border-dashed border-slate-300 p-2 block text-center rounded">[ Party B Logo ]</span>
                )}
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-800 font-sans">
              <p>
                This <strong>{template.title}</strong> ("Agreement") is entered into and made effective as of <strong>{effectiveDate}</strong>, by and between:
              </p>
              
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p><strong>Party A:</strong> {partyA.name || '[Company / Issuer Name]'}</p>
                <p><strong>Represented By:</strong> {partyA.representative || '[Representative Name]'}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <p><strong>Party B:</strong> {partyB.name || '[Client / Recipient Name]'}</p>
                <p><strong>Represented By:</strong> {partyB.representative || '[Representative Name]'}</p>
              </div>

              <h5 className="font-bold text-slate-900 mt-4 mb-2">1. Purpose & Scope</h5>
              <p>{template.description}</p>

              <h5 className="font-bold text-slate-900 mt-4 mb-2">2. Terms & Conditions</h5>
              <ul className="list-decimal pl-4 space-y-1.5">
                {customClauses.map((clause, idx) => (
                  <li key={idx}>{clause}</li>
                ))}
              </ul>

              <h5 className="font-bold text-slate-900 mt-4 mb-2">3. Governing Law</h5>
              <p>This Agreement shall be governed by and construed in accordance with the laws of <strong>{governingLaw}</strong>.</p>
            </div>
          </div>

          {/* Signature Blocks */}
          <div className="grid grid-cols-2 gap-8 pt-12 mt-8 border-t border-slate-200 font-sans text-xs">
            <div>
              <div className="border-b border-slate-400 pb-8 mb-2"></div>
              <p className="font-bold">For: {partyA.name || 'Party A'}</p>
              <p className="text-slate-500">Authorized Signature</p>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-8 mb-2"></div>
              <p className="font-bold">For: {partyB.name || 'Party B'}</p>
              <p className="text-slate-500">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

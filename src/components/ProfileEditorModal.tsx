import React, { useState } from 'react';
import { MSMEProfile, EnterpriseCategory, EnterpriseType, CertificationItem } from '../types';
import { 
  X, 
  Save, 
  Building2, 
  IndianRupee, 
  Award, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Check
} from 'lucide-react';

interface ProfileEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileToEdit?: MSMEProfile;
  onSaveProfile: (profile: MSMEProfile) => void;
}

const COMMON_CERTIFICATIONS = [
  { code: 'ISO-9001', name: 'ISO 9001:2015 (Quality Management)' },
  { code: 'ISO-14001', name: 'ISO 14001:2015 (Environmental Management)' },
  { code: 'ISO-27001', name: 'ISO 27001:2022 (Information Security)' },
  { code: 'ISO-13485', name: 'ISO 13485:2016 (Medical Devices QMS)' },
  { code: 'BIS-ISI', name: 'BIS / ISI Indian Standards Mark' },
  { code: 'ZED-GOLD', name: 'MSME ZED Certification (Gold)' },
  { code: 'ZED-SILVER', name: 'MSME ZED Certification (Silver)' },
  { code: 'CDSCO-MD5', name: 'CDSCO Medical Device License (MD-5)' },
  { code: 'CIPET-17088', name: 'CIPET Compostability Certificate (IS/ISO 17088)' },
  { code: 'CPCB-REG', name: 'CPCB Producer / Manufacturer Registration' },
  { code: 'CERT-IN', name: 'CERT-In Empanelled Auditor' },
  { code: 'CMMI-L3', name: 'CMMI Level 3 Appraisal' },
  { code: 'CPWD-CLASS-1', name: 'CPWD Class-1 Composite Enlistment' },
];

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  isOpen,
  onClose,
  profileToEdit,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const isNew = !profileToEdit;

  const [companyName, setCompanyName] = useState(profileToEdit?.companyName || '');
  const [udyam, setUdyam] = useState(profileToEdit?.udyamRegistrationNumber || 'UDYAM-XX-00-0000000');
  const [category, setCategory] = useState<EnterpriseCategory>(profileToEdit?.category || 'Small');
  const [enterpriseType, setEnterpriseType] = useState<EnterpriseType>(profileToEdit?.enterpriseType || 'Manufacturing');
  const [state, setState] = useState(profileToEdit?.location.state || 'Gujarat');
  const [city, setCity] = useState(profileToEdit?.location.city || 'Ahmedabad');
  const [industrySector, setIndustrySector] = useState(profileToEdit?.industrySector || 'Electrical, Solar & Power Equipment');
  
  const [turnoverFY24, setTurnoverFY24] = useState<number>(profileToEdit?.financials.turnoverFY24 || 50000000);
  const [yearsInBusiness, setYearsInBusiness] = useState<number>(profileToEdit?.experience.yearsInBusiness || 5);
  const [maxContract, setMaxContract] = useState<number>(profileToEdit?.experience.maxSingleContractValue || 20000000);
  
  const [isWomenOwned, setIsWomenOwned] = useState(profileToEdit?.specialStatus.isWomenOwned || false);
  const [isScStOwned, setIsScStOwned] = useState(profileToEdit?.specialStatus.isScStOwned || false);
  const [isStartupIndia, setIsStartupIndia] = useState(profileToEdit?.specialStatus.isStartupIndiaRecognized || false);
  const [isZed, setIsZed] = useState(profileToEdit?.specialStatus.isZedCertified || false);
  
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    profileToEdit?.certifications || []
  );

  const handleToggleCert = (certDef: { code: string; name: string }) => {
    const exists = certifications.some(c => c.code === certDef.code);
    if (exists) {
      setCertifications(certifications.filter(c => c.code !== certDef.code));
    } else {
      setCertifications([
        ...certifications,
        {
          id: `c-${Date.now()}-${certDef.code}`,
          code: certDef.code,
          name: certDef.name,
          issuingBody: 'Accredited Registrar',
          validUntil: '2028-12-31',
          verified: true
        }
      ]);
    }
  };

  const handleSave = () => {
    if (!companyName.trim()) {
      alert('Please enter a Company Name');
      return;
    }

    const updatedProfile: MSMEProfile = {
      id: profileToEdit?.id || `msme-${Date.now()}`,
      companyName,
      udyamRegistrationNumber: udyam,
      panNumber: profileToEdit?.panNumber || 'AABCA1234D',
      category,
      enterpriseType,
      foundingYear: new Date().getFullYear() - yearsInBusiness,
      location: {
        state,
        city,
        pincode: '380001'
      },
      operationalStates: [state, 'Delhi', 'Maharashtra'],
      industrySector,
      secondarySectors: [industrySector],
      primaryProductsServices: profileToEdit?.primaryProductsServices || ['Specialized Engineered Products'],
      nicCodes: profileToEdit?.nicCodes || ['27101'],
      financials: {
        turnoverFY24: Number(turnoverFY24),
        turnoverFY23: Number(turnoverFY24) * 0.9,
        turnoverFY22: Number(turnoverFY24) * 0.8,
        averageTurnover: Number(turnoverFY24) * 0.9,
        netWorth: Number(turnoverFY24) * 0.4,
        bankSolvencyLimit: Number(turnoverFY24) * 0.5,
      },
      certifications,
      experience: {
        yearsInBusiness: Number(yearsInBusiness),
        maxSingleContractValue: Number(maxContract),
        totalCompletedProjectsValue: Number(maxContract) * 3,
        completedGovProjectsCount: profileToEdit?.experience.completedGovProjectsCount || 8,
        topPastClients: profileToEdit?.experience.topPastClients || ['State Govt Agencies', 'Public Sector Units'],
      },
      specialStatus: {
        isWomenOwned,
        isScStOwned,
        isZedCertified: isZed,
        zedGrade: isZed ? 'Gold' : undefined,
        isStartupIndiaRecognized: isStartupIndia,
        dpiitNumber: isStartupIndia ? 'DIPP99401' : undefined
      },
      preferences: {
        minTenderValue: 1000000,
        maxTenderValue: Number(turnoverFY24) * 2,
        preferredAuthorities: ['State Govt', 'Central Ministry', 'PSU'],
        onlyWithEmdExemption: true
      }
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>{isNew ? 'Create New MSME Profile' : 'Edit MSME Profile'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Customize company credentials to see instant impact on match percentages and statutory exemptions.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 flex-1">
          
          {/* Company Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Basic Company Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Company / Enterprise Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex ElectroTech Solutions"
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-medium text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Udyam Registration Number</label>
                <input
                  type="text"
                  value={udyam}
                  onChange={(e) => setUdyam(e.target.value)}
                  placeholder="UDYAM-XX-00-0000000"
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">MSME Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EnterpriseCategory)}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-medium text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                >
                  <option value="Micro">Micro Enterprise (Turnover ≤ ₹5 Cr)</option>
                  <option value="Small">Small Enterprise (Turnover ≤ ₹50 Cr)</option>
                  <option value="Medium">Medium Enterprise (Turnover ≤ ₹250 Cr)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Enterprise Type</label>
                <select
                  value={enterpriseType}
                  onChange={(e) => setEnterpriseType(e.target.value as EnterpriseType)}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-medium text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                  <option value="Trading / Supply">Trading / Supply</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Registered State (HQ)</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-medium text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Ahmedabad, Bengaluru"
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-medium text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Financials & Scale */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Financials & Operational Track Record
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">
                  Annual Turnover FY24 (INR)
                </label>
                <input
                  type="number"
                  value={turnoverFY24}
                  onChange={(e) => setTurnoverFY24(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Current: ₹{(turnoverFY24 / 10000000).toFixed(2)} Cr
                </span>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">
                  Years in Business
                </label>
                <input
                  type="number"
                  value={yearsInBusiness}
                  onChange={(e) => setYearsInBusiness(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">
                  Single Largest Past Contract (INR)
                </label>
                <input
                  type="number"
                  value={maxContract}
                  onChange={(e) => setMaxContract(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Current: ₹{(maxContract / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </div>
          </div>

          {/* Certifications Selector */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Quality Certifications & Accreditations Held
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {COMMON_CERTIFICATIONS.map((cert) => {
                const isSelected = certifications.some(c => c.code === cert.code);
                return (
                  <button
                    type="button"
                    key={cert.code}
                    onClick={() => handleToggleCert(cert)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span className="truncate pr-2">{cert.name}</span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-slate-300 shrink-0"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Status Toggles */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Special MSME Sub-quota & Govt Recognitions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isWomenOwned ? 'bg-pink-50 border-pink-400 text-pink-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={isWomenOwned}
                  onChange={(e) => setIsWomenOwned(e.target.checked)}
                  className="hidden"
                />
                <span className="block font-bold">Women-Led MSE</span>
                <span className="text-[10px] text-pink-700 block mt-0.5">3% Reserved Sub-quota</span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isScStOwned ? 'bg-purple-50 border-purple-400 text-purple-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={isScStOwned}
                  onChange={(e) => setIsScStOwned(e.target.checked)}
                  className="hidden"
                />
                <span className="block font-bold">SC/ST Entrepreneur</span>
                <span className="text-[10px] text-purple-700 block mt-0.5">4% Reserved Sub-quota</span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isStartupIndia ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={isStartupIndia}
                  onChange={(e) => setIsStartupIndia(e.target.checked)}
                  className="hidden"
                />
                <span className="block font-bold">DPIIT Startup</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Prior Turnover Relaxed</span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isZed ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={isZed}
                  onChange={(e) => setIsZed(e.target.checked)}
                  className="hidden"
                />
                <span className="block font-bold">ZED Certified</span>
                <span className="text-[10px] text-amber-700 block mt-0.5">Quality Bonus Points</span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="text-xs font-bold px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Save & Recalculate Matches</span>
          </button>
        </div>

      </div>
    </div>
  );
};

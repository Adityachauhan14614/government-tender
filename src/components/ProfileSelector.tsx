import React from 'react';
import { MSMEProfile } from '../types';
import { formatINR } from '../services/matchmaker';
import { 
  Building2, 
  Check, 
  Plus, 
  Edit3, 
  X, 
  MapPin, 
  Award, 
  ShieldCheck, 
  FileCheck2,
  Calendar
} from 'lucide-react';

interface ProfileSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: MSMEProfile[];
  currentProfileId: string;
  onSelectProfile: (id: string) => void;
  onOpenEditor: (profileToEdit?: MSMEProfile) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfileId,
  onSelectProfile,
  onOpenEditor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>MSME Company Profiles</span>
            </h2>
            <p className="text-xs text-slate-500">
              Switch company profiles to simulate how tenders re-evaluate based on sector, turnover, and certifications.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles List */}
        <div className="p-6 space-y-3 flex-1">
          {profiles.map((p) => {
            const isSelected = p.id === currentProfileId;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProfile(p.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected 
                    ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                        {p.companyName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.category === 'Micro' 
                          ? 'bg-purple-100 text-purple-700' 
                          : p.category === 'Small' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.category} Enterprise
                      </span>
                      {p.specialStatus.isWomenOwned && (
                        <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-1.5 py-0.5 rounded">
                          Women-Led
                        </span>
                      )}
                      {p.specialStatus.isScStOwned && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">
                          SC/ST Owned
                        </span>
                      )}
                      {p.specialStatus.isStartupIndiaRecognized && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                          Startup India
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {p.location.city}, {p.location.state}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">{p.udyamRegistrationNumber}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {p.industrySector} • {p.primaryProductsServices.slice(0, 2).join(', ')}
                    </p>

                    <div className="flex items-center gap-4 text-xs pt-1">
                      <span>Turnover: <strong className="text-slate-800">{formatINR(p.financials.turnoverFY24)}</strong></span>
                      <span>Past Max Order: <strong className="text-slate-800">{formatINR(p.experience.maxSingleContractValue)}</strong></span>
                      <span>Certifications: <strong className="text-emerald-700">{p.certifications.length} verified</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditor(p);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                      title="Edit this profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border border-slate-200 group-hover:border-slate-300"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={() => onOpenEditor()}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New MSME Profile</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

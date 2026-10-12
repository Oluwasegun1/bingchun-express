'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Branch } from '@/types';
import { 
  X, 
  MapPin, 
  Clock, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck,
  Building2,
  Phone
} from 'lucide-react';

export default function BranchSelectorModal() {
  const { 
    branches, 
    selectedBranch, 
    setSelectedBranch, 
    isBranchModalOpen, 
    setIsBranchModalOpen 
  } = useStore();

  if (!isBranchModalOpen) return null;

  const handleSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsBranchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#EEF5FF] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0C5CC4] text-white flex items-center justify-center shadow-md shadow-[#0C5CC4]/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 id="branch-modal-title" className="font-heading text-xl sm:text-2xl font-extrabold text-[#12233F]">
                Select Pickup Branch
              </h2>
              <p className="text-xs text-[#5B6E8C] font-medium">
                Choose your local Bing Chun store in Lagos for fast express pickup.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBranchModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Branch List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 divide-y-0">
          {branches.map((branch) => {
            const isCurrent = branch.id === selectedBranch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleSelect(branch)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'border-[#0C5CC4] bg-[#EEF5FF]/60 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-[#0C5CC4]/40 hover:bg-slate-50/70 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-[#12233F] flex items-center gap-2">
                        {branch.name}
                      </h3>
                      {branch.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0C5CC4] bg-[#0C5CC4]/10 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-[#0C5CC4]" />
                          Verified Location
                        </span>
                      )}
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        branch.status === 'Open' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {branch.status === 'Open' ? 'Express Ready' : 'Demo Mode'}
                      </span>
                    </div>

                    <p className="text-xs text-[#12233F] font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#5B6E8C] shrink-0" />
                      <span>{branch.mallUnit || branch.area}</span>
                    </p>

                    <p className="text-xs text-[#5B6E8C]">
                      {branch.address}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#5B6E8C]">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0C5CC4]" />
                        <span>{branch.hours}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Est. Prep: {branch.estimatedPrepMins}</span>
                      </div>
                      {branch.phone && (
                        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Phone className="w-3 h-3" />
                          <span>{branch.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action / Selected Indicator */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C5CC4] text-white text-xs font-bold shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        Selected Branch
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0C5CC4] hover:text-white text-xs font-bold text-[#12233F] transition-colors"
                      >
                        Select Branch
                      </button>
                    )}

                    {branch.googleMapsUrl && (
                      <a
                        href={branch.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-semibold text-[#0C5CC4] hover:underline flex items-center gap-1"
                      >
                        <span>Map</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5B6E8C] gap-2">
          <span>Operating hours &amp; prep times are verified where public, and demonstrative for demo purposes.</span>
          <button
            onClick={() => setIsBranchModalOpen(false)}
            className="text-xs font-bold text-[#12233F] hover:text-[#0C5CC4] py-1 px-3"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

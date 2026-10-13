'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import CartDrawer from '@/components/CartDrawer';
import { useStore } from '@/context/StoreContext';
import { 
  MapPin, 
  Clock, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Building2,
  ArrowRight
} from 'lucide-react';

export default function BranchesPage() {
  const { branches, selectedBranch, setSelectedBranch } = useStore();

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-extrabold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            Lagos Store Network
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-ink">
            Bing Chun Lagos Branches
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Select your preferred outlet for online express pre-ordering. All branches are verified from official Belu Meals / Bing Chun Nigeria announcements and public store registries.
          </p>
        </div>

        {/* Current Active Selection Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-brand to-brand-dark text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFD23F]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Currently Ordering From:</span>
              <h2 className="font-heading text-xl font-bold">{selectedBranch.name}</h2>
              <p className="text-xs text-white/80">{selectedBranch.mallUnit || selectedBranch.address}</p>
            </div>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white text-brand font-extrabold text-xs shadow-xs hover:bg-slate-50 transition-colors"
          >
            Start Order at this Branch
          </Link>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => {
            const isCurrent = b.id === selectedBranch.id;

            return (
              <div
                key={b.id}
                className={`bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between shadow-xs ${
                  isCurrent
                    ? 'border-brand shadow-md ring-2 ring-brand/20'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-brand bg-brand-50 px-2.5 py-1 rounded-full">
                      {b.area}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      b.status === 'Open' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-bold text-ink">
                      {b.name}
                    </h3>
                    <p className="text-xs font-semibold text-ink mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted" />
                      <span>{b.mallUnit || b.address}</span>
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {b.address}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand" />
                      <span>{b.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-emerald-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Express Prep: {b.estimatedPrepMins}</span>
                    </div>
                    {b.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-3">
                  {isCurrent ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 px-4 rounded-xl bg-brand text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedBranch(b)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-brand hover:text-white text-ink text-xs font-bold transition-colors"
                    >
                      Select this Branch
                    </button>
                  )}

                  {b.googleMapsUrl && (
                    <a
                      href={b.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-brand text-brand transition-colors"
                      title="Open on Google Maps"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BranchSelectorModal />
      <CartDrawer />
    </div>
  );
}

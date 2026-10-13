'use client';

import React from 'react';
import { Check, Clock, MapPin, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useModal } from '@/lib/useModal';

export default function BranchSelectorModal() {
  const { branches, selectedBranch, setSelectedBranch, isBranchModalOpen, setIsBranchModalOpen } = useStore();
  const close = () => setIsBranchModalOpen(false);
  const ref = useModal<HTMLDivElement>(isBranchModalOpen, close);

  if (!isBranchModalOpen) return null;

  return (
    <div className="anim-fade fixed inset-0 z-[55] flex items-end justify-center bg-ink/50 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="branch-title" tabIndex={-1} className="anim-up flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-white shadow-pop sm:max-w-lg sm:rounded-sheet">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id="branch-title" className="text-xl font-extrabold">Choose pickup branch</h2>
            <p className="text-sm text-muted">Your order will be prepared here.</p>
          </div>
          <button onClick={close} aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl text-muted hover:bg-canvas hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex-1 space-y-2 overflow-y-auto p-4" role="radiogroup" aria-label="Pickup branches">
          {branches.map((b) => {
            const on = b.id === selectedBranch.id;
            return (
              <li key={b.id}>
                <button
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setSelectedBranch(b);
                    close();
                  }}
                  className={`flex w-full items-start gap-3 rounded-ctl border p-3.5 text-left transition-colors ${on ? 'border-brand bg-brand-50 ring-1 ring-brand' : 'border-line-strong hover:border-brand-300'}`}
                >
                  <MapPin className={`mt-0.5 h-5 w-5 shrink-0 ${on ? 'text-brand' : 'text-faint'}`} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold">{b.name}</span>
                      {b.status === 'Demo' && <span className="rounded bg-warn-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-warn">Demo</span>}
                    </span>
                    <span className="block text-xs text-muted">{b.address}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-ink-soft"><Clock className="h-3 w-3" aria-hidden /> {b.hours} · ready in {b.estimatedPrepMins}</span>
                  </span>
                  {on && <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={3} />}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-line px-5 py-3 text-xs text-muted">Branch details are illustrative for this prototype and need confirming with Bing Chun.</p>
      </div>
    </div>
  );
}

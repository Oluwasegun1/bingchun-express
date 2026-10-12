'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ShieldAlert, 
  LayoutDashboard,
  Menu as MenuIcon,
  X
} from 'lucide-react';

function HeaderNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
      <Link
        href="/"
        className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
          pathname === '/'
            ? 'text-[#0C5CC4] bg-[#0C5CC4]/10'
            : 'text-[#5B6E8C] hover:text-[#12233F] hover:bg-slate-100/60'
        }`}
      >
        Menu
      </Link>
      <Link
        href="/branches"
        className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
          pathname === '/branches'
            ? 'text-[#0C5CC4] bg-[#0C5CC4]/10'
            : 'text-[#5B6E8C] hover:text-[#12233F] hover:bg-slate-100/60'
        }`}
      >
        Branches
      </Link>
      <Link
        href="/track"
        className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
          pathname?.startsWith('/track')
            ? 'text-[#0C5CC4] bg-[#0C5CC4]/10'
            : 'text-[#5B6E8C] hover:text-[#12233F] hover:bg-slate-100/60'
        }`}
      >
        Track Order
      </Link>

      {/* Staff Dashboard Portal Link */}
      <Link
        href="/staff"
        className={`ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
          pathname?.startsWith('/staff')
            ? 'bg-[#12233F] text-white border-[#12233F]'
            : 'bg-white text-[#12233F] border-slate-200 hover:border-[#12233F] hover:bg-slate-50'
        }`}
      >
        <LayoutDashboard className="w-3.5 h-3.5 text-[#0C5CC4]" />
        <span>Staff Demo</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </Link>
    </nav>
  );
}

export default function Header() {
  const { 
    selectedBranch, 
    setIsBranchModalOpen, 
    cartCount, 
    setIsCartOpen 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Partnership Demo Disclaimer Banner */}
      <div className="bg-[#12233F] text-slate-300 text-xs py-1.5 px-4 text-center font-medium border-b border-white/5 flex items-center justify-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-[#FFD23F] shrink-0" />
        <span>
          <strong className="text-white">Concept Demo:</strong> Bing Chun Express is a partnership evaluation prototype for online express pickup in Nigeria. Not an official product.
        </span>
      </div>

      <header className="sticky top-0 z-40 glass-header border-b border-[#0C5CC4]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-[#0C5CC4] flex flex-col items-center justify-center text-white shadow-md shadow-[#0C5CC4]/20 group-hover:scale-105 transition-transform">
              <span className="text-[13px] font-bold leading-none tracking-tight">冰淳</span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FFD23F]">BC</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-[#12233F]">
                  Bing Chun
                </span>
                <span className="bg-[#0C5CC4] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  EXPRESS
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#5B6E8C] block -mt-1 tracking-wide">
                Ice Cream &amp; Tea · Nigeria
              </span>
            </div>
          </Link>

          {/* Quick Branch Selector Pill */}
          <button
            onClick={() => setIsBranchModalOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#0C5CC4]/15 hover:border-[#0C5CC4]/40 shadow-xs hover:shadow-sm transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0C5CC4]/10 flex items-center justify-center text-[#0C5CC4] group-hover:bg-[#0C5CC4] group-hover:text-white transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0C5CC4]">
                <span>Pickup Branch</span>
                <ChevronDown className="w-3 h-3 text-[#5B6E8C] group-hover:translate-y-0.5 transition-transform" />
              </div>
              <p className="text-xs font-bold text-[#12233F] truncate max-w-[170px]">
                {selectedBranch.name}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-slate-200 text-[11px] font-semibold text-emerald-600">
              <Clock className="w-3 h-3" />
              <span>{selectedBranch.estimatedPrepMins}</span>
            </div>
          </button>

          {/* Nav Links (Desktop) wrapped in Suspense */}
          <Suspense fallback={
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Menu</span> · <span>Branches</span> · <span>Track Order</span>
            </div>
          }>
            <HeaderNavLinks />
          </Suspense>

          {/* Right Action: Cart Button */}
          <div className="flex items-center gap-2">
            {/* Mobile Branch button */}
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-[#0C5CC4]"
              aria-label="Select Pickup Branch"
            >
              <MapPin className="w-5 h-5" />
            </button>

            {/* Express Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0C5CC4] hover:bg-[#084393] text-white font-bold text-sm shadow-md shadow-[#0C5CC4]/25 hover:shadow-lg hover:shadow-[#0C5CC4]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Express Bag</span>
              <span className="bg-[#FFD23F] text-[#12233F] text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-white border border-slate-200 text-[#12233F]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-2">
            <div className="p-3 bg-[#EEF5FF] rounded-2xl mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#0C5CC4]">Selected Branch:</span>
                <p className="text-sm font-bold text-[#12233F]">{selectedBranch.name}</p>
                <p className="text-xs text-[#5B6E8C]">{selectedBranch.estimatedPrepMins} prep</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBranchModalOpen(true);
                }}
                className="text-xs font-bold text-[#0C5CC4] bg-white px-3 py-1.5 rounded-xl border border-[#0C5CC4]/20 shadow-xs"
              >
                Change
              </button>
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-[#12233F] hover:bg-slate-100"
            >
              Drink &amp; Dessert Menu
            </Link>
            <Link
              href="/branches"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-[#12233F] hover:bg-slate-100"
            >
              Branch Locations &amp; Hours
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-[#12233F] hover:bg-slate-100"
            >
              Track Order Status
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold bg-[#12233F] text-white"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-[#0C5CC4]" />
                  <span>Open Staff Dashboard</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Active Queue</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

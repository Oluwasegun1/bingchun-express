'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import CartDrawer from '@/components/CartDrawer';
import { useStore } from '@/context/StoreContext';
import { formatNaira, formatDate } from '@/lib/utils';
import { Search, Clock, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function TrackOrderSearchPage() {
  const router = useRouter();
  const { orders } = useStore();
  const [searchId, setSearchId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const trimmed = searchId.trim().toUpperCase();
    const found = orders.find(
      (o) => o.id.toUpperCase() === trimmed || o.pickupCode.toUpperCase() === trimmed
    );

    if (found) {
      router.push(`/track/${found.id}`);
    } else {
      setErrorMsg(`No demo order found matching "${searchId.trim()}". Try BC-1042 or select a recent order below.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#0C5CC4]">
            Express Collection
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#12233F]">
            Track Your Drink Order
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6E8C]">
            Enter your 6-digit Order ID (e.g. BC-1042) or 4-character pickup PIN to monitor kitchen preparation status.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#12233F]">Order ID or Pickup Code</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. BC-1042 or H7K9"
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#0C5CC4] text-sm text-[#12233F] font-bold uppercase tracking-wider"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0C5CC4] hover:bg-[#084393] text-white font-extrabold text-sm shadow-md shadow-[#0C5CC4]/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Track Progress</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Recent Session Orders */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#5B6E8C]">
            Recent Active Orders in this Demo Session ({orders.length})
          </h2>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/track/${order.id}`}
                className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-[#0C5CC4]/30 shadow-2xs hover:shadow-sm flex items-center justify-between transition-all group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm text-[#12233F] group-hover:text-[#0C5CC4] transition-colors">
                      {order.id}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                      PIN: {order.pickupCode}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-50 text-[#0C5CC4]">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6E8C]">
                    {order.customerName} · {order.branchName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#12233F] block">
                    {formatNaira(order.total)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BranchSelectorModal />
      <CartDrawer />
    </div>
  );
}

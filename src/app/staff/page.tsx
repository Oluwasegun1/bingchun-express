'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Order, OrderStatus } from '@/types';
import { formatNaira, formatTime, formatDate } from '@/lib/utils';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  CheckCheck, 
  XCircle, 
  Search, 
  Filter, 
  RotateCcw, 
  LayoutDashboard, 
  UtensilsCrossed, 
  ArrowLeft, 
  TrendingUp, 
  AlertCircle,
  Phone,
  Eye,
  X,
  ExternalLink
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

const STATUS_TABS: { label: string; status: OrderStatus | 'all'; icon: any }[] = [
  { label: 'All Orders', status: 'all', icon: ShoppingBag },
  { label: 'New / Received', status: 'received', icon: Clock },
  { label: 'Confirmed', status: 'confirmed', icon: CheckCircle2 },
  { label: 'In Kitchen', status: 'preparing', icon: ChefHat },
  { label: 'Ready for Pickup', status: 'ready', icon: CheckCheck },
  { label: 'Collected', status: 'collected', icon: CheckCircle2 },
];

export default function StaffDashboardPage() {
  const { 
    orders, 
    branches, 
    updateOrderStatus, 
    updateIceCreamStatus,
    cancelOrder, 
    resetDemoData, 
    showNotification 
  } = useStore();

  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Compute operational demo metrics
  const metrics = useMemo(() => {
    const receivedCount = orders.filter((o) => o.status === 'received').length;
    const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
    const preparingCount = orders.filter((o) => o.status === 'preparing').length;
    const readyCount = orders.filter((o) => o.status === 'ready').length;
    const collectedCount = orders.filter((o) => o.status === 'collected').length;
    const iceCreamPendingCount = orders.filter((o) =>
      o.status !== 'cancelled' &&
      o.items.some((it) => (it.isIceCream || it.category === 'Ice Cream') && it.iceCreamPrepStatus !== 'collected')
    ).length;
    const totalSales = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);

    return {
      receivedCount,
      confirmedCount,
      preparingCount,
      readyCount,
      collectedCount,
      iceCreamPendingCount,
      totalCount: orders.length,
      totalSales,
    };
  }, [orders]);

  // Filter orders by tab, branch, and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }
      if (selectedBranchFilter !== 'all' && order.branchId !== selectedBranchFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesPin = order.pickupCode.toLowerCase().includes(query);
        const matchesCustomer = order.customerName.toLowerCase().includes(query);
        const matchesPhone = order.customerPhone.toLowerCase().includes(query);
        return matchesId || matchesPin || matchesCustomer || matchesPhone;
      }
      return true;
    });
  }, [orders, activeTab, selectedBranchFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col font-sans">
      
      {/* Staff Ops Navigation Bar */}
      <header className="sticky top-0 z-40 bg-ink text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1 shadow-md ring-1 ring-white/20 transition-all duration-200 hover:scale-105 hover:ring-brand/40"
                title="Bing Chun Express — Customer Storefront"
              >
                <BrandLogo size={40} priority className="rounded-xl object-contain transition-transform duration-200 group-hover:scale-105" />
              </Link>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-base sm:text-lg font-black tracking-tight text-white leading-none">
                    Bing Chun Kitchen &amp; Storefront Ops
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Live Session
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  Staff Order Processing &amp; Express Queue Management
                </p>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/staff/menu"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#FFD23F]" />
              <span>Menu Admin</span>
            </Link>

            <button
              onClick={() => {
                if (confirm('Reset demo data to initial sample queue and catalogue?')) {
                  resetDemoData();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/20 transition-colors"
              title="Reset all demo orders and catalog edits"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-xs"
            >
              Customer View
            </Link>
          </div>
        </div>
      </header>

      {/* Main Staff Dashboard Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Real-time Demo Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">New Orders</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-amber-600">
                {metrics.receivedCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">pending</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Confirmed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-brand">
                {metrics.confirmedCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">queued</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">In Kitchen</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-purple-600">
                {metrics.preparingCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">brewing</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Ready on Counter</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-emerald-600">
                {metrics.readyCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">for pickup</span>
            </div>
          </div>

          {/* Ice Cream Queue Metric */}
          <div className="bg-white p-4 rounded-2xl border border-brand/40 shadow-2xs bg-brand-50/20">
            <span className="text-[11px] font-bold text-brand uppercase flex items-center gap-1">
              <span>🍨</span> Ice Cream Queue
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-brand">
                {metrics.iceCreamPendingCount}
              </span>
              <span className="text-[10px] text-brand/80 font-bold">scoop on arrival</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Completed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-slate-700">
                {metrics.collectedCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">picked up</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs bg-gradient-to-br from-brand/5 to-transparent">
            <span className="text-[11px] font-bold text-brand uppercase">Demo Day Volume</span>
            <div className="mt-1">
              <span className="font-heading text-xl font-black text-ink block">
                {formatNaira(metrics.totalSales)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {metrics.totalCount} demo orders
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {STATUS_TABS.map((tab) => {
              const count = tab.status === 'all' 
                ? orders.length 
                : orders.filter((o) => o.status === tab.status).length;
              const isActive = activeTab === tab.status;

              return (
                <button
                  key={tab.status}
                  onClick={() => setActiveTab(tab.status)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-ink text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                    isActive ? 'bg-brand text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Branch Filter */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #, PIN, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-brand text-xs text-ink font-medium"
              />
            </div>

            {/* Branch dropdown */}
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-ink focus:outline-hidden"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Queue Cards */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-lg font-bold text-ink">
              No orders in this view
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Try selecting another status tab or clear the search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const isNew = order.status === 'received';
              const isConfirmed = order.status === 'confirmed';
              const isPrep = order.status === 'preparing';
              const isReady = order.status === 'ready';
              const isCollected = order.status === 'collected';
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-xs ${
                    isReady
                      ? 'border-emerald-500 bg-emerald-50/15'
                      : isPrep
                      ? 'border-purple-400'
                      : isNew
                      ? 'border-amber-400'
                      : 'border-slate-200/80'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Order Header: ID, PIN, Time, Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-xl font-black text-ink">
                            {order.id}
                          </span>
                          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-[#FFD23F] text-ink">
                            PIN: {order.pickupCode}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {formatTime(order.createdAt)} · {order.branchName}
                        </span>
                      </div>

                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isReady
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPrep
                          ? 'bg-purple-100 text-purple-800'
                          : isConfirmed
                          ? 'bg-blue-100 text-blue-800'
                          : isNew
                          ? 'bg-amber-100 text-amber-800'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-ink">{order.customerName}</span>
                        <p className="text-[11px] text-slate-500">{order.customerPhone}</p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {order.paymentMethod.replace(' (Demo)', '')}
                      </span>
                    </div>

                    {/* Order Line Items: Separate Drinks and Ice Cream */}
                    <div className="space-y-3 pt-1">
                      {/* Ice Cream Section (Prepare on Arrival) */}
                      {(() => {
                        const iceCreamItems = order.items
                          .map((it, idx) => ({ it, idx }))
                          .filter(({ it }) => it.isIceCream || it.category === 'Ice Cream' || it.prepareOnArrival);

                        if (iceCreamItems.length === 0) return null;

                        return (
                          <div className="rounded-2xl border-2 border-brand/30 bg-brand-50/50 p-3 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand">
                                <span>🍨</span> Prepaid Ice Cream (Prepare on Arrival)
                              </span>
                              <span className="text-[10px] font-extrabold uppercase bg-brand text-white px-2 py-0.5 rounded-full">
                                Prepaid
                              </span>
                            </div>

                            <div className="space-y-2">
                              {iceCreamItems.map(({ it: item, idx }) => {
                                const pType = item.iceCreamProductType || item.customization.productType || (item.productName.toLowerCase().includes('cone') ? 'Cone' : 'Cup');
                                const flav = item.iceCreamFlavor || item.customization.flavor || 'Vanilla';
                                const prepStatus = item.iceCreamPrepStatus || 'awaiting_arrival';

                                return (
                                  <div key={idx} className="bg-white rounded-xl p-2.5 border border-brand/20 shadow-2xs space-y-2">
                                    <div className="flex items-start justify-between gap-1">
                                      <div>
                                        <span className="font-extrabold text-xs text-ink">
                                          {item.quantity}× {pType} Ice Cream
                                        </span>
                                        <p className="text-[11px] text-brand font-bold">
                                          Flavour: <span className="underline decoration-brand/30">{flav}</span>
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-xs font-bold text-ink">{formatNaira(item.totalPrice)}</span>
                                        <span className="block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                          {order.paymentStatus === 'Paid' ? 'Paid' : 'Prepaid'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Prep status & operational action */}
                                    <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                          prepStatus === 'awaiting_arrival'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                            : prepStatus === 'preparing'
                                            ? 'bg-purple-100 text-purple-800 border border-purple-300 animate-pulse'
                                            : prepStatus === 'ready'
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            : 'bg-slate-100 text-slate-700'
                                        }`}>
                                          {prepStatus === 'awaiting_arrival'
                                            ? 'Awaiting Arrival'
                                            : prepStatus === 'preparing'
                                            ? 'Preparing / Scooping'
                                            : prepStatus === 'ready'
                                            ? 'Ready'
                                            : 'Collected'}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        {prepStatus === 'awaiting_arrival' && (
                                          <button
                                            type="button"
                                            onClick={() => updateIceCreamStatus(order.id, idx, 'preparing')}
                                            className="px-2.5 py-1 bg-brand hover:bg-brand-dark text-white rounded-lg text-[10px] font-bold transition-all shadow-xs"
                                          >
                                            Customer Arrived: Scoop
                                          </button>
                                        )}
                                        {prepStatus === 'preparing' && (
                                          <button
                                            type="button"
                                            onClick={() => updateIceCreamStatus(order.id, idx, 'ready')}
                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-xs"
                                          >
                                            Mark Ready
                                          </button>
                                        )}
                                        {prepStatus === 'ready' && (
                                          <button
                                            type="button"
                                            onClick={() => updateIceCreamStatus(order.id, idx, 'collected')}
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-black text-white rounded-lg text-[10px] font-bold transition-all shadow-xs"
                                          >
                                            Mark Collected
                                          </button>
                                        )}
                                        {prepStatus === 'collected' && (
                                          <button
                                            type="button"
                                            onClick={() => updateIceCreamStatus(order.id, idx, 'awaiting_arrival')}
                                            className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold"
                                          >
                                            Reset
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Drink Station (Prepare Ahead) */}
                      {(() => {
                        const drinkItems = order.items
                          .map((it, idx) => ({ it, idx }))
                          .filter(({ it }) => !it.isIceCream && it.category !== 'Ice Cream' && !it.prepareOnArrival);

                        if (drinkItems.length === 0) return null;

                        return (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                              🧋 Drink Station ({drinkItems.reduce((s, { it }) => s + it.quantity, 0)}) · Prepare Ahead
                            </span>
                            <div className="space-y-2">
                              {drinkItems.map(({ it: item }, i) => (
                                <div key={i} className="text-xs">
                                  <div className="flex justify-between font-bold text-ink">
                                    <span>
                                      {item.quantity}× {item.productName}
                                    </span>
                                    <span>{formatNaira(item.totalPrice)}</span>
                                  </div>
                                  {/* Customization Details for Barista */}
                                  <div className="text-[10px] text-brand font-medium flex flex-wrap gap-1 mt-0.5">
                                    {item.customization.size && <span>[{item.customization.size}]</span>}
                                    {item.customization.sweetness && <span>Sugar: {item.customization.sweetness}</span>}
                                    {item.customization.ice && <span>Ice: {item.customization.ice}</span>}
                                    {item.customization.toppings.map((t) => (
                                      <span key={t.id}>+{t.name}</span>
                                    ))}
                                  </div>
                                  {item.customization.notes && (
                                    <p className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm mt-0.5">
                                      Note: {item.customization.notes}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {order.notes && (
                      <div className="p-2 bg-amber-50 border border-amber-200/60 rounded-xl text-[11px] text-amber-900">
                        <strong>Order Note:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                      <span className="text-slate-500 font-semibold">Total:</span>
                      <span className="text-sm font-black">{formatNaira(order.total)}</span>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {isNew && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="py-2 px-3 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            Accept &amp; Confirm
                          </button>
                          <button
                            onClick={() => setOrderToCancel(order)}
                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {isConfirmed && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-2xs col-span-2"
                          >
                            Start Brewing (In Kitchen)
                          </button>
                        </>
                      )}

                      {isPrep && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs col-span-2"
                          >
                            Mark Ready for Pickup
                          </button>
                        </>
                      )}

                      {isReady && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'collected')}
                            className="py-2 px-3 rounded-xl bg-ink hover:bg-black text-white text-xs font-bold transition-colors shadow-2xs col-span-2"
                          >
                            Hand to Customer (Collected)
                          </button>
                        </>
                      )}

                      {(isCollected || isCancelled) && (
                        <div className="col-span-2 text-center py-1 text-xs font-bold text-slate-400">
                          {isCollected ? 'Order Picked Up & Fulfilled' : 'Order Cancelled'}
                        </div>
                      )}
                    </div>

                    {/* Live link to customer tracking view */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="text-[11px] font-bold text-brand hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Full Details</span>
                      </button>

                      <Link
                        href={`/track/${order.id}`}
                        target="_blank"
                        className="text-[11px] text-slate-500 hover:text-brand flex items-center gap-1 font-semibold"
                      >
                        <span>Customer Screen</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Order Details Modal Drawer */}
      {selectedOrderDetails && (() => {
        const activeOrder = orders.find((o) => o.id === selectedOrderDetails.id) ?? selectedOrderDetails;
        const modalDrinkItems = activeOrder.items
          .map((it, idx) => ({ it, idx }))
          .filter(({ it }) => !it.isIceCream && it.category !== 'Ice Cream' && !it.prepareOnArrival);
        const modalIceCreamItems = activeOrder.items
          .map((it, idx) => ({ it, idx }))
          .filter(({ it }) => it.isIceCream || it.category === 'Ice Cream' || it.prepareOnArrival);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-brand tracking-wider">Order Detail</span>
                  <h3 className="font-heading text-xl font-black text-ink">
                    {activeOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-ink transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div>
                    <span className="text-slate-400 font-semibold block">Customer Name</span>
                    <span className="font-bold text-ink text-sm">{activeOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Phone</span>
                    <span className="font-bold text-ink text-sm">{activeOrder.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Pickup Code</span>
                    <span className="font-bold text-amber-600 text-sm">PIN: {activeOrder.pickupCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Payment</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {activeOrder.paymentStatus} ({activeOrder.paymentMethod.replace(' (Demo)', '')})
                    </span>
                  </div>
                </div>

                {/* Ice Cream Component Section */}
                {modalIceCreamItems.length > 0 && (
                  <div className="rounded-2xl border-2 border-brand/30 bg-brand-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xs uppercase tracking-wider text-brand flex items-center gap-1.5">
                        <span>🍨</span> Prepaid Ice Cream (Prepare on Arrival)
                      </h4>
                      <span className="text-[10px] font-bold text-brand bg-white px-2 py-0.5 rounded-full border border-brand/20">
                        Do not scoop ahead of time
                      </span>
                    </div>

                    <div className="space-y-3">
                      {modalIceCreamItems.map(({ it: i, idx }) => {
                        const pType = i.iceCreamProductType || i.customization.productType || (i.productName.toLowerCase().includes('cone') ? 'Cone' : 'Cup');
                        const flav = i.iceCreamFlavor || i.customization.flavor || 'Vanilla';
                        const prepStatus = i.iceCreamPrepStatus || 'awaiting_arrival';

                        return (
                          <div key={idx} className="bg-white rounded-xl p-3 border border-brand/20 shadow-2xs space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-extrabold text-sm text-ink block">
                                  {i.quantity}× {pType} Ice Cream
                                </span>
                                <span className="text-xs text-brand font-bold">
                                  Flavour: <span className="underline">{flav}</span>
                                </span>
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  Product Type: <strong className="text-ink">{pType}</strong>
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-sm text-ink block">{formatNaira(i.totalPrice)}</span>
                                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
                                  Prepaid · {activeOrder.paymentStatus}
                                </span>
                              </div>
                            </div>

                            {/* Status changer buttons */}
                            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">
                                Update Preparation Status:
                              </span>
                              <div className="grid grid-cols-4 gap-1.5">
                                {[
                                  { s: 'awaiting_arrival' as const, label: 'Awaiting' },
                                  { s: 'preparing' as const, label: 'Scooping' },
                                  { s: 'ready' as const, label: 'Ready' },
                                  { s: 'collected' as const, label: 'Collected' },
                                ].map(({ s, label }) => {
                                  const isActive = prepStatus === s;
                                  return (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => updateIceCreamStatus(activeOrder.id, idx, s)}
                                      className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                                        isActive
                                          ? s === 'ready'
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : s === 'preparing'
                                            ? 'bg-purple-600 text-white shadow-xs'
                                            : s === 'collected'
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-amber-500 text-white shadow-xs'
                                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      }`}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Drink Station Section */}
                {modalDrinkItems.length > 0 && (
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                      🧋 Drink Station (Prepare Ahead of Pickup)
                    </h4>
                    <div className="space-y-2 divide-y divide-slate-100 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {modalDrinkItems.map(({ it: i }, idx) => (
                        <div key={idx} className={idx > 0 ? 'pt-2' : ''}>
                          <div className="flex justify-between font-bold text-ink">
                            <span>{i.quantity}× {i.productName}</span>
                            <span>{formatNaira(i.totalPrice)}</span>
                          </div>
                          <div className="text-[11px] text-brand mt-0.5 space-x-1">
                            {i.customization.size && <span>Size: {i.customization.size}</span>}
                            {i.customization.sweetness && <span>· Sugar: {i.customization.sweetness}</span>}
                            {i.customization.ice && <span>· Ice: {i.customization.ice}</span>}
                            {i.customization.toppings.map((t) => (
                              <span key={t.id}>· +{t.name}</span>
                            ))}
                          </div>
                          {i.customization.notes && (
                            <p className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block">
                              Note: {i.customization.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between font-black text-sm text-ink">
                  <span>Total Amount Payable:</span>
                  <span className="text-base text-brand">{formatNaira(activeOrder.total)}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-2 bg-ink text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Cancel Confirmation Dialog */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-ink">
                Cancel Demo Order #{orderToCancel.id}?
              </h3>
              <p className="text-xs text-muted mt-1">
                Are you sure you want to cancel {orderToCancel.customerName}&rsquo;s order? This demo status will immediately reflect on the customer tracking view.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
              >
                Keep Order
              </button>
              <button
                onClick={() => {
                  cancelOrder(orderToCancel.id);
                  setOrderToCancel(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

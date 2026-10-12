'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import Header from '@/components/Header';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import CartDrawer from '@/components/CartDrawer';
import { formatNaira, formatDate, formatTime } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert, 
  ChefHat, 
  ShoppingBag, 
  QrCode,
  LayoutDashboard,
  ExternalLink,
  RotateCw
} from 'lucide-react';
import { OrderStatus } from '@/types';

const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  { status: 'received', label: 'Order Received', desc: 'Sent to branch express queue', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', desc: 'Accepted by kitchen barista', icon: CheckCircle2 },
  { status: 'preparing', label: 'Preparing', desc: 'Brewing & scooping to order', icon: ChefHat },
  { status: 'ready', label: 'Ready for Pickup', desc: 'Waiting at express pickup counter', icon: ShoppingBag },
  { status: 'collected', label: 'Collected', desc: 'Order complete. Enjoy your Bing Chun!', icon: CheckCircle2 },
];

function OrderTrackingContent() {
  const params = useParams();
  const orderId = (params?.id as string) || '';
  const { getOrderById, updateOrderStatus } = useStore();

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="font-heading text-2xl font-black text-[#12233F]">
          Order #{orderId} Not Found
        </h1>
        <p className="text-xs text-[#5B6E8C]">
          We could not find an active demo order with this identifier in your local session.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-2xl bg-[#0C5CC4] text-white text-xs font-bold"
          >
            Back to Menu
          </Link>
          <Link
            href="/staff"
            className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-[#12233F] text-xs font-bold"
          >
            View Staff Orders
          </Link>
        </div>
      </main>
    );
  }

  // Determine current timeline active step index
  const statusHierarchy: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready', 'collected'];
  const currentStepIndex = statusHierarchy.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const isReady = order.status === 'ready';

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-6">
      
      {/* Navigation back */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C5CC4] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Order more drinks</span>
        </Link>

        <Link
          href="/staff"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 shadow-2xs"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#0C5CC4]" />
          <span>Simulate in Staff Dashboard</span>
        </Link>
      </div>

      {/* Hero Card: Order Status Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-md relative overflow-hidden ${
        isReady
          ? 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white border-emerald-500'
          : isCancelled
          ? 'bg-slate-800 text-white border-slate-700'
          : 'bg-gradient-to-br from-[#0C5CC4] to-[#084393] text-white border-[#0C5CC4]'
      }`}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                Express Pre-Order
              </span>
              <span className="text-xs text-white/80">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight">
                {order.id}
              </h1>
              <span className="text-sm font-bold bg-[#FFD23F] text-[#12233F] px-2.5 py-0.5 rounded-lg shadow-xs">
                PIN: {order.pickupCode}
              </span>
            </div>

            <p className="text-sm text-white/90 font-medium">
              Customer: <strong>{order.customerName}</strong> ({order.customerPhone})
            </p>
          </div>

          {/* Status Indicator Pill */}
          <div className="sm:text-right shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-[#12233F] shadow-sm font-black text-sm uppercase tracking-wider">
              <span className={`w-3 h-3 rounded-full ${
                isReady ? 'bg-emerald-500 animate-ping' : 'bg-[#0C5CC4] animate-pulse'
              }`} />
              <span>{order.status.replace('-', ' ')}</span>
            </div>
            <p className="text-xs text-white/80 mt-1 font-semibold">
              {isReady ? 'Ready for express collection' : `Est. Pickup: ${order.estimatedPickupTime}`}
            </p>
          </div>
        </div>
      </div>

      {/* 5-Stage Live Progress Stepper */}
      {!isCancelled && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-heading text-lg font-black text-[#12233F]">
            Live Order Progress
          </h3>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div 
                    key={step.status} 
                    className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-3 sm:p-2 rounded-2xl transition-all ${
                      isCurrent 
                        ? 'bg-[#EEF5FF] border border-[#0C5CC4]/20' 
                        : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors shadow-xs ${
                      isPassed
                        ? 'bg-[#0C5CC4] text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold leading-tight ${
                        isPassed ? 'text-[#12233F]' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[#5B6E8C] sm:hidden">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Demo Simulator Trigger */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#5B6E8C] flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-[#0C5CC4]" />
              <strong>Demo Quick Action:</strong> Fast-forward order stage:
            </span>
            <div className="flex gap-2">
              {order.status !== 'preparing' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 text-[11px]"
                >
                  Set Preparing
                </button>
              )}
              {order.status !== 'ready' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                >
                  Set Ready
                </button>
              )}
              {order.status !== 'collected' && (
                <button
                  onClick={() => updateOrderStatus(order.id, 'collected')}
                  className="px-2.5 py-1 bg-[#12233F] hover:bg-black text-white font-bold rounded-lg text-[11px]"
                >
                  Set Collected
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pickup QR Code & Instructions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* QR Code Container */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="p-2.5 bg-white rounded-xl shadow-xs">
            <QRCodeSVG
              value={`https://bingchun.ng/express?order=${order.id}&code=${order.pickupCode}`}
              size={140}
              level="M"
              fgColor="#12233F"
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
            Pickup QR: {order.pickupCode}
          </span>
        </div>

        {/* Pickup Instructions */}
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0C5CC4]" />
            <h3 className="font-heading text-lg font-bold text-[#12233F]">
              Pickup Instructions
            </h3>
          </div>
          <div className="space-y-1 text-xs text-[#5B6E8C]">
            <p className="font-bold text-[#12233F] text-sm">{order.branchName}</p>
            <p>{order.branchAddress}</p>
          </div>
          <div className="p-3 bg-[#EEF5FF] rounded-2xl text-xs text-[#12233F] space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-[#0C5CC4]">
              <QrCode className="w-3.5 h-3.5" />
              <span>Show this screen at the Express Pickup counter.</span>
            </p>
            <p className="text-[11px] text-[#5B6E8C]">
              Staff will verify order <strong>#{order.id}</strong> or your 4-character pickup PIN <strong>{order.pickupCode}</strong> to hand you your chilled drinks.
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Order Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#12233F]">
          Ordered Drinks &amp; Treats
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#0C5CC4]/10 text-[#0C5CC4] px-2 py-0.5 rounded-lg">
                    {item.quantity}×
                  </span>
                  <h4 className="text-sm font-bold text-[#12233F]">
                    {item.productName}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1 text-[11px] text-[#5B6E8C]">
                  {item.customization.size && (
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded-md font-medium">
                      {item.customization.size}
                    </span>
                  )}
                  {item.customization.sweetness && (
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded-md">
                      Sugar: {item.customization.sweetness}
                    </span>
                  )}
                  {item.customization.ice && (
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {item.customization.ice}
                    </span>
                  )}
                  {item.customization.servingType && (
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {item.customization.servingType}
                    </span>
                  )}
                  {item.customization.toppings.map((t) => (
                    <span key={t.id} className="bg-blue-50 text-[#0C5CC4] px-1.5 py-0.5 rounded-md font-semibold">
                      +{t.name}
                    </span>
                  ))}
                </div>
                {item.customization.notes && (
                  <p className="text-[11px] italic text-[#5B6E8C]">
                    &ldquo;{item.customization.notes}&rdquo;
                  </p>
                )}
              </div>

              <span className="text-sm font-black text-[#12233F]">
                {formatNaira(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Totals */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-[#5B6E8C]">
            <span>Payment Method</span>
            <span className="font-bold text-[#12233F]">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-[#5B6E8C]">
            <span>Payment Status</span>
            <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#12233F] pt-2 border-t border-slate-100">
            <span>Total Paid</span>
            <span className="text-xl font-black text-[#0C5CC4]">
              {formatNaira(order.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Demo Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#5B6E8C] flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Note on Demo Operations:</strong> Real SMS/WhatsApp notifications and automated barcode scanners are simulated in this concept prototype.
        </p>
      </div>

    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col">
      <Header />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-xs font-bold text-slate-500 animate-pulse">Loading order tracking...</div>
        </div>
      }>
        <OrderTrackingContent />
      </Suspense>
      <BranchSelectorModal />
      <CartDrawer />
    </div>
  );
}

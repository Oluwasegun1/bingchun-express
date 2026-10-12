'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { formatNaira } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  Clock, 
  CreditCard, 
  Building, 
  Store, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  User
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const { 
    selectedBranch, 
    cart, 
    cartTotal, 
    createOrder, 
    setIsCartOpen 
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Card (Demo)' | 'Bank Transfer (Demo)' | 'Pay at Store (Demo)'>('Card (Demo)');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your name for order collection.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number for pickup notifications.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate instant secure payment processing
    setTimeout(() => {
      const order = createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod,
        notes: orderNotes.trim() || undefined,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0C5CC4', '#FFD23F', '#1e90ef', '#ffffff'],
        });
      } catch {}

      setIsSubmitting(false);
      onClose();
      setIsCartOpen(false);
      router.push(`/track/${order.id}`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#EEF5FF] to-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0C5CC4]">
                Express Pre-Order
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-black text-[#12233F]">
              Checkout &amp; Pickup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Pickup Branch Summary Card */}
          <div className="p-4 rounded-2xl bg-[#EEF5FF] border border-[#0C5CC4]/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-[#0C5CC4] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Pickup Location
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Est. {selectedBranch.estimatedPrepMins}
              </span>
            </div>
            <p className="font-bold text-sm text-[#12233F]">{selectedBranch.name}</p>
            <p className="text-xs text-[#5B6E8C]">{selectedBranch.mallUnit || selectedBranch.address}</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0C5CC4]" />
              <span>Full Name / Pickup Name</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amina Adeleke"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#0C5CC4] text-sm text-[#12233F] font-medium"
            />
          </div>

          {/* Customer Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#0C5CC4]" />
              <span>Phone Number (for SMS &amp; Pickup PIN)</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0803 123 4567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#0C5CC4] text-sm text-[#12233F] font-medium"
            />
          </div>

          {/* Demo Payment Methods */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F]">
                Payment Option
              </label>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Demo simulation
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'Card (Demo)' as const,
                  title: 'Pay with Card (Simulated)',
                  desc: 'Instant mock confirmation via Paystack/Monnify prototype',
                  icon: CreditCard,
                },
                {
                  id: 'Bank Transfer (Demo)' as const,
                  title: 'Bank Transfer (Simulated)',
                  desc: 'Mock instant Nigerian bank transfer verification',
                  icon: Building,
                },
                {
                  id: 'Pay at Store (Demo)' as const,
                  title: 'Pay at Counter on Pickup',
                  desc: 'Pay cash, POS, or transfer directly at store counter',
                  icon: Store,
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                    paymentMethod === opt.id
                      ? 'border-[#0C5CC4] bg-[#EEF5FF] text-[#0C5CC4]'
                      : 'border-slate-200 hover:border-slate-300 text-[#12233F]'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    paymentMethod === opt.id ? 'bg-[#0C5CC4] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <opt.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#12233F]">{opt.title}</p>
                    <p className="text-[11px] text-[#5B6E8C]">{opt.desc}</p>
                  </div>
                  {paymentMethod === opt.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#0C5CC4] shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Order Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F] block">
              Order Notes / Requests (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Please put ice cream in separate cup bag"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#12233F]"
            />
          </div>

          {/* Disclaimer callout */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-[11px] text-[#5B6E8C]">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Demo Order:</strong> No real payment is deducted and no actual drinks will be prepared by physical store staff.
            </span>
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold text-[#5B6E8C] block">Total to Pay</span>
              <span className="text-xl font-black text-[#12233F] tracking-tight">
                {formatNaira(cartTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#0C5CC4] hover:bg-[#084393] disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-[#0C5CC4]/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Generating Demo Order...</span>
                </>
              ) : (
                <>
                  <span>Place Express Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

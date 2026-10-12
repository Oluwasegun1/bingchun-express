'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { formatNaira } from '@/lib/utils';
import CheckoutModal from '@/components/CheckoutModal';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartItemQty, 
    cartTotal, 
    cartCount,
    selectedBranch,
    setIsBranchModalOpen 
  } = useStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#EEF5FF] to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0C5CC4] text-white flex items-center justify-center shadow-md shadow-[#0C5CC4]/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-black text-[#12233F]">
                    Your Express Bag
                  </h2>
                  <p className="text-xs text-[#5B6E8C]">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for express prep
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Branch Reminder Banner */}
            <div className="bg-[#EEF5FF] px-5 py-3 border-b border-[#0C5CC4]/10 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <MapPin className="w-4 h-4 text-[#0C5CC4] shrink-0" />
                <div className="truncate">
                  <p className="text-[11px] font-bold text-[#0C5CC4] uppercase tracking-wider">Pickup at:</p>
                  <p className="text-xs font-bold text-[#12233F] truncate">{selectedBranch.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="text-xs font-bold text-[#0C5CC4] hover:underline shrink-0 ml-2"
              >
                Change
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-[#EEF5FF] text-[#0C5CC4] flex items-center justify-center mb-2">
                    <ShoppingBag className="w-8 h-8 stroke-1" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#12233F]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#5B6E8C] max-w-xs">
                    Explore our fruit milk tea, smoothies, soft-serve ice cream, and handcrafted toppings.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-3 px-5 py-2.5 rounded-2xl bg-[#0C5CC4] text-white text-xs font-bold shadow-xs hover:bg-[#084393] transition-colors"
                  >
                    Browse Drinks &amp; Treats
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex gap-3 transition-colors relative group"
                  >
                    {/* Item Image */}
                    <div className="relative w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading text-sm font-bold text-[#12233F] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Pills */}
                      <div className="flex flex-wrap gap-1 text-[10px] text-[#5B6E8C]">
                        {item.customization.size && (
                          <span className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
                            {item.customization.size}
                          </span>
                        )}
                        {item.customization.sweetness && (
                          <span className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                            Sugar: {item.customization.sweetness}
                          </span>
                        )}
                        {item.customization.ice && (
                          <span className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                            {item.customization.ice}
                          </span>
                        )}
                        {item.customization.servingType && (
                          <span className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
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
                        <p className="text-[10px] italic text-[#5B6E8C] pt-0.5">
                          Note: &ldquo;{item.customization.notes}&rdquo;
                        </p>
                      )}

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-1.5">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-0.5 rounded-xl">
                          <button
                            onClick={() => updateCartItemQty(item.id, -1)}
                            className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#12233F] px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQty(item.id, 1)}
                            className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-[#12233F]">
                          {formatNaira(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Actions */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-white space-y-3.5">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#5B6E8C]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#12233F]">{formatNaira(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#5B6E8C]">
                    <span>Express Pickup Service</span>
                    <span className="font-semibold text-emerald-600">Free (Demo)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#12233F] pt-2 border-t border-slate-100">
                    <span>Total Amount</span>
                    <span className="text-lg font-black text-[#0C5CC4]">{formatNaira(cartTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#0C5CC4] hover:bg-[#084393] text-white font-extrabold text-sm shadow-md shadow-[#0C5CC4]/25 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFD23F]" />
                    <span>Express Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{formatNaira(cartTotal)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}

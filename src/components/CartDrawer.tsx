'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, Pencil, MapPin, Clock } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { CartItem } from '@/types';
import { formatNaira } from '@/lib/utils';
import { useModal } from '@/lib/useModal';
import BrandLogo from '@/components/BrandLogo';
import ProductSheet from '@/components/ProductSheet';

function describe(item: CartItem): string {
  const c = item.customization;
  const isIceCream = item.product.category === 'Ice Cream' || !!item.product.prepareOnArrival;
  const parts: string[] = [];
  if (isIceCream) {
    const type = c.productType || (item.product.name.toLowerCase().includes('cone') ? 'Cone' : 'Cup');
    parts.push(`Type: ${type}`);
    if (c.flavor) parts.push(`Flavour: ${c.flavor}`);
  } else {
    if (c.size) parts.push(c.size.split(' ')[0]);
    if (c.sweetness) parts.push(`${c.sweetness} sugar`);
    if (c.ice) parts.push(c.ice);
    if (c.flavor) parts.push(`Flavour: ${c.flavor}`);
    if (c.servingType) parts.push(c.servingType);
  }
  if (c.toppings?.length) parts.push(c.toppings.map((t) => t.name).join(', '));
  return parts.join(' · ');
}

export default function CartDrawer() {
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateCartItemQty,
    removeFromCart,
    updateCartItem,
    clearCart,
    selectedBranch,
    setIsBranchModalOpen,
  } = useStore();

  const [editing, setEditing] = useState<CartItem | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const close = () => {
    setConfirmClear(false);
    setIsCartOpen(false);
  };
  const ref = useModal<HTMLElement>(isCartOpen && !editing, close);

  if (!isCartOpen) return null;

  const hasIceCream = cart.some((i) => i.product.category === 'Ice Cream' || i.product.prepareOnArrival);

  return (
    <div className="anim-fade fixed inset-0 z-50 flex justify-end bg-ink/50" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        tabIndex={-1}
        className="anim-right flex h-[100dvh] w-full flex-col bg-white shadow-pop sm:max-w-md"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="bag-title" className="text-xl font-extrabold">
            Your bag{cartCount > 0 && <span className="ml-2 text-sm font-semibold text-muted">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>}
          </h2>
          <button onClick={close} aria-label="Close bag" className="flex h-11 w-11 items-center justify-center rounded-ctl text-muted hover:bg-canvas hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <BrandLogo size={120} />
            <h3 className="mt-4 text-lg font-bold">Your bag is empty</h3>
            <p className="mt-1 max-w-xs text-sm text-muted">Pick a drink or prepaid ice cream you like. We&apos;ll have it ready when you arrive.</p>
            <button onClick={close} className="mt-6 h-12 rounded-ctl bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark">
              Browse the menu
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                close();
                setIsBranchModalOpen(true);
              }}
              className="mx-5 mt-4 flex items-center gap-2 rounded-ctl bg-brand-50 px-3 py-2.5 text-left text-[13px]"
            >
              <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0 flex-1 truncate">
                <span className="text-muted">Pickup from </span>
                <span className="font-semibold">{selectedBranch.name}</span>
              </span>
              <span className="font-semibold text-brand">Change</span>
            </button>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {cart.map((item) => {
                const isIce = item.product.category === 'Ice Cream' || !!item.product.prepareOnArrival;
                return (
                  <li key={item.id} className="flex gap-3.5 py-4">
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-brand-50">
                      <Image src={item.product.image} alt="" fill sizes="72px" className="object-cover" unoptimized />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold leading-snug">{item.product.name}</h3>
                          <p className="text-[11px] text-muted">
                            {formatNaira(item.unitPrice)} each · Subtotal: <span className="font-bold text-ink">{formatNaira(item.totalPrice)}</span>
                          </p>
                        </div>
                        <p className="text-sm font-bold">{formatNaira(item.totalPrice)}</p>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted">{describe(item)}</p>
                      {isIce && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                            🍨 Prepaid · Scoop on Arrival
                          </span>
                        </div>
                      )}
                      {item.customization.notes && <p className="mt-0.5 text-xs italic text-muted">“{item.customization.notes}”</p>}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex h-9 items-center rounded-ctl border border-line-strong" role="group" aria-label={`Quantity for ${item.product.name}`}>
                          <button onClick={() => updateCartItemQty(item.id, -1)} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-brand">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartItemQty(item.id, 1)} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-brand">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => setEditing(item)} className="flex h-9 items-center gap-1.5 rounded-ctl px-2.5 text-xs font-semibold text-brand hover:bg-brand-50">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.product.name}`} className="flex h-9 w-9 items-center justify-center rounded-ctl text-muted hover:bg-danger-soft hover:text-danger">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-line bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              {hasIceCream && (
                <div className="mb-3 rounded-xl border border-brand/20 bg-brand-50/70 p-2.5 text-xs text-brand-dark">
                  <p className="font-bold flex items-center gap-1">
                    <span>🍨</span> Prepaid Ice Cream Pickup
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Pre-paid with your order. Our team prepares and scoops it upon your arrival so it doesn’t melt!
                  </p>
                </div>
              )}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted">
                  <dt>Subtotal</dt>
                  <dd>{formatNaira(cartTotal)}</dd>
                </div>
                <div className="flex justify-between text-muted">
                  <dt>Service fee</dt>
                  <dd>₦0</dd>
                </div>
                <div className="flex justify-between pt-1 text-base font-extrabold">
                  <dt>Total payable</dt>
                  <dd className="text-brand">{formatNaira(cartTotal)}</dd>
                </div>
              </dl>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" aria-hidden /> Usually ready in {selectedBranch.estimatedPrepMins}
              </p>

              <Link
                href="/checkout"
                onClick={close}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-ctl bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-dark active:bg-brand-900"
              >
                Checkout · {formatNaira(cartTotal)}
              </Link>

              {confirmClear ? (
                <div className="mt-2 flex items-center justify-between rounded-ctl bg-danger-soft px-3 py-2 text-xs" role="alert">
                  <span className="font-semibold text-danger">Remove everything from your bag?</span>
                  <span className="flex gap-1">
                    <button onClick={() => setConfirmClear(false)} className="h-8 rounded-md px-2.5 font-semibold text-ink-soft hover:bg-white">Keep</button>
                    <button
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="h-8 rounded-md bg-danger px-2.5 font-semibold text-white"
                    >
                      Clear bag
                    </button>
                  </span>
                </div>
              ) : (
                <button onClick={() => setConfirmClear(true)} className="mt-1 h-10 w-full rounded-ctl text-xs font-semibold text-muted hover:text-danger">
                  Clear bag
                </button>
              )}
            </div>
          </>
        )}
      </aside>

      {editing && (
        <ProductSheet
          product={editing.product}
          mode="edit"
          initial={{ customization: editing.customization, quantity: editing.quantity }}
          onClose={() => setEditing(null)}
          onSubmit={(customization, quantity) => {
            updateCartItem(editing.id, customization, quantity);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

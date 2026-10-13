'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Clock, Loader2, MapPin, Lock } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useStore, normalisePhone } from '@/context/StoreContext';
import { formatNaira } from '@/lib/utils';
import { CartItem } from '@/types';

type Payment = 'Card (Demo)' | 'Bank Transfer (Demo)' | 'Pay at Store (Demo)';

const PAYMENTS: { id: Payment; title: string; hint: string }[] = [
  { id: 'Card (Demo)', title: 'Card', hint: 'Simulated. No card is charged.' },
  { id: 'Bank Transfer (Demo)', title: 'Bank transfer', hint: 'Simulated. No transfer is needed.' },
  { id: 'Pay at Store (Demo)', title: 'Pay at pickup', hint: 'Pay when you collect your drinks.' },
];

function lineDetail(item: CartItem) {
  const c = item.customization;
  return [c.size?.split(' ')[0], c.sweetness && `${c.sweetness} sugar`, c.ice, c.servingType, c.toppings?.map((t) => t.name).join(', ')]
    .filter(Boolean)
    .join(' · ');
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, user, hydrated, selectedBranch, setIsBranchModalOpen, createOrder } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState<Payment>('Card (Demo)');
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Prefill from the signed-in account once it is available.
  const [prefilled, setPrefilled] = useState(false);
  if (user && !prefilled) {
    setPrefilled(true);
    setName(user.name);
    setPhone(`0${user.phone}`);
  }

  const nameErr = name.trim().length < 2 ? 'Enter the name for this order.' : '';
  const phoneErr = normalisePhone(phone).length < 10 ? 'Enter a valid phone number so we can reach you.' : '';

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (nameErr || phoneErr) return;
    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        customerName: name.trim(),
        customerPhone: `+234 ${normalisePhone(phone)}`,
        paymentMethod: payment,
        notes: notes.trim() || undefined,
      });
      setPlaced(true);
      router.push(`/track/${order.id}?placed=1`);
    }, 1100);
  };

  if (!hydrated || placed) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <p className="mt-3 text-sm text-muted">{placed ? 'Order placed. Taking you to tracking…' : 'Loading your bag…'}</p>
        </div>
      </AppShell>
    );
  }

  if (cart.length === 0) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="text-2xl font-extrabold">Your bag is empty</h1>
          <p className="mt-2 text-sm text-muted">Add a drink to your bag before checking out.</p>
          <Link href="/#menu" className="mt-6 inline-flex h-12 items-center rounded-ctl bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark">Browse the menu</Link>
        </div>
      </AppShell>
    );
  }

  const inputCls = (err: string) =>
    `h-12 w-full rounded-ctl border bg-white px-3.5 placeholder:text-faint ${touched && err ? 'border-danger' : 'border-line-strong'}`;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <p className="mt-1 text-sm text-muted">Review your order and choose how you&apos;d like to pay. This is a simulation, so no money moves.</p>

        {!user && (
          <div className="mt-6 flex flex-col gap-3 rounded-card border border-brand-200 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <h2 className="text-base font-bold text-brand-900">Sign in to place your order</h2>
                <p className="text-sm text-ink-soft">Your bag is saved. We&apos;ll bring you straight back here afterwards.</p>
              </div>
            </div>
            <Link href="/auth?next=/checkout" className="inline-flex h-12 shrink-0 items-center justify-center rounded-ctl bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark">
              Sign in or sign up
            </Link>
          </div>
        )}

        <form onSubmit={place} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-card border border-line bg-white p-5 sm:p-6">
              <h2 className="text-base font-bold">Pickup</h2>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="font-semibold">{selectedBranch.name}</p>
                    <p className="text-sm text-muted">{selectedBranch.address}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-soft"><Clock className="h-4 w-4 text-brand" aria-hidden /> Ready in about {selectedBranch.estimatedPrepMins}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsBranchModalOpen(true)} className="h-10 shrink-0 rounded-ctl px-3 text-sm font-semibold text-brand hover:bg-brand-50">Change</button>
              </div>
            </section>

            <section className="rounded-card border border-line bg-white p-5 sm:p-6">
              <h2 className="text-base font-bold">Your details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-name" className="mb-1.5 block text-sm font-semibold">Name</label>
                  <input id="co-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={touched && !!nameErr} aria-describedby={touched && nameErr ? 'co-name-err' : undefined} className={inputCls(nameErr)} />
                  {touched && nameErr && <p id="co-name-err" className="mt-1.5 text-xs text-danger">{nameErr}</p>}
                </div>
                <div>
                  <label htmlFor="co-phone" className="mb-1.5 block text-sm font-semibold">Phone</label>
                  <input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={touched && !!phoneErr} aria-describedby={touched && phoneErr ? 'co-phone-err' : undefined} className={inputCls(phoneErr)} />
                  {touched && phoneErr && <p id="co-phone-err" className="mt-1.5 text-xs text-danger">{phoneErr}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="co-notes" className="mb-1.5 block text-sm font-semibold">Order note <span className="font-normal text-muted">(optional)</span></label>
                <textarea id="co-notes" rows={2} maxLength={200} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything the team should know?" className="w-full resize-none rounded-ctl border border-line-strong bg-white px-3.5 py-3 placeholder:text-faint" />
              </div>
            </section>

            <fieldset className="rounded-card border border-line bg-white p-5 sm:p-6">
              <legend className="px-0 text-base font-bold">Payment <span className="ml-1 rounded bg-warn-soft px-1.5 py-0.5 text-[11px] font-bold text-warn">DEMO</span></legend>
              <div className="mt-3 space-y-2">
                {PAYMENTS.map((p) => {
                  const on = payment === p.id;
                  return (
                    <label key={p.id} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-ctl border px-4 py-3 transition-colors ${on ? 'border-brand bg-brand-50 ring-1 ring-brand' : 'border-line-strong hover:border-brand-300'}`}>
                      <input type="radio" name="payment" value={p.id} checked={on} onChange={() => setPayment(p.id)} className="sr-only" />
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${on ? 'border-brand bg-brand text-white' : 'border-line-strong'}`}>{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                      <span>
                        <span className="block text-sm font-semibold">{p.title}</span>
                        <span className="block text-xs text-muted">{p.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-card border border-line bg-white p-5 sm:p-6" aria-labelledby="summary-title">
              <h2 id="summary-title" className="text-base font-bold">Order summary</h2>
              <ul className="mt-4 divide-y divide-line">
                {cart.map((item) => (
                  <li key={item.id} className="flex gap-3 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                      <Image src={item.product.image} alt="" fill sizes="56px" className="object-cover" unoptimized />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug">{item.quantity} × {item.product.name}</p>
                      <p className="line-clamp-2 text-xs text-muted">{lineDetail(item)}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatNaira(item.totalPrice)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1.5 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{formatNaira(cartTotal)}</dd></div>
                <div className="flex justify-between text-muted"><dt>Service fee</dt><dd>₦0</dd></div>
                <div className="flex justify-between pt-1.5 text-lg font-extrabold"><dt>Total</dt><dd>{formatNaira(cartTotal)}</dd></div>
              </dl>
              <button type="submit" disabled={!user || submitting} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-ctl bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-dark active:bg-brand-900 disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-white">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Placing order…' : user ? `Place demo order · ${formatNaira(cartTotal)}` : 'Sign in to place order'}
              </button>
              <p className="mt-3 text-center text-xs text-muted">Demo only. This does not create a real order or charge you.</p>
            </section>
          </aside>
        </form>
      </div>
    </AppShell>
  );
}

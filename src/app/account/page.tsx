'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, LogOut, RotateCcw, Receipt, User as UserIcon } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useStore, normalisePhone } from '@/context/StoreContext';
import { formatNaira, formatDate, formatTime } from '@/lib/utils';
import { STATUS_META } from '@/lib/status';
import { Order } from '@/types';

type Tab = 'orders' | 'favourites' | 'profile';

export default function AccountPage() {
  const { user, hydrated, signOut, orders, products, favourites, toggleFavourite, addToCart, setIsCartOpen, setSelectedProduct, showNotification } = useStore();
  const [tab, setTab] = useState<Tab>('orders');
  const [confirmOut, setConfirmOut] = useState(false);

  const myOrders = useMemo(
    () => (user ? orders.filter((o) => normalisePhone(o.customerPhone) === user.phone) : []),
    [orders, user]
  );
  const favProducts = products.filter((p) => favourites.includes(p.id));

  const reorder = (o: Order) => {
    let added = 0;
    o.items.forEach((it) => {
      const p = products.find((x) => x.id === it.productId) ?? products.find((x) => x.name === it.productName);
      if (p && p.available) {
        addToCart(p, it.customization, it.quantity);
        added += 1;
      }
    });
    if (added) setIsCartOpen(true);
    else showNotification('Those drinks are no longer available');
  };

  if (!hydrated) {
    return <AppShell><div className="py-24 text-center text-sm text-muted">Loading…</div></AppShell>;
  }

  if (!user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <UserIcon className="mx-auto h-10 w-10 text-brand" />
          <h1 className="mt-4 text-2xl font-extrabold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-muted">See your orders, reorder favourites and track pickups.</p>
          <Link href="/auth?next=/account" className="mt-6 inline-flex h-12 items-center rounded-ctl bg-brand px-7 text-sm font-bold text-white hover:bg-brand-dark">Sign in or sign up</Link>
        </div>
      </AppShell>
    );
  }

  const tabBtn = (t: Tab, label: string) => (
    <button role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`h-11 border-b-2 px-1 text-sm font-bold transition-colors ${tab === t ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}>
      {label}
    </button>
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-extrabold text-white">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            <h1 className="text-2xl font-extrabold">Hi, {user.name.split(' ')[0]}</h1>
            <p className="text-sm text-muted">0{user.phone}</p>
          </div>
        </div>

        <div role="tablist" className="mt-8 flex gap-6 border-b border-line">
          {tabBtn('orders', `Orders${myOrders.length ? ` (${myOrders.length})` : ''}`)}
          {tabBtn('favourites', `Favourites${favProducts.length ? ` (${favProducts.length})` : ''}`)}
          {tabBtn('profile', 'Profile')}
        </div>

        <div className="mt-6">
          {tab === 'orders' &&
            (myOrders.length === 0 ? (
              <div className="rounded-card border border-line bg-white px-6 py-14 text-center">
                <Receipt className="mx-auto h-8 w-8 text-faint" />
                <h2 className="mt-3 text-lg font-bold">No orders yet</h2>
                <p className="mt-1 text-sm text-muted">Your orders will appear here after checkout.</p>
                <Link href="/#menu" className="mt-5 inline-flex h-11 items-center rounded-ctl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-dark">Browse the menu</Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {myOrders.map((o) => (
                  <li key={o.id} className="rounded-card border border-line bg-white p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-bold">{o.id}</p>
                        <p className="text-xs text-muted">{formatDate(o.createdAt)} · {formatTime(o.createdAt)} · {o.branchName}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_META[o.status].badge}`}>{STATUS_META[o.status].label}</span>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                      {o.items.map((it, i) => (
                        <li key={i}>{it.quantity} × {it.productName}</li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                      <p className="text-sm font-bold">{formatNaira(o.total)}</p>
                      <div className="flex gap-2">
                        <Link href={`/track/${o.id}`} className="inline-flex h-10 items-center rounded-ctl border border-line-strong px-4 text-sm font-semibold hover:border-brand hover:text-brand">View details</Link>
                        <button onClick={() => reorder(o)} className="inline-flex h-10 items-center gap-1.5 rounded-ctl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">
                          <RotateCcw className="h-4 w-4" /> Reorder
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {tab === 'favourites' &&
            (favProducts.length === 0 ? (
              <div className="rounded-card border border-line bg-white px-6 py-14 text-center">
                <Heart className="mx-auto h-8 w-8 text-faint" />
                <h2 className="mt-3 text-lg font-bold">No favourites yet</h2>
                <p className="mt-1 text-sm text-muted">Tap the heart on any drink to save it for later.</p>
                <Link href="/#menu" className="mt-5 inline-flex h-11 items-center rounded-ctl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-dark">Find a favourite</Link>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {favProducts.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-card border border-line bg-white p-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-50"><Image src={p.image} alt="" fill sizes="80px" className="object-cover" unoptimized /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      <p className="text-sm text-muted">{formatNaira(p.basePrice)}</p>
                      <div className="mt-1.5 flex gap-2">
                        <button onClick={() => setSelectedProduct(p)} disabled={!p.available} className="h-9 rounded-ctl bg-brand px-3 text-xs font-bold text-white hover:bg-brand-dark disabled:bg-line-strong">Order</button>
                        <button onClick={() => toggleFavourite(p.id)} className="h-9 rounded-ctl px-3 text-xs font-semibold text-muted hover:text-danger">Remove</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {tab === 'profile' && (
            <div className="max-w-md rounded-card border border-line bg-white p-5 sm:p-6">
              <dl className="space-y-4 text-sm">
                <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">Name</dt><dd className="mt-1 font-semibold">{user.name}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">Phone</dt><dd className="mt-1 font-semibold">0{user.phone}</dd></div>
              </dl>
              <p className="mt-4 rounded-ctl bg-warn-soft px-3 py-2 text-xs text-warn">Demo account stored only in this browser.</p>
              {confirmOut ? (
                <div className="mt-5 flex items-center gap-2" role="alert">
                  <button onClick={() => { signOut(); setConfirmOut(false); }} className="h-11 flex-1 rounded-ctl bg-danger text-sm font-bold text-white">Yes, sign out</button>
                  <button onClick={() => setConfirmOut(false)} className="h-11 flex-1 rounded-ctl border border-line-strong text-sm font-semibold">Stay signed in</button>
                </div>
              ) : (
                <button onClick={() => setConfirmOut(true)} className="mt-5 inline-flex h-11 items-center gap-2 rounded-ctl border border-line-strong px-4 text-sm font-semibold hover:border-danger hover:text-danger">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

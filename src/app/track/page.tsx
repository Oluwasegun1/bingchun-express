'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useStore, normalisePhone } from '@/context/StoreContext';
import { formatNaira, formatTime } from '@/lib/utils';
import { STATUS_META } from '@/lib/status';

export default function TrackLookupPage() {
  const router = useRouter();
  const { getOrderById, user, orders } = useStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const mine = user ? orders.filter((o) => normalisePhone(o.customerPhone) === user.phone) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = value.trim().toUpperCase().replace(/^#/, '');
    if (!id) return setError('Enter your order number, e.g. BC-1042.');
    if (!getOrderById(id)) return setError(`We couldn’t find ${id}. Check the number on your confirmation.`);
    router.push(`/track/${id}`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-extrabold">Track your order</h1>
        <p className="mt-2 text-sm text-muted">Enter your order number to see where your drinks are right now.</p>

        <form onSubmit={submit} noValidate className="mt-6">
          <label htmlFor="order-id" className="mb-1.5 block text-sm font-semibold">Order number</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
              <input id="order-id" value={value} onChange={(e) => { setValue(e.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'order-err' : undefined} placeholder="BC-1042" className={`h-12 w-full rounded-ctl border bg-white pl-10 pr-3 uppercase placeholder:normal-case placeholder:text-faint ${error ? 'border-danger' : 'border-line-strong'}`} />
            </div>
            <button type="submit" className="h-12 rounded-ctl bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark">Track</button>
          </div>
          {error && <p id="order-err" className="mt-2 text-sm text-danger" role="alert">{error}</p>}
          <p className="mt-2 text-xs text-muted">Demo tip: try <button type="button" onClick={() => setValue('BC-1042')} className="font-semibold text-brand hover:underline">BC-1042</button>.</p>
        </form>

        {mine.length > 0 && (
          <section className="mt-10" aria-labelledby="mine">
            <h2 id="mine" className="text-base font-bold">Your recent orders</h2>
            <ul className="mt-3 divide-y divide-line rounded-card border border-line bg-white">
              {mine.slice(0, 5).map((o) => (
                <li key={o.id}>
                  <Link href={`/track/${o.id}`} className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 hover:bg-canvas">
                    <span>
                      <span className="block text-sm font-bold">{o.id}</span>
                      <span className="block text-xs text-muted">{formatTime(o.createdAt)} · {formatNaira(o.total)}</span>
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_META[o.status].badge}`}>{STATUS_META[o.status].label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AppShell>
  );
}

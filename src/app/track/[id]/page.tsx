'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Clock, MapPin, RotateCcw, X } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useStore } from '@/context/StoreContext';
import { formatNaira, formatTime } from '@/lib/utils';
import { STATUS_META, STATUS_ORDER, TIMELINE } from '@/lib/status';
import { Order, OrderStatus } from '@/types';

function stamp(o: Order, s: OrderStatus): string | undefined {
  const t = o.timeline;
  const iso = { received: t.receivedAt, confirmed: t.confirmedAt, preparing: t.preparingAt, ready: t.readyAt, collected: t.collectedAt, cancelled: t.cancelledAt }[s];
  return iso ? formatTime(iso) : undefined;
}

function Tracking() {
  const params = useParams<{ id: string }>();
  const placed = useSearchParams().get('placed') === '1';
  const { getOrderById, updateOrderStatus, products, addToCart, setIsCartOpen, hydrated } = useStore();
  const order = getOrderById(params?.id ?? '');

  if (!hydrated) return <div className="py-24 text-center text-sm text-muted">Loading order…</div>;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Order not found</h1>
        <p className="mt-2 text-sm text-muted">We couldn’t find order {params?.id} in this browser’s demo data.</p>
        <Link href="/track" className="mt-6 inline-flex h-12 items-center rounded-ctl bg-brand px-6 text-sm font-bold text-white hover:bg-brand-dark">Try another order number</Link>
      </div>
    );
  }

  const cancelled = order.status === 'cancelled';
  const idx = STATUS_ORDER.indexOf(order.status);
  const ready = order.status === 'ready';
  const nextStatus = STATUS_ORDER[idx + 1];
  const meta = STATUS_META[order.status];

  const reorder = () => {
    let n = 0;
    order.items.forEach((it) => {
      const p = products.find((x) => x.id === it.productId) ?? products.find((x) => x.name === it.productName);
      if (p?.available) {
        addToCart(p, it.customization, it.quantity);
        n++;
      }
    });
    if (n) setIsCartOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {placed && (
        <div className="mb-6 flex items-center gap-3 rounded-card border border-success/20 bg-success-soft px-4 py-3 text-success" role="status">
          <Check className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">Demo order placed. Nothing was charged. Follow its progress below.</p>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Order number</p>
          <h1 className="text-4xl font-extrabold tracking-tight">{order.id}</h1>
        </div>
        <span className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${meta.badge}`}>{meta.label}</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          {ready && (
            <section className="anim-up rounded-card border-2 border-brand bg-white p-5 sm:p-7" aria-labelledby="ready-title">
              <h2 id="ready-title" className="text-xl font-extrabold text-brand">Your order is ready!</h2>
              <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
                <div className="rounded-xl border border-line bg-white p-3">
                  <QRCodeSVG value={`BINGCHUN-DEMO|${order.id}|${order.pickupCode}`} size={132} fgColor="#0F1B2D" />
                  <p className="mt-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted">Demo code</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Pickup code</p>
                  <p className="text-4xl font-extrabold tracking-[0.2em] text-ink">{order.pickupCode}</p>
                  <p className="mt-3 text-sm text-ink-soft">Head to the <b>express pickup point</b> at {order.branchName} and show this screen with your order number.</p>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-card border border-line bg-white p-5 sm:p-7" aria-labelledby="progress">
            <h2 id="progress" className="text-base font-bold">Order progress</h2>
            {cancelled ? (
              <div className="mt-4 flex items-center gap-3 rounded-ctl bg-danger-soft p-4 text-danger">
                <X className="h-5 w-5" /> <p className="text-sm font-semibold">This order was cancelled{stamp(order, 'cancelled') ? ` at ${stamp(order, 'cancelled')}` : ''}.</p>
              </div>
            ) : (
              <ol className="mt-5">
                {TIMELINE.map((step, i) => {
                  const done = i < idx || order.status === 'collected';
                  const current = i === idx && order.status !== 'collected';
                  const time = stamp(order, step.status);
                  return (
                    <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0" aria-current={current ? 'step' : undefined}>
                      {i < TIMELINE.length - 1 && <span aria-hidden className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${i < idx ? 'bg-brand' : 'bg-line'}`} />}
                      <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${done ? 'border-brand bg-brand text-white' : current ? 'border-brand bg-white text-brand ring-4 ring-brand-100' : 'border-line-strong bg-white text-faint'}`}>
                        {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={`text-sm font-bold ${done || current ? 'text-ink' : 'text-faint'}`}>{step.label}{current && <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand">Now</span>}</p>
                          {time && <p className="text-xs text-muted">{time}</p>}
                        </div>
                        <p className={`text-sm ${done || current ? 'text-muted' : 'text-faint'}`}>{step.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {!cancelled && order.status !== 'collected' && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-ctl border border-dashed border-line-strong bg-canvas p-3.5">
                <p className="text-xs text-muted"><b className="text-ink-soft">Demo control.</b> In real use, staff move the order along.</p>
                {nextStatus && (
                  <button onClick={() => updateOrderStatus(order.id, nextStatus)} className="h-9 rounded-ctl border border-line-strong bg-white px-3 text-xs font-bold hover:border-brand hover:text-brand">
                    Simulate: {STATUS_META[nextStatus].label}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-card border border-line bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold">Pickup details</h2>
            <div className="mt-3 space-y-3 text-sm">
              <p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden /><span><b>{order.branchName}</b><br /><span className="text-muted">{order.branchAddress}</span></span></p>
              <p className="flex gap-3"><Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden /><span>Estimated ready time: <b>{order.estimatedPickupTime}</b></span></p>
              {!ready && <p className="flex gap-3"><span className="h-4 w-4 shrink-0" /><span className="text-muted">Pickup code <b className="tracking-widest text-ink">{order.pickupCode}</b></span></p>}
            </div>
          </section>

          <section className="rounded-card border border-line bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold">Order summary</h2>
            <ul className="mt-3 divide-y divide-line">
              {order.items.map((it, i) => {
                const c = it.customization;
                const detail = [c.size?.split(' ')[0], c.sweetness && `${c.sweetness} sugar`, c.ice, c.servingType, c.toppings?.map((t) => t.name).join(', ')].filter(Boolean).join(' · ');
                return (
                  <li key={i} className="flex gap-3 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50"><Image src={it.productImage} alt="" fill sizes="56px" className="object-cover" unoptimized /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{it.quantity} × {it.productName}</p>
                      {detail && <p className="line-clamp-2 text-xs text-muted">{detail}</p>}
                    </div>
                    <p className="text-sm font-semibold">{formatNaira(it.totalPrice)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-extrabold"><span>Total</span><span>{formatNaira(order.total)}</span></div>
            <p className="mt-1 text-xs text-muted">{order.paymentMethod} · {order.paymentStatus === 'Paid' ? 'Simulated payment' : 'Pay when you collect'}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={reorder} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-ctl border border-line-strong text-sm font-semibold hover:border-brand hover:text-brand"><RotateCcw className="h-4 w-4" /> Reorder</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading order…</div>}>
        <Tracking />
      </Suspense>
    </AppShell>
  );
}

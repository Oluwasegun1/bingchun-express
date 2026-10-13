'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const { resetDemoData } = useStore();
  const link = 'text-sm text-muted transition-colors hover:text-brand';

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo size={84} />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            An independent product concept for ordering ahead and express pickup at Bing Chun Nigeria.
          </p>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-ink">Order</p>
          <Link href="/" className={link}>Menu</Link>
          <Link href="/branches" className={link}>Branches &amp; hours</Link>
          <Link href="/track" className={link}>Track an order</Link>
          <Link href="/account" className={link}>My account</Link>
        </nav>
        <div className="grid content-start gap-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-ink">For the team</p>
          <Link href="/staff" className={link}>Staff dashboard</Link>
          <Link href="/staff/menu" className={link}>Menu management</Link>
          <button onClick={resetDemoData} className={`${link} text-left`}>Reset demo data</button>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs leading-relaxed text-muted sm:px-6">
          Prototype for evaluation. Not an official Bing Chun service. Menu items and prices are illustrative, and sign-in,
          payments, branch availability and order updates are simulated. No real transactions take place.
        </p>
      </div>
    </footer>
  );
}

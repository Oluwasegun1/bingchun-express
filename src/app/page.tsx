'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, X, Clock, MapPin, Store, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import CartDrawer from '@/components/CartDrawer';
import { useStore } from '@/context/StoreContext';
import { Category } from '@/types';
import { formatNaira } from '@/lib/utils';

type Filter = Category | 'All' | 'Favourites';

const CATEGORIES: Category[] = [
  'Fruit Milk Tea',
  'Fresh Fruit Tea',
  'Milkshakes',
  'Smoothies',
  'Ice Cream & Sundaes',
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-line bg-white">
          <div className="skeleton aspect-square" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-5 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StorefrontPage() {
  const { products, favourites, searchQuery, setSearchQuery, selectedBranch, resetDemoData, user } = useStore();
  const [filter, setFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(true);

  // Brief skeleton while the local demo catalogue hydrates, so layout never jumps.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const q = searchQuery.trim().toLowerCase();

  const visible = useMemo(() => {
    return products.filter((p) => {
      if (filter === 'Favourites' && !favourites.includes(p.id)) return false;
      if (filter !== 'All' && filter !== 'Favourites' && p.category !== filter) return false;
      if (!q) return true;
      return [p.name, p.description, p.category, p.chineseName ?? ''].some((s) => s.toLowerCase().includes(q));
    });
  }, [products, filter, favourites, q]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [products]);

  const chip = (active: boolean) =>
    `inline-flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
      active ? 'border-brand bg-brand text-white' : 'border-line-strong bg-white text-ink-soft hover:border-brand-300 hover:text-brand'
    }`;

  const goMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-8 sm:px-6 md:grid-cols-[1fr_1.05fr] md:gap-12 md:pb-16 md:pt-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Order ahead · Pick up faster</p>
            <h1 className="mt-3 text-[2.15rem] font-extrabold leading-[1.08] text-ink sm:text-5xl">
              Your Bing Chun favourites. <span className="text-brand">Ready when you are.</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Explore the menu, order ahead, and pick up your drinks with less waiting.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={goMenu} className="h-12 rounded-ctl bg-brand px-7 text-sm font-bold text-white shadow-card transition-colors hover:bg-brand-dark active:bg-brand-900">
                Order now
              </button>
              <button onClick={goMenu} className="h-12 rounded-ctl border border-line-strong bg-white px-6 text-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand">
                Explore the menu
              </button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-soft">
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" aria-hidden /> Ready in {selectedBranch.estimatedPrepMins}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" aria-hidden /> Pickup at {selectedBranch.name.split(',')[0]}</li>
              <li className="flex items-center gap-2"><Store className="h-4 w-4 text-brand" aria-hidden /> Made fresh to order</li>
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-sheet bg-brand-50">
            <Image
              src="/brand/hero-drinks.jpg"
              alt="Three Bing Chun milk teas: lychee jasmine, strawberry coconut and brown sugar boba"
              fill
              priority
              sizes="(min-width:768px) 560px, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="scroll-mt-28 border-t border-line bg-canvas">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold">The menu</h2>
                <p className="mt-1 text-sm text-muted">Made to order, customised your way.</p>
              </div>
              <p className="inline-flex items-center gap-1.5 text-xs text-muted">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden /> Illustrative menu and prices for this prototype
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Menu categories">
                <button role="tab" aria-selected={filter === 'All'} onClick={() => setFilter('All')} className={chip(filter === 'All')}>
                  All
                </button>
                {CATEGORIES.filter((c) => counts.get(c)).map((c) => (
                  <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)} className={chip(filter === c)}>
                    {c}
                  </button>
                ))}
                {user && (
                  <button role="tab" aria-selected={filter === 'Favourites'} onClick={() => setFilter('Favourites')} className={chip(filter === 'Favourites')}>
                    Favourites{favourites.length > 0 && ` (${favourites.length})`}
                  </button>
                )}
              </div>

              <div className="relative md:w-72">
                <label htmlFor="menu-search" className="sr-only">Search the menu</label>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
                <input
                  id="menu-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drinks"
                  className="h-11 w-full rounded-ctl border border-line-strong bg-white pl-10 pr-10 placeholder:text-faint"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-muted hover:text-ink">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6" aria-live="polite">
              {loading ? (
                <SkeletonGrid />
              ) : products.length === 0 ? (
                <div className="rounded-card border border-line bg-white px-6 py-14 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-danger" />
                  <h3 className="mt-3 text-lg font-bold">We couldn&apos;t load the menu</h3>
                  <p className="mt-1 text-sm text-muted">Something went wrong while loading the demo catalogue.</p>
                  <button onClick={resetDemoData} className="mt-5 h-11 rounded-ctl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-dark">Try again</button>
                </div>
              ) : visible.length === 0 ? (
                <div className="rounded-card border border-line bg-white px-6 py-14 text-center">
                  <Search className="mx-auto h-8 w-8 text-faint" />
                  <h3 className="mt-3 text-lg font-bold">
                    {filter === 'Favourites' && !q ? 'No favourites yet' : 'No drinks match your search'}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {filter === 'Favourites' && !q ? 'Tap the heart on any drink to save it here.' : 'Try a different word, or browse every category.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('All');
                    }}
                    className="mt-5 h-11 rounded-ctl border border-line-strong px-5 text-sm font-bold hover:border-brand hover:text-brand"
                  >
                    Show all drinks
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-sm text-muted">
                    {visible.length} {visible.length === 1 ? 'drink' : 'drinks'}
                    {q && <> for “{searchQuery}”</>} · from {formatNaira(Math.min(...visible.map((p) => p.basePrice)))}
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                    {visible.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-3xl font-extrabold">Order now. Pick up easy.</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              ['Choose your drinks', 'Pick a branch, customise your drink and add it to your bag.'],
              ['Get your pickup time', 'Place your order and follow it from received to ready.'],
              ['Collect when it’s ready', 'Show your order number and code at the express pickup point.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-base font-extrabold text-brand">{i + 1}</span>
                <div>
                  <h3 className="text-base font-bold">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
      <ProductDetailModal />
      <BranchSelectorModal />
      <CartDrawer />
    </div>
  );
}

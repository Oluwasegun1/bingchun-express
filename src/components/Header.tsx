'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, MapPin, ChevronDown, User as UserIcon, Menu as MenuIcon, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import BrandLogo from '@/components/BrandLogo';

const NAV = [
  { href: '/', label: 'Menu' },
  { href: '/branches', label: 'Branches' },
  { href: '/track', label: 'Track order' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedBranch, setIsBranchModalOpen, cartCount, setIsCartOpen, user, searchQuery, setSearchQuery } =
    useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    if (pathname !== '/') router.push('/#menu');
    else document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));
  const initial = user?.name?.trim().charAt(0).toUpperCase();
  const iconBtn =
    'relative inline-flex h-11 w-11 items-center justify-center rounded-ctl text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand';

  return (
    <>
      <div className="bg-ink px-4 py-1.5 text-center text-[11px] leading-5 text-white/80">
        Unofficial product concept · Menu, prices and payments are simulated
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Bing Chun Express — home">
            <BrandLogo size={68} priority />
            <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand sm:inline">
              Express
            </span>
          </Link>

          <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? 'page' : undefined}
                className={`rounded-ctl px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive(n.href) ? 'text-brand' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="hidden max-w-[240px] items-center gap-2 rounded-ctl border border-line px-3 py-2 text-left transition-colors hover:border-brand-300 md:flex"
              aria-label={`Pickup branch: ${selectedBranch.name}. Change branch`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase leading-none tracking-wider text-muted">
                  Pickup from
                </span>
                <span className="block truncate text-[13px] font-semibold leading-tight">{selectedBranch.name}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            </button>

            <button className={iconBtn} onClick={() => setSearchOpen((v) => !v)} aria-label="Search the menu" aria-expanded={searchOpen}>
              <Search className="h-5 w-5" />
            </button>

            <Link href={user ? '/account' : '/auth'} className={iconBtn} aria-label={user ? 'My account' : 'Sign in'}>
              {user ? (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {initial}
                </span>
              ) : (
                <UserIcon className="h-5 w-5" />
              )}
            </Link>

            <button className={iconBtn} onClick={() => setIsCartOpen(true)} aria-label={`Open bag, ${cartCount} items`}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className={`${iconBtn} md:hidden`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile: branch strip, always visible and one tap away */}
        <button
          onClick={() => setIsBranchModalOpen(true)}
          className="flex w-full items-center gap-2 border-t border-line bg-brand-50 px-4 py-2.5 text-left md:hidden"
          aria-label={`Pickup branch: ${selectedBranch.name}. Change branch`}
        >
          <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-[13px]">
            <span className="text-muted">Pickup from </span>
            <span className="font-semibold text-ink">{selectedBranch.name}</span>
          </span>
          <span className="text-xs font-semibold text-brand">Change</span>
        </button>

        {searchOpen && (
          <form onSubmit={submitSearch} role="search" className="anim-fade border-t border-line bg-white px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-6xl items-center gap-2">
              <label htmlFor="header-search" className="sr-only">
                Search drinks
              </label>
              <input
                id="header-search"
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drinks, e.g. lychee, coconut, boba"
                className="h-11 flex-1 rounded-ctl border border-line-strong bg-white px-3.5 text-ink placeholder:text-faint"
              />
              <button type="submit" className="h-11 rounded-ctl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">
                Search
              </button>
            </div>
          </form>
        )}

        {menuOpen && (
          <nav aria-label="Mobile" className="anim-fade border-t border-line bg-white px-4 py-2 md:hidden">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-12 items-center rounded-ctl px-3 text-base font-semibold ${
                  isActive(n.href) ? 'bg-brand-50 text-brand' : 'text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href={user ? '/account' : '/auth'}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 items-center rounded-ctl px-3 text-base font-semibold text-ink"
            >
              {user ? 'My account' : 'Sign in'}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}

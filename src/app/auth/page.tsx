'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import AppShell from '@/components/AppShell';
import BrandLogo from '@/components/BrandLogo';
import { useStore, normalisePhone } from '@/context/StoreContext';

const DEMO_OTP = '123456';
const DEMO_PHONE = '0803 456 7891';

type Mode = 'signin' | 'signup';

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get('next') || '/account';
  // Only allow same-site redirects.
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/account';

  const { signIn, cartCount } = useStore();
  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; otp?: string }>({});
  const [busy, setBusy] = useState(false);

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (mode === 'signup' && name.trim().length < 2) next.name = 'Enter your name so we can call it out at pickup.';
    if (normalisePhone(phone).length < 10) next.phone = 'Enter a valid Nigerian phone number, e.g. 0803 456 7891.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStep('otp');
    }, 700);
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setErrors({ otp: `That code isn’t right. For this demo, enter ${DEMO_OTP}.` });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      signIn(phone, mode === 'signup' ? name : undefined);
      router.replace(next);
    }, 500);
  };

  const field =
    'h-12 w-full rounded-ctl border bg-white px-3.5 text-ink placeholder:text-faint';
  const tab = (active: boolean) =>
    `h-11 flex-1 rounded-ctl text-sm font-bold transition-colors ${active ? 'bg-white text-brand shadow-card' : 'text-muted hover:text-ink'}`;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-10 sm:py-14">
      <BrandLogo size={96} priority />
      <h1 className="mt-3 text-center text-2xl font-extrabold">
        {step === 'otp' ? 'Enter your code' : mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-1 text-center text-sm text-muted">
        {next === '/checkout' && cartCount > 0
          ? `Your bag (${cartCount} ${cartCount === 1 ? 'item' : 'items'}) is saved. Sign in to finish your order.`
          : 'Save favourites, reorder in a tap and track your pickups.'}
      </p>

      <div className="mt-7 w-full rounded-card border border-line bg-white p-5 shadow-card sm:p-7">
        {step === 'phone' ? (
          <>
            <div className="mb-5 flex rounded-ctl bg-canvas p-1" role="tablist">
              <button role="tab" aria-selected={mode === 'signin'} className={tab(mode === 'signin')} onClick={() => { setMode('signin'); setErrors({}); }}>Sign in</button>
              <button role="tab" aria-selected={mode === 'signup'} className={tab(mode === 'signup')} onClick={() => { setMode('signup'); setErrors({}); }}>Sign up</button>
            </div>

            <form onSubmit={sendCode} noValidate className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">Your name</label>
                  <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} placeholder="e.g. Chidinma" className={`${field} ${errors.name ? 'border-danger' : 'border-line-strong'}`} />
                  {errors.name && <p id="name-err" className="mt-1.5 text-xs text-danger">{errors.name}</p>}
                </div>
              )}
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">Phone number</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-err' : 'phone-hint'} placeholder="0803 456 7891" className={`${field} ${errors.phone ? 'border-danger' : 'border-line-strong'}`} />
                {errors.phone ? (
                  <p id="phone-err" className="mt-1.5 text-xs text-danger">{errors.phone}</p>
                ) : (
                  <p id="phone-hint" className="mt-1.5 text-xs text-muted">
                    Demo tip: use{' '}
                    <button type="button" onClick={() => setPhone(DEMO_PHONE)} className="font-semibold text-brand underline-offset-2 hover:underline">{DEMO_PHONE}</button>{' '}
                    to see sample order history.
                  </p>
                )}
              </div>
              <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-ctl bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-70">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? 'Sending code…' : 'Send code'}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={verify} noValidate className="space-y-4">
            <button type="button" onClick={() => { setStep('phone'); setOtp(''); setErrors({}); }} className="-ml-1 inline-flex h-9 items-center gap-1.5 rounded-ctl px-1 text-sm font-semibold text-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> Change number
            </button>
            <p className="text-sm text-muted">We “sent” a 6-digit code to <span className="font-semibold text-ink">{phone}</span>.</p>
            <div className="rounded-ctl border border-brand-200 bg-brand-50 px-3.5 py-3 text-sm text-brand-900" role="note">
              <span className="font-bold">Demo mode:</span> no SMS is sent. Your code is <span className="font-extrabold tracking-widest">{DEMO_OTP}</span>.
            </div>
            <div>
              <label htmlFor="otp" className="mb-1.5 block text-sm font-semibold">Verification code</label>
              <input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} aria-invalid={!!errors.otp} aria-describedby={errors.otp ? 'otp-err' : undefined} placeholder="••••••" className={`${field} text-center text-xl font-bold tracking-[0.5em] ${errors.otp ? 'border-danger' : 'border-line-strong'}`} autoFocus />
              {errors.otp && <p id="otp-err" className="mt-1.5 text-xs text-danger">{errors.otp}</p>}
            </div>
            <button type="submit" disabled={busy || otp.length < 6} className="flex h-12 w-full items-center justify-center gap-2 rounded-ctl bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? 'Verifying…' : mode === 'signup' ? 'Create account' : 'Verify and sign in'}
            </button>
          </form>
        )}
      </div>

      <p className="mt-5 flex items-center gap-1.5 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Simulated sign-in for the prototype. No account data leaves this browser.
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-muted">Loading…</div>}>
        <AuthForm />
      </Suspense>
    </AppShell>
  );
}

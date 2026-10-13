'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, Check } from 'lucide-react';
import { CartItemCustomization, IceLevel, Product, SweetnessLevel, Topping } from '@/types';
import { formatNaira } from '@/lib/utils';
import { useModal } from '@/lib/useModal';

const SWEETNESS: SweetnessLevel[] = ['0%', '25%', '50%', '75%', '100%'];
const ICE: IceLevel[] = ['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'];

export interface SheetInitial {
  customization: CartItemCustomization;
  quantity: number;
}

interface ProductSheetProps {
  product: Product;
  mode?: 'add' | 'edit';
  initial?: SheetInitial;
  onClose: () => void;
  onSubmit: (customization: CartItemCustomization, quantity: number) => void;
}

function OptionGroup({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2.5 flex w-full items-baseline justify-between">
        <span className="text-sm font-bold text-ink">{title}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

export default function ProductSheet({ product, mode = 'add', initial, onClose, onSubmit }: ProductSheetProps) {
  const ref = useModal<HTMLDivElement>(true, onClose);
  const c0 = initial?.customization;

  const [size, setSize] = useState<'Regular (500ml)' | 'Large (700ml)'>(c0?.size ?? 'Regular (500ml)');
  const [sweetness, setSweetness] = useState<SweetnessLevel>(c0?.sweetness ?? '75%');
  const [ice, setIce] = useState<IceLevel>(c0?.ice ?? 'Regular Ice');
  const [toppings, setToppings] = useState<Topping[]>(c0?.toppings ?? []);
  const [serving, setServing] = useState<string>(c0?.servingType ?? product.customDessertOptions?.servingTypes?.[0] ?? '');
  const [notes, setNotes] = useState(c0?.notes ?? '');
  const [qty, setQty] = useState(initial?.quantity ?? 1);

  const sizeDelta = product.availableSizes?.find((s) => s.name === size)?.priceDelta ?? 0;
  const toppingsTotal = toppings.reduce((a, t) => a + t.price, 0);
  const unit = product.basePrice + sizeDelta + toppingsTotal;
  const total = unit * qty;

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (product.availableSizes?.length) parts.push(size.split(' ')[0]);
    if (product.hasDrinkOptions) parts.push(`${sweetness} sugar`, ice);
    if (serving) parts.push(serving);
    if (toppings.length) parts.push(toppings.map((t) => t.name).join(', '));
    return parts.join(' · ');
  }, [product, size, sweetness, ice, serving, toppings]);

  const toggleTopping = (t: Topping) =>
    setToppings((prev) => (prev.some((x) => x.id === t.id) ? prev.filter((x) => x.id !== t.id) : [...prev, t]));

  const submit = () => {
    const customization: CartItemCustomization = { toppings };
    if (product.availableSizes?.length) customization.size = size;
    if (product.hasDrinkOptions) {
      customization.sweetness = sweetness;
      customization.ice = ice;
    }
    if (serving) customization.servingType = serving;
    if (notes.trim()) customization.notes = notes.trim();
    onSubmit(customization, qty);
  };

  const choice = (active: boolean) =>
    `min-h-11 rounded-ctl border px-3 text-sm font-semibold transition-colors ${
      active ? 'border-brand bg-brand-50 text-brand-dark ring-1 ring-brand' : 'border-line-strong bg-white text-ink-soft hover:border-brand-300'
    }`;

  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        className="anim-up flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-pop sm:h-auto sm:max-h-[min(720px,92vh)] sm:max-w-3xl sm:flex-row sm:rounded-sheet"
      >
        {/* Image */}
        <div className="relative h-52 shrink-0 bg-brand-50 sm:h-auto sm:w-5/12">
          <Image src={product.image} alt={product.name} fill sizes="(min-width:640px) 40vw, 100vw" className="object-cover" unoptimized />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-card hover:bg-white sm:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">{product.category}</p>
                <h2 id="sheet-title" className="mt-1 text-2xl font-extrabold leading-tight">
                  {product.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-ctl text-muted hover:bg-canvas hover:text-ink sm:flex"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>
            <p className="mt-3 text-lg font-bold">
              {formatNaira(product.basePrice)}
              <span className="ml-2 text-xs font-medium text-muted">base price · illustrative</span>
            </p>

            <div className="mt-6 space-y-6">
              {product.availableSizes && product.availableSizes.length > 0 && (
                <OptionGroup title="Size">
                  <div className="grid grid-cols-2 gap-2">
                    {product.availableSizes.map((s) => (
                      <button key={s.name} type="button" aria-pressed={size === s.name} onClick={() => setSize(s.name)} className={`${choice(size === s.name)} flex flex-col items-start py-2.5 text-left`}>
                        <span>{s.name}</span>
                        <span className="text-xs font-medium text-muted">{s.priceDelta ? `+${formatNaira(s.priceDelta)}` : 'Included'}</span>
                      </button>
                    ))}
                  </div>
                </OptionGroup>
              )}

              {product.customDessertOptions?.servingTypes && (
                <OptionGroup title="Served in">
                  <div className="grid grid-cols-2 gap-2">
                    {product.customDessertOptions.servingTypes.map((s) => (
                      <button key={s} type="button" aria-pressed={serving === s} onClick={() => setServing(s)} className={choice(serving === s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </OptionGroup>
              )}

              {product.hasDrinkOptions && (
                <>
                  <OptionGroup title="Sweetness">
                    <div className="grid grid-cols-5 gap-1.5">
                      {SWEETNESS.map((s) => (
                        <button key={s} type="button" aria-pressed={sweetness === s} onClick={() => setSweetness(s)} className={`${choice(sweetness === s)} px-0`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </OptionGroup>
                  <OptionGroup title="Ice">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {ICE.map((i) => (
                        <button key={i} type="button" aria-pressed={ice === i} onClick={() => setIce(i)} className={`${choice(ice === i)} px-1`}>
                          {i}
                        </button>
                      ))}
                    </div>
                  </OptionGroup>
                </>
              )}

              {product.hasDrinkOptions && product.availableToppings && product.availableToppings.length > 0 && (
                <OptionGroup title="Add-ons" hint="Optional">
                  <div className="space-y-2">
                    {product.availableToppings.map((t) => {
                      const on = toppings.some((x) => x.id === t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggleTopping(t)}
                          className={`${choice(on)} flex w-full items-center justify-between gap-3 text-left`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${on ? 'border-brand bg-brand text-white' : 'border-line-strong bg-white'}`}>
                              {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            </span>
                            {t.name}
                          </span>
                          <span className="text-xs font-semibold text-muted">+{formatNaira(t.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </OptionGroup>
              )}

              <div>
                <label htmlFor="sheet-notes" className="mb-2 flex items-baseline justify-between text-sm font-bold">
                  <span>Notes for the team</span>
                  <span className="text-xs font-normal text-muted">Optional · {notes.length}/140</span>
                </label>
                <textarea
                  id="sheet-notes"
                  value={notes}
                  maxLength={140}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Extra straw, double cup"
                  className="w-full resize-none rounded-ctl border border-line-strong bg-white px-3.5 py-2.5 placeholder:text-faint"
                />
              </div>
            </div>
          </div>

          {/* Sticky footer: always shows what you chose and what it costs */}
          <div className="border-t border-line bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-7">
            <p className="mb-3 line-clamp-2 text-xs text-muted" aria-live="polite">
              {summary}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 items-center rounded-ctl border border-line-strong" role="group" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className="flex h-12 w-11 items-center justify-center text-ink-soft hover:text-brand disabled:text-line-strong">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-7 text-center text-sm font-bold" aria-live="polite">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity" className="flex h-12 w-11 items-center justify-center text-ink-soft hover:text-brand">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button onClick={submit} className="flex h-12 flex-1 items-center justify-between rounded-ctl bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-dark active:bg-brand-900">
                <span>{mode === 'edit' ? 'Update drink' : 'Add to bag'}</span>
                <span>{formatNaira(total)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

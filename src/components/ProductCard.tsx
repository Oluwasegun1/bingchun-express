'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Plus } from 'lucide-react';
import { Product } from '@/types';
import { formatNaira } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';

export default function ProductCard({ product }: { product: Product }) {
  const { setSelectedProduct, favourites, toggleFavourite } = useStore();
  const fav = favourites.includes(product.id);
  const unavailable = !product.available;
  const hasLarge = product.availableSizes && product.availableSizes.length > 1;

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition-shadow hover:shadow-card">
      <div className="relative aspect-square overflow-hidden bg-brand-50">
        <button
          type="button"
          onClick={() => !unavailable && setSelectedProduct(product)}
          disabled={unavailable}
          aria-label={`Customise ${product.name}`}
          className="absolute inset-0 z-0 block h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${unavailable ? 'opacity-50 grayscale' : ''}`}
            unoptimized
          />
        </button>
        {unavailable ? (
          <span className="absolute left-3 top-3 rounded-md bg-ink px-2 py-1 text-[11px] font-bold text-white">Sold out today</span>
        ) : (
          product.tag === 'Bestseller' && (
            <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-[11px] font-bold text-brand shadow-card">Bestseller</span>
          )
        )}
        <button
          type="button"
          onClick={() => toggleFavourite(product.id)}
          aria-label={fav ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
          aria-pressed={fav}
          className="absolute right-1.5 top-1.5 z-10 flex h-11 w-11 items-center justify-center rounded-full"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-card">
            <Heart className={`h-4 w-4 ${fav ? 'fill-brand text-brand' : 'text-ink-soft'}`} />
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="text-[15px] font-bold leading-snug">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-base font-extrabold">{formatNaira(product.basePrice)}</p>
            {hasLarge && <p className="text-[11px] text-muted">500ml · 700ml</p>}
          </div>
          <button
            type="button"
            onClick={() => setSelectedProduct(product)}
            disabled={unavailable}
            aria-label={`Add ${product.name} to bag`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark active:bg-brand-900 disabled:bg-line-strong"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

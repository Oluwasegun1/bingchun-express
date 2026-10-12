'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatNaira } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { Plus, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { setSelectedProduct } = useStore();

  return (
    <div 
      onClick={() => product.available && setSelectedProduct(product)}
      className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#0C5CC4]/30 shadow-xs hover:shadow-xl hover:shadow-[#0C5CC4]/10 transition-all duration-300 flex flex-col cursor-pointer ${
        !product.available ? 'opacity-65 grayscale-20 pointer-events-none' : ''
      }`}
    >
      {/* Product Image Box */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#0C5CC4]/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#FFD23F]" />
              Verified Nigeria Menu
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3" />
              Demo Catalog Item
            </span>
          )}

          {product.featured && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#12233F] bg-[#FFD23F] px-2 py-0.5 rounded-full shadow-xs">
              Popular
            </span>
          )}
        </div>

        {/* Unavailable overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-white/90 text-[#12233F] text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
              Sold Out for Today
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0C5CC4]">
              {product.category}
            </span>
            {product.chineseName && (
              <span className="text-[11px] font-semibold text-[#5B6E8C]">
                {product.chineseName}
              </span>
            )}
          </div>

          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#12233F] group-hover:text-[#0C5CC4] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-[#5B6E8C] mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-semibold text-[#5B6E8C] block -mb-0.5">
              Starting from
            </span>
            <span className="text-lg font-black text-[#12233F] tracking-tight">
              {formatNaira(product.basePrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#EEF5FF] hover:bg-[#0C5CC4] text-[#0C5CC4] hover:text-white font-bold text-xs transition-all shadow-2xs group-hover:bg-[#0C5CC4] group-hover:text-white"
          >
            {product.hasDrinkOptions ? (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

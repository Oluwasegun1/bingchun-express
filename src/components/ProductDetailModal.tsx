'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { SweetnessLevel, IceLevel, Topping } from '@/types';
import { formatNaira } from '@/lib/utils';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag,
  Info
} from 'lucide-react';

const SWEETNESS_OPTIONS: SweetnessLevel[] = ['100%', '75%', '50%', '25%', '0%'];
const ICE_OPTIONS: IceLevel[] = ['Regular Ice', 'Less Ice', 'No Ice', 'Extra Ice'];

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'Regular (500ml)' | 'Large (700ml)'>('Regular (500ml)');
  const [selectedSweetness, setSelectedSweetness] = useState<SweetnessLevel>('75%');
  const [selectedIce, setSelectedIce] = useState<IceLevel>('Regular Ice');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [selectedServing, setSelectedServing] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Reset modal state whenever selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setSelectedSize('Regular (500ml)');
      setSelectedSweetness('75%');
      setSelectedIce('Regular Ice');
      setSelectedToppings([]);
      setSelectedServing(
        selectedProduct.customDessertOptions?.servingTypes?.[0] || ''
      );
      setCustomerNotes('');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  // Calculate live dynamic price per unit
  let unitPrice = selectedProduct.basePrice;
  if (selectedSize === 'Large (700ml)') {
    unitPrice += 600;
  }
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  unitPrice += toppingsPrice;

  const totalItemPrice = unitPrice * quantity;

  const handleToggleTopping = (topping: Topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      selectedProduct,
      {
        size: selectedProduct.availableSizes ? selectedSize : undefined,
        sweetness: selectedProduct.hasDrinkOptions ? selectedSweetness : undefined,
        ice: selectedProduct.hasDrinkOptions ? selectedIce : undefined,
        toppings: selectedToppings,
        servingType: selectedServing || undefined,
        notes: customerNotes.trim() || undefined,
      },
      quantity
    );
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-slate-100 shrink-0">
          <Image
            src={selectedProduct.image}
            alt={selectedProduct.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title & Badges on bottom of image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                {selectedProduct.category}
              </span>
              {selectedProduct.isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#0C5CC4] px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-[#FFD23F]" />
                  Verified Nigeria
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#12233F] bg-[#FFD23F] px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Illustrative Demo
                </span>
              )}
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-black drop-shadow-xs">
              {selectedProduct.name}
            </h2>
            {selectedProduct.chineseName && (
              <p className="text-xs text-white/80 font-medium">
                {selectedProduct.chineseName}
              </p>
            )}
          </div>
        </div>

        {/* Modal Scrollable Options Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Description */}
          <div className="text-sm text-[#5B6E8C] leading-relaxed">
            {selectedProduct.description}
            {selectedProduct.verifiedSource && (
              <div className="mt-2 text-xs font-semibold text-[#0C5CC4] bg-[#EEF5FF] p-2.5 rounded-xl flex items-center gap-2">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Price source: {selectedProduct.verifiedSource}</span>
              </div>
            )}
          </div>

          {/* 1. Size Selection (If Available) */}
          {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F] block">
                Choose Size
              </label>
              <div className="grid grid-cols-2 gap-3">
                {selectedProduct.availableSizes.map((size) => (
                  <button
                    key={size.name}
                    type="button"
                    onClick={() => setSelectedSize(size.name)}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      selectedSize === size.name
                        ? 'border-[#0C5CC4] bg-[#EEF5FF] text-[#0C5CC4]'
                        : 'border-slate-200 hover:border-slate-300 text-[#12233F]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block">{size.name}</span>
                      <span className="text-xs text-[#5B6E8C]">
                        {size.priceDelta === 0 ? 'Standard' : `+${formatNaira(size.priceDelta)}`}
                      </span>
                    </div>
                    {selectedSize === size.name && (
                      <div className="w-5 h-5 rounded-full bg-[#0C5CC4] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Dessert Serving Type (For Ice Cream / Sundaes) */}
          {selectedProduct.customDessertOptions?.servingTypes && (
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F] block">
                Serving Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {selectedProduct.customDessertOptions.servingTypes.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedServing(style)}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      selectedServing === style
                        ? 'border-[#0C5CC4] bg-[#EEF5FF] text-[#0C5CC4]'
                        : 'border-slate-200 hover:border-slate-300 text-[#12233F]'
                    }`}
                  >
                    <span className="font-bold text-sm">{style}</span>
                    {selectedServing === style && (
                      <div className="w-5 h-5 rounded-full bg-[#0C5CC4] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Sweetness Level (For Drinks Only) */}
          {selectedProduct.hasDrinkOptions && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F]">
                  Sweetness Level
                </label>
                <span className="text-xs font-bold text-[#0C5CC4]">{selectedSweetness}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SWEETNESS_OPTIONS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedSweetness(level)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedSweetness === level
                        ? 'bg-[#0C5CC4] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#12233F]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Ice Level (For Drinks Only) */}
          {selectedProduct.hasDrinkOptions && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F]">
                  Ice Preference
                </label>
                <span className="text-xs font-bold text-[#0C5CC4]">{selectedIce}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ICE_OPTIONS.map((ice) => (
                  <button
                    key={ice}
                    type="button"
                    onClick={() => setSelectedIce(ice)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      selectedIce === ice
                        ? 'bg-[#0C5CC4] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#12233F]'
                    }`}
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Toppings Customization */}
          {selectedProduct.availableToppings && selectedProduct.availableToppings.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F]">
                  Add Toppings
                </label>
                <span className="text-xs text-[#5B6E8C]">Optional extras</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedProduct.availableToppings.map((topping) => {
                  const isChecked = selectedToppings.some((t) => t.id === topping.id);
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => handleToggleTopping(topping)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-[#0C5CC4] bg-[#EEF5FF] text-[#0C5CC4]'
                          : 'border-slate-200 hover:border-slate-300 text-[#12233F]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-[#0C5CC4] border-[#0C5CC4] text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-bold">{topping.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-[#12233F]">
                        +{formatNaira(topping.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Special Instructions Note */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#12233F] block">
              Special Store Instructions
            </label>
            <input
              type="text"
              placeholder="e.g., extra straw, separate bag, allergy note..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#0C5CC4] text-xs text-[#12233F]"
            />
          </div>
        </div>

        {/* Modal Bottom Sticky Checkout Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl bg-white disabled:opacity-40 text-slate-800 flex items-center justify-center font-bold shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-[#12233F]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Bag CTA with Dynamic Price */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#0C5CC4] hover:bg-[#084393] text-white font-extrabold text-sm shadow-md shadow-[#0C5CC4]/25 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </div>
            <span className="text-base tracking-tight font-black">
              {formatNaira(totalItemPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import ProductSheet from '@/components/ProductSheet';

/** Storefront wrapper: opens the customisation sheet for `selectedProduct` and adds to the bag. */
export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useStore();
  if (!selectedProduct) return null;

  return (
    <ProductSheet
      key={selectedProduct.id}
      product={selectedProduct}
      onClose={() => setSelectedProduct(null)}
      onSubmit={(customization, quantity) => {
        addToCart(selectedProduct, customization, quantity);
        setSelectedProduct(null);
      }}
    />
  );
}

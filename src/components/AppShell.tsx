'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import CartDrawer from '@/components/CartDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';

/** Shared customer-facing page frame: header, content, footer and the global overlays. */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <BranchSelectorModal />
      <CartDrawer />
      <ProductDetailModal />
    </div>
  );
}

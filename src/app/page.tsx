'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import BranchSelectorModal from '@/components/BranchSelectorModal';
import CartDrawer from '@/components/CartDrawer';
import { useStore } from '@/context/StoreContext';
import { Category } from '@/types';
import { 
  Search, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  ArrowRight, 
  CheckCircle,
  Coffee,
  Heart,
  Store,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

const CATEGORIES: { label: string; value: Category | 'All'; icon: string }[] = [
  { label: 'All Items', value: 'All', icon: '✨' },
  { label: 'Fruit Milk Tea', value: 'Fruit Milk Tea', icon: '🥥' },
  { label: 'Fresh Fruit Tea', value: 'Fresh Fruit Tea', icon: '🍋' },
  { label: 'Milkshakes', value: 'Milkshakes', icon: '🥤' },
  { label: 'Smoothies', value: 'Smoothies', icon: '🍓' },
  { label: 'Ice Cream & Sundaes', value: 'Ice Cream & Sundaes', icon: '🍨' },
  { label: 'Extras & Bags', value: 'Snacks & Extras', icon: '🛍️' },
];

export default function StorefrontPage() {
  const { 
    products, 
    selectedBranch, 
    setIsBranchModalOpen, 
    setIsCartOpen 
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Verified only filter
      if (showVerifiedOnly && !p.isVerified) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesChinese = p.chineseName?.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCategory || matchesChinese;
      }
      return true;
    });
  }, [products, selectedCategory, showVerifiedOnly, searchQuery]);

  // Featured / Popular products
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured && p.available).slice(0, 4);
  }, [products]);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FD]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#EEF5FF]/70 to-[#F4F8FD] pt-6 pb-14 sm:pb-20 border-b border-[#0C5CC4]/10">
          {/* Subtle decorative background circles */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#0C5CC4]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#FFD23F]/15 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Express Pickup Branch Pill Notification */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0C5CC4]/20 shadow-xs mb-6 cursor-pointer hover:border-[#0C5CC4] transition-colors"
                 onClick={() => setIsBranchModalOpen(true)}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#12233F]">
                Ordering from: <strong className="text-[#0C5CC4]">{selectedBranch.name}</strong>
              </span>
              <span className="text-xs text-[#5B6E8C] hidden sm:inline">
                ({selectedBranch.estimatedPrepMins} prep)
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#0C5CC4]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#0C5CC4]/10 text-[#0C5CC4] text-xs font-extrabold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bing Chun Express Pickup
                  </div>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#12233F] tracking-tight leading-[1.08]">
                    Your Bing Chun favourites. <br className="hidden sm:inline" />
                    <span className="text-[#0C5CC4]">Ready when you are.</span>
                  </h1>
                  <p className="text-base sm:text-lg text-[#4A5D78] max-w-xl font-normal leading-relaxed">
                    Order ahead, customize your tea sweetness, ice level, and toppings, choose your pickup branch in Lagos, and skip the mall counter queue.
                  </p>
                </div>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    onClick={scrollToMenu}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#0C5CC4] hover:bg-[#084393] text-white font-extrabold text-base shadow-lg shadow-[#0C5CC4]/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsBranchModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#12233F] font-bold text-base border border-slate-200 shadow-xs hover:border-[#0C5CC4]/30 transition-all"
                  >
                    <MapPin className="w-4 h-4 text-[#0C5CC4]" />
                    <span>Select Branch</span>
                  </button>
                </div>

                {/* Proof Points */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/60 max-w-lg">
                  <div className="space-y-0.5">
                    <span className="font-heading text-xl font-extrabold text-[#12233F]">100%</span>
                    <p className="text-[11px] text-[#5B6E8C] font-semibold leading-tight">Fresh Brewed Teas &amp; Real Fruit</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-heading text-xl font-extrabold text-[#0C5CC4]">10–15m</span>
                    <p className="text-[11px] text-[#5B6E8C] font-semibold leading-tight">Express Grab &amp; Go Pickup</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-heading text-xl font-extrabold text-[#12233F]">7+</span>
                    <p className="text-[11px] text-[#5B6E8C] font-semibold leading-tight">Lagos Outlets Represented</p>
                  </div>
                </div>
              </div>

              {/* Right Column Drink Showcase Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=1000&q=85"
                    alt="Bing Chun Brown Sugar Boba Tea"
                    fill
                    priority
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                  {/* Overlaid Highlight Badge */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0C5CC4] uppercase">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Best Seller in Lagos</span>
                      </div>
                      <p className="font-heading text-sm font-bold text-[#12233F]">
                        Brown Sugar Boba Milk Tea
                      </p>
                      <p className="text-xs font-black text-[#0C5CC4]">₦4,200</p>
                    </div>

                    <button
                      onClick={scrollToMenu}
                      className="px-3.5 py-2 rounded-xl bg-[#0C5CC4] text-white text-xs font-bold shadow-xs hover:bg-[#084393]"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Popular / Best Sellers Section */}
        {featuredProducts.length > 0 && (
          <section className="py-10 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#0C5CC4] tracking-wider">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Lagos Favourites</span>
                  </div>
                  <h2 className="font-heading text-2xl font-black text-[#12233F]">
                    Featured Drinks &amp; Treats
                  </h2>
                </div>
                <button
                  onClick={scrollToMenu}
                  className="text-xs font-bold text-[#0C5CC4] hover:underline flex items-center gap-1"
                >
                  <span>View All ({products.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Interactive Menu Catalogue Section */}
        <section id="menu-section" className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#0C5CC4] tracking-widest block mb-1">
                  Online Ordering Menu
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#12233F]">
                  Explore the Catalogue
                </h2>
                <p className="text-sm text-[#5B6E8C] mt-1">
                  Prices based on verified Nigerian menu research and clearly indicated demo options.
                </p>
              </div>

              {/* Search Bar & Verified Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search teas, sundaes, boba..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#0C5CC4] text-xs text-[#12233F] w-full sm:w-64 shadow-2xs font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Verified Menu Only Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-colors ${
                    showVerifiedOnly
                      ? 'bg-[#0C5CC4] text-white border-[#0C5CC4]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FFD23F]" />
                  <span>Verified Only</span>
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                    selectedCategory === cat.value
                      ? 'bg-[#0C5CC4] text-white shadow-md shadow-[#0C5CC4]/20 scale-102'
                      : 'bg-white text-[#12233F] hover:bg-slate-50 border border-slate-200/80'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EEF5FF] text-[#0C5CC4] flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#12233F]">
                  No matching products found
                </h3>
                <p className="text-xs text-[#5B6E8C] max-w-sm mx-auto">
                  We couldn&rsquo;t find anything matching &ldquo;{searchQuery}&rdquo;. Try another term or reset your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setShowVerifiedOnly(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0C5CC4] text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Bing Chun Express Section */}
        <section className="py-14 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase text-[#0C5CC4] tracking-widest block mb-1">
                Express Pickup Promise
              </span>
              <h2 className="font-heading text-3xl font-black text-[#12233F]">
                Freshly Brewed. Zero Mall Queues.
              </h2>
              <p className="text-sm text-[#5B6E8C] mt-2">
                Designed to make enjoying premium bubble tea and Hokkaido-style desserts effortless across busy Lagos malls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#EEF5FF]/70 border border-[#0C5CC4]/15 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0C5CC4] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-[#0C5CC4]/20">
                  🧋
                </div>
                <h3 className="font-heading text-lg font-bold text-[#12233F]">
                  Custom Made Every Cup
                </h3>
                <p className="text-xs text-[#5B6E8C] leading-relaxed">
                  Choose your precise sweetness (0% to 100%), ice level, and artisanal toppings like slow-cooked brown sugar boba or cheese foam.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#EEF5FF]/70 border border-[#0C5CC4]/15 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0C5CC4] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-[#0C5CC4]/20">
                  ⚡
                </div>
                <h3 className="font-heading text-lg font-bold text-[#12233F]">
                  Express Pickup Counter
                </h3>
                <p className="text-xs text-[#5B6E8C] leading-relaxed">
                  Your order is prepared and bagged with a dedicated 4-digit pickup code before you reach the food court counter.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#EEF5FF]/70 border border-[#0C5CC4]/15 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0C5CC4] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-[#0C5CC4]/20">
                  📍
                </div>
                <h3 className="font-heading text-lg font-bold text-[#12233F]">
                  Lagos Coverage
                </h3>
                <p className="text-xs text-[#5B6E8C] leading-relaxed">
                  Order to Novare Mall Sangotedo, Purple Mall Maryland, Jara Mall Ikeja, or Landmark Centre VI with live branch prep estimates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#12233F] text-slate-400 text-xs py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-[#0C5CC4] text-white flex items-center justify-center font-bold text-xs">
                  冰淳
                </div>
                <span className="font-heading text-lg font-black text-white">Bing Chun Express</span>
              </div>
              <p className="text-slate-400 text-xs">
                Concept presentation demo for online express pickup in Nigeria.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <a href="#menu-section" className="hover:text-white transition-colors">Menu</a>
              <a href="/branches" className="hover:text-white transition-colors">Branch Locations</a>
              <a href="/track" className="hover:text-white transition-colors">Track Order</a>
              <a href="/staff" className="text-[#FFD23F] hover:underline">Staff Demo Dashboard</a>
            </div>
          </div>

          <div className="space-y-3 text-[11px] text-slate-400 leading-relaxed">
            <p>
              <strong>Disclaimer:</strong> Bing Chun Express is an independent product and design concept developed for business partnership discussions with Bing Chun Nigeria. It is not an officially endorsed or deployed service of Belu Meals Limited or Bing Chun.
            </p>
            <p>
              Product names and prices are sourced from publicly available store menus, Chowdeck listings, and official Instagram publications where verified, and labelled as illustrative demo items where unconfirmed. Real monetary transactions, SMS verifications, and physical store notifications are not executed.
            </p>
            <div className="pt-2 text-slate-500">
              &copy; 2026 Bing Chun Express (Concept Demo). Built for Bing Chun Nigeria.
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <BranchSelectorModal />
      <CartDrawer />
    </div>
  );
}

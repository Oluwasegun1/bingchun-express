'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Product, Category } from '@/types';
import { formatNaira } from '@/lib/utils';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  UtensilsCrossed, 
  Eye, 
  EyeOff,
  RotateCcw,
  LayoutDashboard
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Fruit Milk Tea',
  'Fresh Fruit Tea',
  'Milkshakes',
  'Smoothies',
  'Ice Cream & Sundaes',
  'Snacks & Extras',
];

export default function MenuManagementPage() {
  const { 
    products, 
    updateProduct, 
    addProduct, 
    toggleProductAvailability, 
    resetDemoData, 
    showNotification 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdChinese, setNewProdChinese] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>('Fruit Milk Tea');
  const [newProdPrice, setNewProdPrice] = useState('3800');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80');
  const [newProdIsVerified, setNewProdIsVerified] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const priceNum = parseInt(newProdPrice, 10) || 3000;
    const newId = `prod-demo-${Date.now()}`;

    const newProd: Product = {
      id: newId,
      name: newProdName.trim(),
      chineseName: newProdChinese.trim() || undefined,
      category: newProdCategory,
      description: newProdDesc.trim() || 'Freshly made Bing Chun demo treat.',
      basePrice: priceNum,
      image: newProdImage.trim() || 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
      isVerified: newProdIsVerified,
      demoLabel: newProdIsVerified ? undefined : 'Staff Added Demo Item',
      available: true,
      hasDrinkOptions: newProdCategory.includes('Tea'),
      availableSizes: [
        { name: 'Regular (500ml)', priceDelta: 0 },
        { name: 'Large (700ml)', priceDelta: 600 },
      ],
    };

    addProduct(newProd);
    setIsAddingNew(false);
    // Reset form
    setNewProdName('');
    setNewProdChinese('');
    setNewProdPrice('3800');
    setNewProdDesc('');
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#12233F] text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/staff"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Return to Staff Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg font-black tracking-tight leading-none">
                  Menu &amp; Catalog Management
                </h1>
                <span className="bg-[#0C5CC4] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Admin Demo
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Live modifications update the customer storefront catalogue instantly
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0C5CC4] hover:bg-[#084393] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Demo Item</span>
            </button>
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              View Storefront
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Filter bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#0C5CC4] text-xs text-[#12233F] font-medium"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#12233F]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Showing {filteredProducts.length} of {products.length} menu items
          </div>
        </div>

        {/* Menu Items Table / Cards */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (₦)</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Item */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#12233F]">{p.name}</p>
                          {p.chineseName && (
                            <span className="text-[11px] text-slate-400">{p.chineseName}</span>
                          )}
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <span className="font-black text-sm text-[#12233F]">
                        {formatNaira(p.basePrice)}
                      </span>
                    </td>

                    {/* Verification */}
                    <td className="p-4">
                      {p.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0C5CC4] bg-[#EEF5FF] px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Demo Item
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleProductAvailability(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          p.available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {p.available ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0C5CC4] hover:text-white text-slate-700 font-bold transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-[#12233F]">
                Edit Product
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Price (₦ Naira)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.basePrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editVerified"
                  checked={editingProduct.isVerified}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isVerified: e.target.checked })}
                  className="rounded text-[#0C5CC4]"
                />
                <label htmlFor="editVerified" className="text-slate-700 font-bold">
                  Mark as Verified Nigeria Menu Item
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0C5CC4] hover:bg-[#084393] text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-[#12233F]">
                Add New Demo Product
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dragonfruit Jasmine Cooler"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chinese Sub-title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 火龙果茉莉茶"
                  value={newProdChinese}
                  onChange={(e) => setNewProdChinese(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Price (₦ Naira)</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Flavor notes and ingredients..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="newVerified"
                  checked={newProdIsVerified}
                  onChange={(e) => setNewProdIsVerified(e.target.checked)}
                  className="rounded text-[#0C5CC4]"
                />
                <label htmlFor="newVerified" className="text-slate-700 font-bold">
                  Mark as Verified Official Item
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0C5CC4] hover:bg-[#084393] text-white font-bold"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

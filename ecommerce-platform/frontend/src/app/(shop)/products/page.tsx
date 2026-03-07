'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal, X, Star, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  discount_percentage?: number;
  description?: string;
  features?: string[];
}

const mockProducts: Product[] = [
  { id: '1', name: 'Premium Wireless Headphones', price: 299, compareAtPrice: 399, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'], category: 'Electronics', brand: 'AudioPro', rating: 4.8, reviewCount: 234, stock: 50, discount_percentage: 25 },
  { id: '2', name: 'Luxury Watch Collection', price: 1299, compareAtPrice: 1599, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'], category: 'Jewelry', brand: 'TimeKeeper', rating: 4.9, reviewCount: 89, stock: 25, discount_percentage: 19 },
  { id: '3', name: 'Premium Leather Jacket', price: 189, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'], category: 'Fashion', brand: 'StyleCo', rating: 4.6, reviewCount: 156, stock: 30 },
  { id: '4', name: 'Smart Watch Pro', price: 449, compareAtPrice: 599, images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'], category: 'Electronics', brand: 'TechWear', rating: 4.7, reviewCount: 312, stock: 45, discount_percentage: 25 },
  { id: '5', name: 'Minimalist Desk Lamp', price: 79, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'], category: 'Home & Garden', brand: 'LightCo', rating: 4.4, reviewCount: 67, stock: 80 },
  { id: '6', name: 'Running Shoes Elite', price: 159, compareAtPrice: 199, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], category: 'Sports', brand: 'SpeedRun', rating: 4.7, reviewCount: 341, stock: 60, discount_percentage: 20 },
  { id: '7', name: 'Luxury Skincare Set', price: 129, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'], category: 'Beauty', brand: 'GlowLab', rating: 4.5, reviewCount: 198, stock: 40 },
  { id: '8', name: 'Mechanical Keyboard', price: 219, compareAtPrice: 279, images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'], category: 'Electronics', brand: 'TypeMaster', rating: 4.8, reviewCount: 423, stock: 35, discount_percentage: 21 },
  { id: '9', name: 'Yoga Mat Premium', price: 59, images: ['https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400'], category: 'Sports', brand: 'ZenFit', rating: 4.3, reviewCount: 198, stock: 100 },
  { id: '10', name: 'Cashmere Sweater', price: 249, images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400'], category: 'Fashion', brand: 'LuxWear', rating: 4.6, reviewCount: 73, stock: 20 },
  { id: '11', name: 'Coffee Maker Pro', price: 189, compareAtPrice: 239, images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'], category: 'Home & Garden', brand: 'BrewMaster', rating: 4.7, reviewCount: 289, stock: 55, discount_percentage: 21 },
  { id: '12', name: 'Portable Speaker', price: 99, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'], category: 'Electronics', brand: 'SoundWave', rating: 4.5, reviewCount: 167, stock: 70 },
];

const categories = ['All', 'Electronics', 'Fashion', 'Jewelry', 'Home & Garden', 'Sports', 'Beauty'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
      ))}
    </div>
  );
}

function ProductCard({ product, view }: { product: Product; view: 'grid' | 'list' }) {
  const { addItem } = useCartStore();
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product as any, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-5 hover:border-amber-400/30 transition-all group"
      >
        <Link href={`/products/${product.id}`} className="shrink-0">
          <div className="w-36 h-36 rounded-xl overflow-hidden bg-white/5">
            <Image src={product.images[0]} alt={product.name} width={144} height={144} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </Link>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-amber-400 font-medium">{product.category}</span>
              {product.brand && <span className="text-xs text-gray-500">· {product.brand}</span>}
            </div>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-white font-semibold hover:text-amber-400 transition line-clamp-1">{product.name}</h3>
            </Link>
            {product.rating && (
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={product.rating} />
                <span className="text-gray-400 text-xs">{product.rating} ({product.reviewCount})</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xl">${product.price}</span>
              {product.compareAtPrice && <span className="text-gray-500 line-through text-sm">${product.compareAtPrice}</span>}
              {product.discount_percentage && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">-{product.discount_percentage}%</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setWishlisted(!wishlisted)}
                className={`p-2 rounded-lg border transition ${wishlisted ? 'border-red-500/30 text-red-400' : 'border-white/20 text-gray-400 hover:text-red-400'}`}>
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handleAddToCart}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm transition">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/30 transition-all group"
    >
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden aspect-square">
        <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.discount_percentage && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount_percentage}%
          </span>
        )}
        <button onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition ${wishlisted ? 'bg-red-500/80 text-white' : 'bg-black/40 text-gray-300 hover:text-red-400'}`}>
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-amber-400 font-medium">{product.category}</span>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-white font-semibold line-clamp-2 hover:text-amber-400 transition text-sm">{product.name}</h3>
        </Link>
        {product.rating && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={product.rating} />
            <span className="text-gray-400 text-xs">({product.reviewCount})</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-amber-400 font-bold text-lg">${product.price}</span>
            {product.compareAtPrice && <span className="text-gray-500 line-through text-xs ml-1">${product.compareAtPrice}</span>}
          </div>
          <button onClick={handleAddToCart}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-sm transition">
            + Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [filtered, setFiltered] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let result = [...mockProducts];
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    result = result.filter(p => p.price <= maxPrice);
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    setFiltered(result);
  }, [search, selectedCategory, sortBy, maxPrice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0518] via-[#1A0A2E] to-[#2D1B4E]">
      {/* Sticky Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-amber-400 font-bold text-xl shrink-0">EliteShop</Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition text-sm" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border rounded-xl px-4 py-2 text-sm transition ${showFilters ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/20 text-white hover:border-amber-400/50'}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="flex border border-white/20 rounded-xl overflow-hidden">
            <button onClick={() => setView('grid')}
              className={`p-2 transition ${view === 'grid' ? 'bg-amber-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')}
              className={`p-2 transition ${view === 'list' ? 'bg-amber-500 text-slate-900' : 'text-gray-400 hover:text-white'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        {showFilters && (
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="w-64 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-3">Category</h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedCategory === cat ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-3">
                  Max Price: <span className="text-amber-400">${maxPrice}</span>
                </h4>
                <input type="range" min={50} max={1500} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-400" />
              </div>
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-3">Sort By</h4>
                <div className="space-y-1">
                  {sortOptions.map(opt => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${sortBy === opt.value ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { setSelectedCategory('All'); setSortBy('newest'); setMaxPrice(1500); setSearch(''); }}
                className="w-full text-amber-400 hover:text-amber-300 text-sm underline text-center">
                Clear All
              </button>
            </div>
          </motion.aside>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap mb-5">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedCategory === cat ? 'bg-amber-500 text-slate-900' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/30'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Results bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-medium">{filtered.length}</span> products found
            </p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-400">
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#1A0A2E]">{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Grid / List */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <button onClick={() => { setSelectedCategory('All'); setSearch(''); setMaxPrice(1500); }}
                className="text-amber-400 hover:text-amber-300 text-sm underline">Clear filters</button>
            </div>
          ) : (
            <div className={view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
            }>
              {filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <ProductCard product={product} view={view} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
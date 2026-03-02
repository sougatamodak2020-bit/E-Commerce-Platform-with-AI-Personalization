'use client';

// ============================================
// PRODUCTS PAGE
// ============================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { ProductGrid, ProductFilters } from '@/components/products';
import { Button } from '@/components/ui';
import { useProducts } from '@/hooks';
import { useFiltersStore } from '@/store';
import { useIsMobile } from '@/hooks/ui/useMediaQuery';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

// Mock products for demo
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-fidelity audio with noise cancellation',
    price: 299,
    compareAtPrice: 399,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    category: 'Electronics',
    brand: 'AudioPro',
    sku: 'HP-001',
    stock: 50,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: ['wireless', 'premium'],
    attributes: [],
    reviews: [],
    rating: 4.8,
    reviewCount: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 1500,
    purchaseCount: 230,
  },
  {
    id: '2',
    name: 'Luxury Watch Collection',
    description: 'Swiss-made automatic movement',
    price: 1299,
    compareAtPrice: 1599,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    category: 'Accessories',
    brand: 'TimeKeeper',
    sku: 'WH-002',
    stock: 25,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: ['luxury', 'watch'],
    attributes: [],
    reviews: [],
    rating: 4.9,
    reviewCount: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 2100,
    purchaseCount: 156,
  },
  {
    id: '3',
    name: 'Designer Sunglasses',
    description: 'UV protection with style',
    price: 199,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'],
    category: 'Fashion',
    brand: 'VisionStyle',
    sku: 'SG-003',
    stock: 100,
    isActive: true,
    isFeatured: false,
    sellerId: '1',
    tags: ['fashion', 'summer'],
    attributes: [],
    reviews: [],
    rating: 4.6,
    reviewCount: 67,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 980,
    purchaseCount: 145,
  },
  {
    id: '4',
    name: 'Smart Home Speaker',
    description: 'Voice-controlled AI assistant',
    price: 149,
    images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=400'],
    category: 'Electronics',
    brand: 'SmartLiving',
    sku: 'SP-004',
    stock: 75,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: ['smart', 'home'],
    attributes: [],
    reviews: [],
    rating: 4.7,
    reviewCount: 203,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 1800,
    purchaseCount: 312,
  },
  {
    id: '5',
    name: 'Leather Messenger Bag',
    description: 'Handcrafted genuine leather',
    price: 249,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    category: 'Accessories',
    brand: 'CraftLeather',
    sku: 'BG-005',
    stock: 30,
    isActive: true,
    isFeatured: false,
    sellerId: '1',
    tags: ['leather', 'bag'],
    attributes: [],
    reviews: [],
    rating: 4.5,
    reviewCount: 56,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 750,
    purchaseCount: 98,
  },
  {
    id: '6',
    name: 'Fitness Tracker Pro',
    description: 'Advanced health monitoring',
    price: 179,
    compareAtPrice: 229,
    images: ['https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400'],
    category: 'Electronics',
    brand: 'FitTech',
    sku: 'FT-006',
    stock: 60,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: ['fitness', 'wearable'],
    attributes: [],
    reviews: [],
    rating: 4.4,
    reviewCount: 178,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 1200,
    purchaseCount: 267,
  },
  {
    id: '7',
    name: 'Ceramic Vase Set',
    description: 'Minimalist home decor',
    price: 89,
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400'],
    category: 'Home',
    brand: 'HomeCraft',
    sku: 'VS-007',
    stock: 45,
    isActive: true,
    isFeatured: false,
    sellerId: '1',
    tags: ['home', 'decor'],
    attributes: [],
    reviews: [],
    rating: 4.3,
    reviewCount: 34,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 450,
    purchaseCount: 67,
  },
  {
    id: '8',
    name: 'Professional Camera Lens',
    description: '85mm f/1.4 portrait lens',
    price: 899,
    images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400'],
    category: 'Electronics',
    brand: 'PhotoPro',
    sku: 'CL-008',
    stock: 15,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: ['camera', 'photography'],
    attributes: [],
    reviews: [],
    rating: 4.9,
    reviewCount: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 890,
    purchaseCount: 28,
  },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const isMobile = useIsMobile();
  const { sortBy: filterSortBy, setSortBy: setFilterSortBy } = useFiltersStore();

  // Using mock data for now
  const products = mockProducts;
  const isLoading = false;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl text-white mb-4"
          >
            All Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 max-w-2xl mx-auto"
          >
            Discover our curated collection of premium products
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="lg:hidden"
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Filters
              </Button>

              {/* Results Count */}
              <p className="text-gray-500">
                Showing <span className="font-semibold text-gray-900">{products.length}</span> products
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">
                    {sortOptions.find(o => o.value === sortBy)?.label || 'Sort By'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-20">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === option.value ? 'text-amber-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-500'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-500'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid with Sidebar */}
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters />
            </aside>

            {/* Products */}
            <div className="flex-1">
              <ProductGrid products={products} loading={isLoading} columns={3} />
            </div>
          </div>

          {/* Mobile Filters */}
          <ProductFilters
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            isMobile
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { ProductCard, ProductFilters } from '@/components/products';
import { Button } from '@/components/ui';

const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-fidelity audio',
    price: 299,
    compareAtPrice: 399,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    ],
    category: 'Electronics',
    brand: 'AudioPro',
    sku: 'HP-001',
    stock: 50,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: [],
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
    description: 'Swiss-made',
    price: 1299,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    ],
    category: 'Jewelry',
    brand: 'TimeKeeper',
    sku: 'WH-002',
    stock: 25,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: [],
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
    description: 'UV protection',
    price: 199,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    ],
    category: 'Fashion',
    brand: 'VisionStyle',
    sku: 'SG-003',
    stock: 100,
    isActive: true,
    isFeatured: false,
    sellerId: '1',
    tags: [],
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
    description: 'Voice AI',
    price: 149,
    images: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
    ],
    category: 'Electronics',
    brand: 'SmartLiving',
    sku: 'SP-004',
    stock: 75,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: [],
    attributes: [],
    reviews: [],
    rating: 4.7,
    reviewCount: 203,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 1800,
    purchaseCount: 312,
  },
];

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState(mockProducts);

  useEffect(() => {
    if (query) {
      const filtered = mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockProducts);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-royal-cream">
      <Header />

      <section className="bg-gradient-to-r from-royal-purple to-royal-purple-light py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-display text-3xl text-white text-center mb-8">
            {query ? `Search results for "${query}"` : 'Search Products'}
          </h1>
          <form className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-16 pr-6 py-5 rounded-2xl text-lg border-none focus:ring-4 focus:ring-royal-gold/50"
            />
          </form>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              Found{' '}
              <span className="font-semibold text-gray-900">
                {results.length}
              </span>{' '}
              results
            </p>
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </Button>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try different keywords or browse our categories
              </p>
            </div>
          )}
        </div>
      </section>

      <ProductFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        isMobile
      />
      <Footer />
    </div>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import type { Product } from '@/types/models';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { addItem } = useCartStore();
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist!');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open quick view modal - for now just navigate
    window.location.href = `/products/${product.id}`;
  };

  if (variant === 'horizontal') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
      >
        <Link href={`/products/${product.id}`} className="w-24 h-24 flex-shrink-0">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-gray-900 truncate hover:text-amber-600">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-amber-600">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container - Using div instead of Link wrapper */}
      <div className="relative block aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View {product.name}</span>
        </Link>
        
        <Image
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {product.isFeatured && (
            <span className="px-2 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded">
              FEATURED
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              -{discountPercent}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
              LOW STOCK
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Quick Actions - Using buttons instead of Links */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={handleWishlist}
            className="w-9 h-9 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={handleQuickView}
            className="w-9 h-9 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform z-20">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-2.5 bg-white text-slate-900 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors min-h-[48px]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3.5 h-3.5',
                  i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

const mockProducts: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'Experience unparalleled audio quality with our flagship wireless headphones. Featuring advanced noise cancellation, 40-hour battery life, and premium comfort for all-day wear. The custom 40mm drivers deliver rich, detailed sound across all frequencies.',
    price: 299,
    compareAtPrice: 399,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800',
    ],
    category: 'Electronics',
    brand: 'AudioPro',
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    features: [
      'Active Noise Cancellation',
      '40-hour battery life',
      'Premium memory foam cushions',
      'Bluetooth 5.3',
      'Multi-device connection',
    ],
  },
  '2': {
    id: '2',
    name: 'Luxury Watch Collection',
    description: 'Swiss-made automatic movement with sapphire crystal glass. This timepiece combines traditional craftsmanship with modern elegance, featuring a 42mm case and genuine leather strap.',
    price: 1299,
    compareAtPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    ],
    category: 'Jewelry',
    brand: 'TimeKeeper',
    rating: 4.9,
    reviewCount: 89,
    stock: 25,
    features: [
      'Swiss automatic movement',
      'Sapphire crystal glass',
      '100m water resistance',
      'Genuine leather strap',
      '5-year warranty',
    ],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = mockProducts[productId] || mockProducts['1'];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Brand & Category */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-amber-600 font-semibold uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>

            <h1 className="font-display text-3xl lg:text-4xl text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">{product.rating}</span>
              <span className="text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features */}
            {product.features && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-600 text-sm">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                leftIcon={<ShoppingBag className="w-5 h-5" />}
                className="flex-1"
              >
                Add to Cart
              </Button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button className="p-3 rounded-xl border border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Stock Status */}
            <p className="text-sm mb-8">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders $100+' },
                { icon: Shield, label: 'Secure Payment', sub: '256-bit SSL' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <badge.icon className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-900">{badge.label}</p>
                  <p className="text-xs text-gray-500">{badge.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
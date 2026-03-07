'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Minus, Plus, Truck, Shield, RotateCcw, Share2 } from 'lucide-react';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

const mockProducts: Record<string, any> = {
  '1': { id: '1', name: 'Premium Wireless Headphones', description: 'Experience unparalleled audio quality with our flagship wireless headphones. Featuring advanced noise cancellation, 40-hour battery life, and premium comfort for all-day wear.', price: 299, compareAtPrice: 399, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'], category: 'Electronics', brand: 'AudioPro', rating: 4.8, reviewCount: 124, stock: 50, features: ['Active Noise Cancellation','40-hour battery life','Bluetooth 5.3','Multi-device connection'] },
  '2': { id: '2', name: 'Luxury Watch Collection', description: 'Swiss-made automatic movement with sapphire crystal glass.', price: 1299, compareAtPrice: 1599, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'], category: 'Jewelry', brand: 'TimeKeeper', rating: 4.9, reviewCount: 89, stock: 25, features: ['Swiss automatic movement','Sapphire crystal glass','100m water resistance'] },
};

export default function ProductDetailPage() {
  const params = useParams();
  const product = mockProducts[params.id as string] || mockProducts['1'];
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], quantity });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0518] via-[#1A0A2E] to-[#2D1B4E]">
      {/* Nav */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-amber-400 transition">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-400 transition">Products</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-4">
              <Image src={product.images[selectedImage]} alt={product.name} width={800} height={800} className="w-full h-full object-cover" priority />
            </div>
            <div className="flex gap-3">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-amber-400' : 'border-white/20 hover:border-white/40'}`}>
                  <Image src={img} alt={`${product.name} ${i+1}`} width={80} height={80} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">{product.brand}</span>
              <span className="text-white/20">|</span>
              <span className="text-gray-400 text-sm">{product.category}</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                ))}
              </div>
              <span className="text-white font-semibold">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-amber-400">${product.price}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">${product.compareAtPrice}</span>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-bold rounded-full border border-red-500/30">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>

            {product.features && (
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-white/20 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-white hover:bg-white/10 transition">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-white hover:bg-white/10 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all">
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-xl border transition-all ${isWishlisted ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'border-white/20 text-gray-400 hover:border-red-400/50 hover:text-red-400'}`}>
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-xl border border-white/20 text-gray-400 hover:text-white transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm mb-8">
              {product.stock > 0
                ? <span className="text-green-400 font-medium">✓ In Stock ({product.stock} available)</span>
                : <span className="text-red-400 font-medium">Out of Stock</span>}
            </p>

            <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders $100+' },
                { icon: Shield, label: 'Secure Payment', sub: '256-bit SSL' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
              ].map(badge => (
                <div key={badge.label} className="text-center">
                  <badge.icon className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-white">{badge.label}</p>
                  <p className="text-xs text-gray-400">{badge.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
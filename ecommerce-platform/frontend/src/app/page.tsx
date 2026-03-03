'use client';
import dynamic from 'next/dynamic';
const Hero3DScene = dynamic(() => import('@/components/3d/Hero3DScene').then(m => ({ default: m.default })), { ssr: false, loading: () => null });


import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Star,
  TrendingUp,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  Crown,
  Diamond,
  Gift,
  Clock,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { ProductCard } from '@/components/products';
import { Button } from '@/components/ui';

// Dynamically import 3D scene (client-side only)

const categories = [
  { 
    name: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
    count: 125,
    icon: Zap,
  },
  { 
    name: 'Fashion', 
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
    count: 89,
    icon: Crown,
  },
  { 
    name: 'Home & Living', 
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    count: 67,
    icon: Gift,
  },
  { 
    name: 'Jewelry', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
    count: 45,
    icon: Diamond,
  },
];

const features = [
  { icon: Zap, title: 'AI Recommendations', desc: 'Personalized just for you' },
  { icon: Shield, title: 'Secure Shopping', desc: '256-bit SSL encryption' },
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
];

const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-fidelity audio with noise cancellation',
    price: 299,
    compareAtPrice: 399,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
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
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    category: 'Jewelry',
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
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
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
    images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=600'],
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
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '10K+', label: 'Products' },
  { value: '99%', label: 'Satisfaction' },
  { value: '24/7', label: 'Support' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-royal-cream">
      <Header />

      {/* Hero Section with 3D */}
      <section className="relative h-screen min-h-[800px] overflow-hidden bg-gradient-to-br from-royal-purple-dark via-royal-purple to-royal-purple-light">
        {/* 3D Background */}
        {mounted && (
          <Suspense fallback={null}>
            <Hero3DScene />
          </Suspense>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-royal-purple/30 to-royal-purple-dark/80" />

        {/* Content */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto px-6 h-full flex items-center"
        >
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-royal-gold/20 backdrop-blur-sm border border-royal-gold/30 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-royal-gold" />
              <span className="text-royal-gold text-sm font-medium tracking-wide">
                AI-POWERED LUXURY SHOPPING
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9]"
            >
              <span className="block">Discover</span>
              <span className="block text-gradient-gold">Extraordinary</span>
              <span className="block">Luxury</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/70 mb-10 max-w-xl font-light leading-relaxed"
            >
              Experience personalized shopping with AI recommendations 
              tailored to your unique style and preferences.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <button className="btn-royal px-8 py-4 text-lg font-semibold flex items-center gap-3 rounded-full">
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/categories">
                <button className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:border-royal-gold hover:text-royal-gold rounded-full transition-all flex items-center gap-3">
                  <Crown className="w-5 h-5" />
                  View Categories
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex gap-8 mt-16"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold text-royal-gold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-2 h-3 bg-royal-gold rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-y border-royal-gold/10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-royal-gold/20 to-royal-gold/5 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-royal-gold" />
                </div>
                <div>
                  <h4 className="font-semibold text-royal-charcoal">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-royal-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-royal-gold text-sm font-semibold tracking-[0.2em] uppercase">
              Curated Collections
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-royal-charcoal mt-4 mb-6">
              Shop by Category
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Explore our handpicked collections crafted for the discerning connoisseur
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className="group block relative h-80 rounded-3xl overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-purple-dark via-royal-purple/40 to-transparent" />
                  
                  {/* Icon */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-royal-gold rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <category.icon className="w-6 h-6 text-royal-purple-dark" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-white mb-2 group-hover:text-royal-gold transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/70 text-sm">{category.count} Products</p>
                    
                    <div className="mt-4 flex items-center gap-2 text-royal-gold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                      <span className="text-sm font-medium">Explore Collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Diamond className="w-6 h-6 text-royal-gold" />
                <span className="text-royal-gold text-sm font-semibold tracking-[0.2em] uppercase">
                  Handpicked Selection
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-royal-charcoal">
                Featured Products
              </h2>
            </motion.div>
            <Link href="/products?featured=true">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section className="py-24 bg-gradient-to-br from-royal-purple-dark via-royal-purple to-royal-purple-light relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-royal-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-royal-gold rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-gold/20 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-royal-gold" />
                <span className="text-royal-gold font-medium">Powered by AI</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Shopping Experience{' '}
                <span className="text-gradient-gold">Reimagined</span>
              </h2>
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Our AI learns your preferences and curates a personalized shopping 
                experience. Discover products you will love, before you even know you want them.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: Sparkles, title: 'Smart Recommendations' },
                  { icon: TrendingUp, title: 'Trend Analysis' },
                  { icon: Clock, title: 'Real-time Updates' },
                  { icon: Gift, title: 'Personalized Deals' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-royal-gold/20 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-royal-gold" />
                    </div>
                    <span className="text-white/90 font-medium">{item.title}</span>
                  </div>
                ))}
              </div>

              <Link href="/products">
                <button className="btn-royal px-8 py-4 text-lg font-semibold rounded-full flex items-center gap-3">
                  Discover Your Style
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:border-royal-gold/50 transition-colors"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white font-medium truncate">{product.name}</h4>
                  <p className="text-royal-gold font-bold mt-1">${product.price}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-royal-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-12 h-12 text-royal-gold mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl text-royal-charcoal mb-6">
              Join the Elite
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
              Subscribe to receive exclusive offers, early access to new arrivals, 
              and personalized recommendations curated just for you.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white rounded-full border-2 border-royal-gold/20 focus:border-royal-gold focus:outline-none transition-colors text-lg"
              />
              <button type="submit" className="btn-royal px-8 py-4 rounded-full text-lg font-semibold">
                Subscribe
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

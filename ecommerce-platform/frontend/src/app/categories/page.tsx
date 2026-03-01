'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/layout';

const categories = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and tech accessories',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    productCount: 125,
    subcategories: ['Phones', 'Laptops', 'Accessories', 'Audio'],
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    productCount: 89,
    subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
  },
  {
    id: '3',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture and home decor',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    productCount: 67,
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding'],
  },
  {
    id: '4',
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare, makeup, and fragrances',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    productCount: 45,
    subcategories: ['Skincare', 'Makeup', 'Fragrance', 'Hair Care'],
  },
  {
    id: '5',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports equipment and activewear',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    productCount: 32,
    subcategories: ['Equipment', 'Clothing', 'Shoes', 'Accessories'],
  },
  {
    id: '6',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Luxury jewelry and watches',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    productCount: 28,
    subcategories: ['Rings', 'Necklaces', 'Watches', 'Bracelets'],
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <section className="bg-gradient-to-r from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl text-white mb-4"
          >
            Shop by Category
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 max-w-2xl mx-auto"
          >
            Explore our wide range of categories and find exactly what you are looking for
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                        {category.productCount} Products
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.subcategories.map((sub) => (
                        <span key={sub} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-amber-600 font-medium text-sm group-hover:gap-2 transition-all">
                      Browse Collection
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

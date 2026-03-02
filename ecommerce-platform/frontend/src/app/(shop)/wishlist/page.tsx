'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { ProductCard } from '@/components/products';
import { Button } from '@/components/ui';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('/api/wishlist');
      if (response.data.success) {
        setWishlist(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await axios.delete(`/api/wishlist?productId=${productId}`);
      setWishlist(wishlist.filter(item => item.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const addAllToCart = () => {
    wishlist.forEach(item => {
      if (item.product) {
        addItem(item.product, 1);
      }
    });
    toast.success(`Added ${wishlist.length} items to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-cream">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-royal-charcoal mb-2">My Wishlist</h1>
            <p className="text-gray-500">{wishlist.length} items saved</p>
          </div>
          {wishlist.length > 0 && (
            <Button onClick={addAllToCart} leftIcon={<ShoppingBag className="w-5 h-5" />}>
              Add All to Cart
            </Button>
          )}
        </div>
        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="font-display text-3xl text-royal-charcoal mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save your favorite items to easily find them later</p>
            <Button onClick={() => window.location.href = '/products'}>Start Shopping</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative">
                <ProductCard product={item.product} />
                <button onClick={() => removeFromWishlist(item.productId)} className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors z-10">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

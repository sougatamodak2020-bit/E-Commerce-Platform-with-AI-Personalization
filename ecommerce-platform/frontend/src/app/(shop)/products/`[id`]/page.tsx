'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, Share2, Star, Truck, Shield, 
  RotateCcw, ChevronLeft, ChevronRight, Minus, Plus, Check 
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { Product3DViewer } from '@/components/3d/Product3DViewer';
import { useCartStore } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${params.id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const discount = product.compare_at_price 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-royal-cream">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => router.push('/')} className="hover:text-royal-gold">Home</button>
          <span>/</span>
          <button onClick={() => router.push('/products')} className="hover:text-royal-gold">Products</button>
          <span>/</span>
          <span className="text-royal-charcoal">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* 3D View Toggle */}
            <div className="mb-4 flex gap-2">
              <Button
                variant={!show3D ? 'primary' : 'outline'}
                onClick={() => setShow3D(false)}
                size="sm"
              >
                Photos
              </Button>
              <Button
                variant={show3D ? 'primary' : 'outline'}
                onClick={() => setShow3D(true)}
                size="sm"
              >
                3D View
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {show3D ? (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-square"
                >
                  <Product3DViewer
                    productName={product.name}
                    modelUrl={product.model_3d_url}
                    images={product.images}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="images"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Main Image */}
                  <div className="relative aspect-square bg-white rounded-3xl overflow-hidden mb-4 group">
                    <Image
                      src={product.images[selectedImage] || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                        -{discount}% OFF
                      </div>
                    )}

                    {/* Image Navigation */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((prev) => 
                            prev === 0 ? product.images.length - 1 : prev - 1
                          )}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => setSelectedImage((prev) => 
                            prev === product.images.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {product.images.map((img: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            selectedImage === idx 
                              ? 'border-royal-gold scale-95' 
                              : 'border-gray-200 hover:border-royal-gold/50'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`${product.name} ${idx + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            <p className="text-royal-gold font-semibold mb-2">{product.brand}</p>

            {/* Name */}
            <h1 className="font-display text-4xl text-royal-charcoal mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating?.toFixed(1)} ({product.review_count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-royal-gold">
                {formatCurrency(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-2xl text-gray-400 line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-8">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="text-red-600 font-medium">Out of Stock</div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl w-40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center font-semibold focus:outline-none"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                leftIcon={<ShoppingBag className="w-5 h-5" />}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-royal-gold hover:text-royal-gold transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-royal-gold hover:text-royal-gold transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="text-center">
                <Truck className="w-8 h-8 text-royal-gold mx-auto mb-2" />
                <p className="text-xs font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-royal-gold mx-auto mb-2" />
                <p className="text-xs font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-royal-gold mx-auto mb-2" />
                <p className="text-xs font-medium">Easy Returns</p>
              </div>
            </div>

            {/* Product Details */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-lg mb-4">Product Details</h3>
                <dl className="space-y-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600 capitalize">{key}</dt>
                      <dd className="font-medium">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

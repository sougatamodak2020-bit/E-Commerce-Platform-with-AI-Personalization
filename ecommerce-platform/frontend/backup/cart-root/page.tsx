'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const handleRemove = (itemId: string, name: string) => {
    removeItem(itemId);
    toast.success(`${name} removed from cart`);
  };

  const subtotal = getTotal();
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] py-6">
          <div className="max-w-7xl mx-auto px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                <span className="font-display text-xl text-slate-900">M</span>
              </div>
              <span className="font-display text-xl text-white">MAISON ÉLITE</span>
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-amber-50 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="font-display text-4xl text-slate-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our collection and find something you love!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold tracking-wider hover:shadow-xl transition-all"
          >
            EXPLORE COLLECTION
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
              <span className="font-display text-xl text-slate-900">M</span>
            </div>
            <span className="font-display text-xl text-white">MAISON ÉLITE</span>
          </Link>
          <Link href="/products" className="text-white/70 hover:text-white flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl text-slate-900 mb-2">Shopping Bag</h1>
        <p className="text-gray-500 mb-12">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 p-6 bg-white border border-stone-200 card-luxury">
                {/* Product Image */}
                <div className="w-32 h-32 bg-stone-100 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[3px] text-purple-600 mb-1">
                        {item.product?.brand}
                      </p>
                      <h3 className="font-display text-lg text-slate-900">{item.product?.name}</h3>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id, item.product?.name || 'Item')}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-2xl font-display font-bold text-slate-900 mb-4">
                    ${item.product?.price?.toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Quantity:</span>
                    <div className="flex items-center border border-stone-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-stone-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-stone-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500 ml-auto">
                      Subtotal: <span className="font-semibold text-slate-900">${((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] p-8 text-white sticky top-6">
              <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-xl font-display font-bold">
                    <span>Total</span>
                    <span className="text-amber-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 500 && (
                <div className="bg-white/10 p-4 mb-6 text-sm">
                  <p className="text-amber-400 font-semibold mb-1">Almost there!</p>
                  <p className="text-white/70">
                    Add ${(500 - subtotal).toFixed(2)} more for FREE shipping
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-center tracking-wider hover:shadow-xl transition-all"
              >
                PROCEED TO CHECKOUT
              </Link>

              <div className="mt-6 flex items-center justify-center gap-4 text-white/50 text-xs">
                <span>🔒 Secure Checkout</span>
                <span>•</span>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
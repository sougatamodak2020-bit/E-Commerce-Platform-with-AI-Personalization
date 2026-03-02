'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, Search } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { Button, Input } from '@/components/ui';

const orderStatuses = [
  { status: 'Order Placed', icon: Package, date: '2024-01-15', completed: true },
  { status: 'Processing', icon: Clock, date: '2024-01-16', completed: true },
  { status: 'Shipped', icon: Truck, date: '2024-01-17', completed: true },
  { status: 'Delivered', icon: CheckCircle, date: '2024-01-20', completed: false },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderFound, setOrderFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setOrderFound(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl text-slate-900 mb-4">Track Your Order</h1>
          <p className="text-gray-500">Enter your order number to see the latest status</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-sm p-8 mb-8"
        >
          <div className="flex gap-4">
            <Input
              placeholder="Enter order number (e.g., ORD-12345)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              className="flex-1"
            />
            <Button type="submit" size="lg">
              Track
            </Button>
          </div>
        </motion.form>

        {orderFound && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-semibold text-lg">{orderNumber || 'ORD-12345'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-semibold text-lg text-amber-600">Jan 20, 2024</p>
              </div>
            </div>

            <div className="relative">
              {orderStatuses.map((item, index) => (
                <div key={item.status} className="flex gap-4 mb-8 last:mb-0">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-amber-500' : 'bg-gray-200'
                    }`}>
                      <item.icon className={`w-5 h-5 ${item.completed ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    {index < orderStatuses.length - 1 && (
                      <div className={`absolute left-5 top-10 w-0.5 h-12 ${
                        item.completed ? 'bg-amber-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${item.completed ? 'text-slate-900' : 'text-gray-400'}`}>
                      {item.status}
                    </p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

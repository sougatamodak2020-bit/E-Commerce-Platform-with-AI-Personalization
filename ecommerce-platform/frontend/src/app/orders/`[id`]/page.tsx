'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { formatCurrency } from '@/utils/formatters';
import axios from 'axios';
import Image from 'next/image';

const orderSteps = [
  { status: 'pending', label: 'Order Placed', icon: Package },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'processing', label: 'Processing', icon: Clock },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${params.id}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-royal-cream">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="font-display text-3xl text-royal-charcoal mb-4">Order Not Found</h2>
          <p className="text-gray-500 mb-8">We could not find the order you are looking for.</p>
          <button onClick={() => router.push('/orders')} className="btn-royal px-8 py-3 rounded-full">
            View All Orders
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = orderSteps.findIndex(step => step.status === order.status);

  return (
    <div className="min-h-screen bg-royal-cream">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl text-royal-charcoal mb-2">Order {order.order_number}</h1>
              <p className="text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-royal-gold">{formatCurrency(order.total)}</p>
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-between items-center">
              {orderSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.status} className="flex-1 flex flex-col items-center relative">
                    {index < orderSteps.length - 1 && (
                      <div className={`absolute left-1/2 top-6 w-full h-1 -z-10 ${isCompleted ? 'bg-royal-gold' : 'bg-gray-200'}`} style={{ left: '50%', right: '-50%' }} />
                    )}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }} className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isCompleted ? 'bg-royal-gold text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-royal-gold/30 scale-110' : ''}`}>
                      <step.icon className="w-6 h-6" />
                    </motion.div>
                    <p className={`text-sm font-medium text-center ${isCompleted ? 'text-royal-charcoal' : 'text-gray-400'}`}>{step.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

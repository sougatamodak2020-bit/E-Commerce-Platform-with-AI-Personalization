'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Package, Users, Eye, ArrowUpRight 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const stats = [
  { 
    title: 'Total Revenue', 
    value: '$124,563', 
    change: '+23.5%', 
    trend: 'up',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    title: 'Total Orders', 
    value: '1,284', 
    change: '+12.3%', 
    trend: 'up',
    icon: ShoppingCart,
    color: 'from-blue-500 to-indigo-500'
  },
  { 
    title: 'Products Sold', 
    value: '3,842', 
    change: '+8.7%', 
    trend: 'up',
    icon: Package,
    color: 'from-purple-500 to-violet-500'
  },
  { 
    title: 'New Customers', 
    value: '856', 
    change: '-2.4%', 
    trend: 'down',
    icon: Users,
    color: 'from-orange-500 to-amber-500'
  },
];

const revenueData = [
  { month: 'Jan', revenue: 12000, orders: 145 },
  { month: 'Feb', revenue: 15000, orders: 178 },
  { month: 'Mar', revenue: 13500, orders: 162 },
  { month: 'Apr', revenue: 18000, orders: 215 },
  { month: 'May', revenue: 21000, orders: 248 },
  { month: 'Jun', revenue: 24563, orders: 284 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#D4AF37' },
  { name: 'Fashion', value: 28, color: '#1A0A2E' },
  { name: 'Home', value: 20, color: '#722F37' },
  { name: 'Beauty', value: 12, color: '#2D1B4E' },
  { name: 'Sports', value: 5, color: '#4A1C24' },
];

const topProducts = [
  { name: 'Premium Headphones', sales: 342, revenue: '$102,258' },
  { name: 'Luxury Watch', sales: 128, revenue: '$166,272' },
  { name: 'Designer Sunglasses', sales: 256, revenue: '$50,944' },
  { name: 'Smart Speaker', sales: 189, revenue: '$28,161' },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-royal-charcoal mb-2">Analytics Dashboard</h1>
          <p className="text-gray-500">Track your store performance and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-royal-gold"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-royal-charcoal">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-lg mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#D4AF37" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-lg mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Top Selling Products</h3>
          <button className="text-royal-gold text-sm font-medium hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sales</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{product.name}</td>
                  <td className="py-4 px-4">{product.sales}</td>
                  <td className="py-4 px-4 font-semibold text-royal-gold">{product.revenue}</td>
                  <td className="py-4 px-4">
                    <button className="flex items-center gap-1 text-royal-gold hover:underline text-sm">
                      View Details
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

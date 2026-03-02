'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const stats = [
  {
    title: 'Total Revenue',
    value: '$124,563.00',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Total Products',
    value: '456',
    change: '+15.3%',
    trend: 'up',
    icon: Package,
    color: 'from-purple-500 to-violet-600',
  },
  {
    title: 'Total Customers',
    value: '2,345',
    change: '-2.4%',
    trend: 'down',
    icon: Users,
    color: 'from-orange-500 to-amber-600',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 240 },
  { month: 'Feb', revenue: 3000, orders: 198 },
  { month: 'Mar', revenue: 5000, orders: 300 },
  { month: 'Apr', revenue: 4500, orders: 280 },
  { month: 'May', revenue: 6000, orders: 350 },
  { month: 'Jun', revenue: 5500, orders: 320 },
  { month: 'Jul', revenue: 7000, orders: 400 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#D4AF37' },
  { name: 'Fashion', value: 25, color: '#1A0A2E' },
  { name: 'Home', value: 20, color: '#722F37' },
  { name: 'Beauty', value: 12, color: '#2D1B4E' },
  { name: 'Sports', value: 8, color: '#4A1C24' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', product: 'Premium Headphones', amount: '$299', status: 'Delivered', date: '2 hours ago' },
  { id: 'ORD-002', customer: 'Jane Smith', product: 'Luxury Watch', amount: '$1,299', status: 'Processing', date: '3 hours ago' },
  { id: 'ORD-003', customer: 'Mike Johnson', product: 'Designer Sunglasses', amount: '$199', status: 'Shipped', date: '5 hours ago' },
  { id: 'ORD-004', customer: 'Sarah Williams', product: 'Smart Speaker', amount: '$149', status: 'Pending', date: '6 hours ago' },
  { id: 'ORD-005', customer: 'Tom Brown', product: 'Leather Bag', amount: '$249', status: 'Delivered', date: '8 hours ago' },
];

const topProducts = [
  { name: 'Premium Wireless Headphones', sales: 234, revenue: '$69,966', growth: '+12%' },
  { name: 'Luxury Watch Collection', sales: 189, revenue: '$245,511', growth: '+8%' },
  { name: 'Designer Sunglasses', sales: 156, revenue: '$31,044', growth: '+15%' },
  { name: 'Smart Home Speaker', sales: 142, revenue: '$21,158', growth: '+5%' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                <div className={`flex items-center gap-1 mt-2 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-gray-500 text-sm">Monthly revenue and orders</p>
            </div>
            <select className="px-4 py-2 bg-gray-100 rounded-xl text-sm border-none focus:ring-2 focus:ring-royal-gold/50">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
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
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A0A2E',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
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
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button className="text-royal-gold text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{order.customer} - {order.product}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
            <button className="text-royal-gold text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-royal-gold to-royal-gold-light rounded-lg flex items-center justify-center text-royal-purple-dark font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.revenue}</p>
                  <p className="text-xs text-green-600">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

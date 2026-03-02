'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  Store,
  Tag,
  MessageSquare,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { cn } from '@/utils/helpers';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package, badge: 12 },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: 5 },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: 3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-screen bg-gradient-to-b from-royal-purple-dark to-royal-purple z-40 shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-royal-gold to-royal-gold-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-royal-purple-dark" />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden"
                  >
                    <span className="font-display text-lg text-white whitespace-nowrap">
                      Admin Panel
                    </span>
                    <p className="text-white/50 text-xs">MAISON ELITE</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group',
                    isActive
                      ? 'bg-royal-gold/20 text-royal-gold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && sidebarOpen && (
                    <span className="ml-auto bg-royal-gold text-royal-purple-dark text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && !sidebarOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-royal-gold text-royal-purple-dark text-xs font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 mb-4 px-2"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-royal-gold to-royal-gold-light rounded-full flex items-center justify-center">
                    <span className="text-royal-purple-dark font-bold text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0] || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                    </p>
                    <p className="text-white/50 text-xs truncate">Administrator</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <HelpCircle className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm">Help Center</span>}
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm">Logout</span>}
              </button>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-royal-gold rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}>
              <ChevronDown className="w-5 h-5 text-royal-purple-dark -rotate-90" />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 280 : 80 }}
        className="flex-1 min-h-screen"
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-display font-bold text-royal-charcoal">
                {navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-royal-gold/50 w-64"
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-royal-gold to-royal-gold-light rounded-full flex items-center justify-center">
                  <span className="text-royal-purple-dark font-bold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0] || 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

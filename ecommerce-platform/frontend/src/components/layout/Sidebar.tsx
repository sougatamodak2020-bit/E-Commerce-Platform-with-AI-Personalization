'use client';

// ============================================
// SIDEBAR COMPONENT (Admin/Dashboard)
// ============================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Store,
  Tag,
  MessageSquare,
  Bell,
  LogOut,
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { cn } from '@/utils/helpers';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: 5 },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Sellers', href: '/admin/sellers', icon: Store },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: 3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const sellerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { label: 'Products', href: '/seller/products', icon: Package },
  { label: 'Orders', href: '/seller/orders', icon: ShoppingCart, badge: 2 },
  { label: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/seller/settings', icon: Settings },
];

interface SidebarProps {
  type?: 'admin' | 'seller';
}

export const Sidebar: React.FC<SidebarProps> = ({ type = 'admin' }) => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  const navItems = type === 'admin' ? adminNavItems : sellerNavItems;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 80 }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-[#1a0a2e] to-[#0d0518] border-r border-white/10 z-40"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-slate-900" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-lg text-white tracking-wider"
              >
                MAISON Ã‰LITE
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group',
                  isActive
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {item.badge && sidebarOpen && (
                  <span className="ml-auto bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.badge && !sidebarOpen && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-white/50 text-xs truncate capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          ) : null}
          
          <div className="space-y-1">
            <Link
              href="/help"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <HelpCircle className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Help Center</span>}
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4 text-slate-900" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-900" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

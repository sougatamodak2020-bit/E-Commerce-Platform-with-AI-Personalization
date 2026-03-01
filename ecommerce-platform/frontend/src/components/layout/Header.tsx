'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Sparkles,
} from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '@/store';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/helpers';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories', hasDropdown: true },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Sale', href: '/products?sale=true', highlight: true },
];

const categories = [
  { label: 'Electronics', href: '/products?category=electronics' },
  { label: 'Fashion', href: '/products?category=fashion' },
  { label: 'Home & Living', href: '/products?category=home-living' },
  { label: 'Beauty', href: '/products?category=beauty' },
  { label: 'Sports', href: '/products?category=sports' },
];

export const Header: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { mobileMenuOpen, setMobileMenuOpen, setCartDrawerOpen } = useUIStore();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only get item count after mount to avoid hydration mismatch
  const itemCount = mounted ? getItemCount() : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]'
        )}
      >
        {/* Top Bar */}
        <div className={cn(
          'hidden md:block border-b transition-colors',
          isScrolled ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-black/20'
        )}>
          <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-xs">
            <p className={isScrolled ? 'text-gray-600' : 'text-white/70'}>
              Free shipping on orders over $100 | Use code WELCOME10 for 10% off
            </p>
            <div className="flex items-center gap-4">
              <Link href="/track-order" className={cn(
                'hover:underline',
                isScrolled ? 'text-gray-600' : 'text-white/70'
              )}>
                Track Order
              </Link>
              <Link href="/help" className={cn(
                'hover:underline',
                isScrolled ? 'text-gray-600' : 'text-white/70'
              )}>
                Help
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-slate-900" />
              </div>
              <span className={cn(
                'font-display text-xl tracking-wider hidden sm:block',
                isScrolled ? 'text-slate-900' : 'text-white'
              )}>
                MAISON ELITE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setShowCategories(true)}
                  onMouseLeave={() => link.hasDropdown && setShowCategories(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 text-sm font-medium tracking-wide transition-colors',
                      link.highlight
                        ? 'text-amber-500'
                        : isScrolled
                        ? 'text-gray-700 hover:text-amber-600'
                        : 'text-white/90 hover:text-white'
                    )}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {showCategories && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                        >
                          {categories.map((cat) => (
                            <Link
                              key={cat.href}
                              href={cat.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-full text-sm transition-all',
                    isScrolled
                      ? 'bg-gray-100 focus:bg-white border border-gray-200'
                      : 'bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:bg-white/20'
                  )}
                />
                <Search className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                  isScrolled ? 'text-gray-400' : 'text-white/60'
                )} />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <button
                className={cn(
                  'md:hidden p-2 rounded-full transition-colors',
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                )}
              >
                <Search className={cn('w-5 h-5', isScrolled ? 'text-gray-700' : 'text-white')} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={cn(
                  'hidden sm:flex p-2 rounded-full transition-colors',
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                )}
              >
                <Heart className={cn('w-5 h-5', isScrolled ? 'text-gray-700' : 'text-white')} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className={cn(
                  'relative p-2 rounded-full transition-colors',
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                )}
              >
                <ShoppingBag className={cn('w-5 h-5', isScrolled ? 'text-gray-700' : 'text-white')} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  )}
                >
                  <User className={cn('w-5 h-5', isScrolled ? 'text-gray-700' : 'text-white')} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      {mounted && isAuthenticated ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  'lg:hidden p-2 rounded-full transition-colors',
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                )}
              >
                {mobileMenuOpen ? (
                  <X className={cn('w-5 h-5', isScrolled ? 'text-gray-700' : 'text-white')} />
                ) : (
                  <Menu className={cn('w-5 h-5', isScrolled ? 'text-gray-700' : 'text-white')} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="max-w-7xl mx-auto px-6 py-4">
                <nav className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block py-2 text-gray-700 hover:text-amber-600',
                        link.highlight && 'text-amber-500 font-medium'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-20 md:h-28" />
    </>
  );
};

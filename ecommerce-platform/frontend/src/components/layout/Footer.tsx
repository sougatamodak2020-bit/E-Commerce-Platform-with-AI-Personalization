'use client';

// ============================================
// FOOTER COMPONENT
// ============================================

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
} from 'lucide-react';

const footerLinks = {
  shop: {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popular' },
      { label: 'Sale', href: '/products?sale=true' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Affiliates', href: '/affiliates' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
};

const features = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $100' },
  { icon: RotateCcw, label: 'Easy Returns', desc: '30-day return policy' },
  { icon: Shield, label: 'Secure Payment', desc: '256-bit SSL encryption' },
  { icon: CreditCard, label: 'Multiple Payment', desc: 'All major cards accepted' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1a0a2e] to-[#0d0518]">
      {/* Features Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{feature.label}</p>
                  <p className="text-white/60 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-slate-900" />
              </div>
              <span className="font-display text-xl text-white tracking-wider">
                MAISON ÉLITE
              </span>
            </Link>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Discover luxury products with AI-powered personalization. 
              Your perfect shopping experience awaits.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@maisonelite.com" className="flex items-center gap-2 text-white/60 hover:text-amber-400 text-sm">
                <Mail className="w-4 h-4" />
                hello@maisonelite.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-white/60 hover:text-amber-400 text-sm">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <p className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                New York, NY 10001
              </p>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-amber-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Subscribe to our newsletter</h4>
              <p className="text-white/60 text-sm">Get 10% off your first order and stay updated!</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2024 Maison Élite. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors group">
              <Facebook className="w-5 h-5 text-white/60 group-hover:text-slate-900" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors group">
              <Twitter className="w-5 h-5 text-white/60 group-hover:text-slate-900" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors group">
              <Instagram className="w-5 h-5 text-white/60 group-hover:text-slate-900" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors group">
              <Youtube className="w-5 h-5 text-white/60 group-hover:text-slate-900" />
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs mr-2">We accept:</span>
            <div className="flex gap-2">
              {['visa', 'mastercard', 'amex', 'paypal'].map((card) => (
                <div key={card} className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <span className="text-white/60 text-xs uppercase">{card.slice(0, 2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

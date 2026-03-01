'use client';

// ============================================
// PRODUCT FILTERS COMPONENT
// ============================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react';
import { useFiltersStore } from '@/store';
import { Button } from '@/components/ui';
import { cn } from '@/utils/helpers';

interface FilterSection {
  id: string;
  label: string;
  type: 'checkbox' | 'range';
  options?: Array<{ value: string; label: string; count?: number }>;
  range?: { min: number; max: number };
}

const filterSections: FilterSection[] = [
  {
    id: 'categories',
    label: 'Categories',
    type: 'checkbox',
    options: [
      { value: 'electronics', label: 'Electronics', count: 125 },
      { value: 'fashion', label: 'Fashion', count: 89 },
      { value: 'home', label: 'Home & Living', count: 67 },
      { value: 'beauty', label: 'Beauty', count: 45 },
      { value: 'sports', label: 'Sports', count: 32 },
    ],
  },
  {
    id: 'brands',
    label: 'Brands',
    type: 'checkbox',
    options: [
      { value: 'apple', label: 'Apple', count: 45 },
      { value: 'samsung', label: 'Samsung', count: 38 },
      { value: 'nike', label: 'Nike', count: 29 },
      { value: 'adidas', label: 'Adidas', count: 25 },
      { value: 'sony', label: 'Sony', count: 18 },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    type: 'range',
    range: { min: 0, max: 10000 },
  },
];

const ratingOptions = [5, 4, 3, 2, 1];

interface ProductFiltersProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  isOpen = true,
  onClose,
  isMobile = false,
}) => {
  const {
    categories,
    brands,
    priceRange,
    rating,
    inStock,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setRating,
    setInStock,
    resetFilters,
  } = useFiltersStore();

  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    'categories',
    'brands',
    'price',
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const hasActiveFilters =
    categories.length > 0 ||
    brands.length > 0 ||
    rating !== null ||
    inStock ||
    priceRange.min > 0 ||
    priceRange.max < 10000;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-amber-600 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      {filterSections.map((section) => (
        <div key={section.id} className="border-b border-gray-200 pb-4">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex items-center justify-between w-full py-2"
          >
            <span className="font-medium text-gray-900">{section.label}</span>
            {expandedSections.includes(section.id) ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.includes(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {section.type === 'checkbox' && section.options && (
                  <div className="space-y-2 pt-2">
                    {section.options.map((option) => {
                      const isChecked =
                        section.id === 'categories'
                          ? categories.includes(option.value)
                          : brands.includes(option.value);

                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              section.id === 'categories'
                                ? toggleCategory(option.value)
                                : toggleBrand(option.value)
                            }
                            className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-amber-600">
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="ml-auto text-xs text-gray-400">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}

                {section.type === 'range' && section.range && (
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Min</label>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange(Number(e.target.value), priceRange.max)
                          }
                          min={section.range.min}
                          max={section.range.max}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <span className="text-gray-400 pt-5">-</span>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Max</label>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange(priceRange.min, Number(e.target.value))
                          }
                          min={section.range.min}
                          max={section.range.max}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Rating Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-gray-900">Rating</span>
          {expandedSections.includes('rating') ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.includes('rating') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2 pt-2"
            >
              {ratingOptions.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={rating === r}
                    onChange={() => setRating(r)}
                    className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'text-sm',
                          i < r ? 'text-amber-400' : 'text-gray-300'
                        )}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">& Up</span>
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* In Stock */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
        />
        <span className="text-sm text-gray-700">In Stock Only</span>
      </label>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 h-screen w-80 bg-white z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
              <div className="mt-6">
                <Button fullWidth onClick={onClose}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">{content}</div>;
};

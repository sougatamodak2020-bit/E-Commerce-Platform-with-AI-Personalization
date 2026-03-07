'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, Check } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ProductUploadPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: 'electronics',
    brand: '',
    sku: '',
    stock: '',
    tags: '',
    isFeatured: false,
  });

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingImages(true);

    const uploadPromises = acceptedFiles.map((file) => uploadImageToSupabase(file));
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter(Boolean) as string[];

    setUploadedImages((prev) => [...prev, ...validUrls]);
    toast.success(`${validUrls.length} image(s) uploaded successfully!`);
    setUploadingImages(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : null,
        category: formData.category,
        brand: formData.brand,
        sku: formData.sku,
        stock: parseInt(formData.stock),
        images: uploadedImages,
        sellerId: user?.id || '1',
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        isFeatured: formData.isFeatured,
      };

      const response = await axios.post('/api/products', productData);

      if (response.data.success) {
        toast.success('Product created and uploaded to Supabase!');
        router.push('/admin/products');
      }
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast.error(
        error.response?.data?.error?.message || 'Failed to create product'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-royal-charcoal mb-2">
          Add New Product
        </h1>
        <p className="text-gray-500">Upload to Supabase Database</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload with Supabase */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-4">Product Images</h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-royal-gold bg-royal-gold/5'
                : 'border-gray-300 hover:border-royal-gold'
            } ${uploadingImages ? 'opacity-50 cursor-wait' : ''}`}
          >
            <input {...getInputProps()} disabled={uploadingImages} />
            {uploadingImages ? (
              <Loader2 className="w-12 h-12 text-royal-gold mx-auto mb-4 animate-spin" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            )}
            {uploadingImages ? (
              <p className="text-royal-gold font-medium">
                Uploading to Supabase...
              </p>
            ) : isDragActive ? (
              <p className="text-royal-gold font-medium">
                Drop images here...
              </p>
            ) : (
              <>
                <p className="text-gray-700 font-medium mb-1">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-gray-500 text-sm">
                  Images will be uploaded to Supabase Storage
                </p>
              </>
            )}
          </div>

          {/* Preview Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {uploadedImages.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                >
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-royal-gold text-royal-purple text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Uploaded
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-4">Product Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Product Name *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Brand *"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
            <Input
              label="SKU *"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              placeholder="PROD-001"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-gold"
                required
              >
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home-living">Home & Living</option>
                <option value="jewelry">Jewelry</option>
                <option value="sports">Sports</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-gold"
              required
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-4">Pricing & Inventory</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Input
              label="Price *"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              leftIcon={<span className="text-gray-500">$</span>}
              required
            />
            <Input
              label="Compare At Price"
              type="number"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={(e) =>
                setFormData({ ...formData, compareAtPrice: e.target.value })
              }
              leftIcon={<span className="text-gray-500">$</span>}
            />
            <Input
              label="Stock Quantity *"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Tags & Featured */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-4">Additional Options</h2>
          <Input
            label="Tags (comma separated)"
            placeholder="wireless, premium, bestseller"
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: e.target.value })
            }
          />
          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="w-5 h-5 text-royal-gold rounded focus:ring-royal-gold"
            />
            <span className="text-gray-700">Mark as Featured Product</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            disabled={uploadingImages}
            className="flex-1"
          >
            {loading ? 'Creating & Uploading to Supabase...' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
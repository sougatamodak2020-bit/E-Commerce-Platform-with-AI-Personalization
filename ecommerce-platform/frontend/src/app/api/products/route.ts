// ============================================
// PRODUCTS API ROUTE
// ============================================

import { NextRequest, NextResponse } from 'next/server';

// Mock products data
const products = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-fidelity audio with noise cancellation',
    price: 299,
    compareAtPrice: 399,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    category: 'Electronics',
    brand: 'AudioPro',
    sku: 'HP-001',
    stock: 50,
    isActive: true,
    isFeatured: true,
    sellerId: '1',
    tags: ['wireless', 'premium'],
    attributes: [],
    reviews: [],
    rating: 4.8,
    reviewCount: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 1500,
    purchaseCount: 230,
  },
  // Add more products...
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  let filteredProducts = [...products];

  // Apply search
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply category filter
  if (category) {
    filteredProducts = filteredProducts.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Apply sorting
  switch (sort) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
    default:
      filteredProducts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProducts = filteredProducts.slice(start, end);

  return NextResponse.json({
    success: true,
    data: paginatedProducts,
    meta: {
      page,
      limit,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      hasMore: end < filteredProducts.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newProduct = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    purchaseCount: 0,
    rating: 0,
    reviewCount: 0,
  };

  products.push(newProduct);

  return NextResponse.json({
    success: true,
    data: newProduct,
    message: 'Product created successfully',
  }, { status: 201 });
}

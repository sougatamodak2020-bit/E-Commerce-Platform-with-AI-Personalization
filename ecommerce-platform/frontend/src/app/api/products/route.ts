import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      brand,
      sku,
      stock,
      images,
      sellerId,
      tags,
      isFeatured,
    } = body;

    // Validation
    if (!name || !description || !price || !category || !sku) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          statusCode: 400,
        },
      }, { status: 400 });
    }

    // Create slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Get category ID
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (categoryError || !categoryData) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CATEGORY',
          message: 'Category not found',
          statusCode: 400,
        },
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        seller_id: sellerId,
        category_id: categoryData.id,
        name,
        slug,
        description,
        price,
        compare_at_price: compareAtPrice,
        brand,
        sku,
        stock,
        images: images || [],
        tags: tags || [],
        is_featured: isFeatured || false,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Product created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Product Error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: error.message || 'Failed to create product',
        statusCode: 500,
      },
    }, { status: 500 });
  }
}

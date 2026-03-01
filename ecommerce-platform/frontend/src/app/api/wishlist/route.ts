import { NextRequest, NextResponse } from 'next/server';

let wishlistItems: any[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: wishlistItems,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId } = body;

  const existingIndex = wishlistItems.findIndex(item => item.productId === productId);
  
  if (existingIndex === -1) {
    wishlistItems.push({
      id: Date.now().toString(),
      productId,
      addedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    success: true,
    data: wishlistItems,
    message: 'Added to wishlist',
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (productId) {
    wishlistItems = wishlistItems.filter(item => item.productId !== productId);
  }

  return NextResponse.json({
    success: true,
    data: wishlistItems,
    message: 'Removed from wishlist',
  });
}

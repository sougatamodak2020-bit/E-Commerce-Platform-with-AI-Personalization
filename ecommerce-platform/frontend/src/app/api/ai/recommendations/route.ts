import { NextRequest, NextResponse } from 'next/server';

const mockRecommendations = [
  {
    productId: '1',
    score: 0.95,
    reason: 'Based on your recent views',
    algorithm: 'collaborative',
  },
  {
    productId: '2',
    score: 0.89,
    reason: 'Similar to items you liked',
    algorithm: 'content_based',
  },
  {
    productId: '3',
    score: 0.85,
    reason: 'Trending in your area',
    algorithm: 'hybrid',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const type = searchParams.get('type') || 'personalized';

  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    data: mockRecommendations.slice(0, limit),
    meta: {
      type,
      generatedAt: new Date().toISOString(),
      modelVersion: '1.0.0',
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, action, metadata } = body;

  console.log('Tracking interaction:', { productId, action, metadata });

  return NextResponse.json({
    success: true,
    message: 'Interaction tracked successfully',
  });
}

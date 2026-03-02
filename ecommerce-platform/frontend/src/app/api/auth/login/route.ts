import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required',
        statusCode: 400,
      },
    }, { status: 400 });
  }

  if (email === 'demo@example.com' && password === 'password123') {
    const user = {
      id: '1',
      email: 'demo@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = 'mock-jwt-token-' + Date.now();

    return NextResponse.json({
      success: true,
      data: { user, token },
      message: 'Login successful',
    });
  }

  return NextResponse.json({
    success: false,
    error: {
      code: 'AUTH_ERROR',
      message: 'Invalid email or password',
      statusCode: 401,
    },
  }, { status: 401 });
}

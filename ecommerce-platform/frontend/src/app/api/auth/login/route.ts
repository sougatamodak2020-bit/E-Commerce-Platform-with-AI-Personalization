import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: { message: 'Email and password required' } }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Specific error messages
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json({ 
          success: false, 
          error: { message: 'Please confirm your email first. Check your inbox for a confirmation link.' }
        }, { status: 401 });
      }
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json({ 
          success: false, 
          error: { message: 'Invalid email or password. Please try again.' }
        }, { status: 401 });
      }
      return NextResponse.json({ success: false, error: { message: error.message } }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || '',
          avatar_url: data.user.user_metadata?.avatar_url || '',
          role: data.user.user_metadata?.role || 'customer',
        },
        token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

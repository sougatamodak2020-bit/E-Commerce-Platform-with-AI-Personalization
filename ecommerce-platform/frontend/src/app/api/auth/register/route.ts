import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role to auto-confirm users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: { message: 'Email and password required' } }, { status: 400 });
    }

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: full_name || name || '' } }
    });

    if (error) {
      return NextResponse.json({ success: false, error: { message: error.message } }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ success: false, error: { message: 'Registration failed' } }, { status: 400 });
    }

    // Auto-confirm email using admin client (bypasses email confirmation)
    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      data.user.id,
      { email_confirm: true }
    );

    if (confirmError) {
      console.error('Auto-confirm error:', confirmError.message);
    }

    // Sign in immediately after registration to get a session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      // Registration succeeded but auto-login failed - ask user to login manually
      return NextResponse.json({
        success: true,
        data: { user: { id: data.user.id, email }, token: null },
        message: 'Account created! Please login.',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: signInData.user.id,
          email: signInData.user.email,
          full_name: full_name || name || '',
          role: 'customer',
        },
        token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
      },
      message: 'Account created successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

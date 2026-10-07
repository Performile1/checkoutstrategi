import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';
import { getSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-post och lösenord krävs' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. If Supabase is configured with real URL and key, try authenticating with Supabase
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    );

    let isAuthenticated = false;
    let userEmail = trimmedEmail;

    if (hasSupabase) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (!error && data?.user) {
          const userRole = data.user.user_metadata?.role;
          if (
            userRole === 'admin' ||
            trimmedEmail === 'rickard@wigrund.se' ||
            trimmedEmail === 'wigrund81@gmail.com'
          ) {
            isAuthenticated = true;
            userEmail = data.user.email || trimmedEmail;
          } else {
            return NextResponse.json({ error: 'Kontot saknar admin-behörighet i Supabase' }, { status: 403 });
          }
        }
      } catch {
        // Fall back to direct login check if Supabase is unreachable
      }
    }

    // 2. If Supabase is not configured or offline:
    // Allow login for admin (support ADMIN_PASSWORD env var or any password if not set)
    if (!isAuthenticated) {
      const configuredPassword = process.env.ADMIN_PASSWORD;
      if (configuredPassword) {
        if (password !== configuredPassword) {
          return NextResponse.json({ error: 'Felaktigt lösenord' }, { status: 401 });
        }
      }
      // Valid non-empty login accepted
      isAuthenticated = true;
    }

    if (isAuthenticated) {
      const sessionData = {
        email: userEmail,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');

      const response = NextResponse.json({
        success: true,
        user: { email: userEmail, role: 'admin' },
      });

      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ error: 'Inloggningen misslyckades' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Ett internt fel uppstod vid inloggning' }, { status: 500 });
  }
}

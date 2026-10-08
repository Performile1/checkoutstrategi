import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createAdminToken } from '@/lib/auth';
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

        if (error) {
          return NextResponse.json(
            { error: 'Felaktig e-postadress eller lösenord.' },
            { status: 401 }
          );
        }

        if (data?.user) {
          const userRole = data.user.user_metadata?.role || data.user.app_metadata?.role;
          // Grant access if user authenticated successfully via Supabase
          isAuthenticated = true;
          userEmail = data.user.email || trimmedEmail;
        }
      } catch (err: any) {
        // Fall back only if Supabase call threw a network/infrastructure exception
      }
    }

    // 2. If Supabase is not configured in this environment (e.g. local dev sandbox):
    if (!isAuthenticated && !hasSupabase) {
      const configuredPassword = process.env.ADMIN_PASSWORD;
      if (configuredPassword) {
        if (password !== configuredPassword) {
          return NextResponse.json({ error: 'Felaktigt lösenord' }, { status: 401 });
        }
      }
      isAuthenticated = true;
    }

    if (isAuthenticated) {
      const token = createAdminToken(userEmail);

      const response = NextResponse.json({
        success: true,
        token,
        user: { email: userEmail, role: 'admin' },
      });

      const isHttps = request.url.startsWith('https://') || process.env.NODE_ENV === 'production';
      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        secure: isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    return NextResponse.json({ error: 'Inloggningen misslyckades' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Ett internt fel uppstod vid inloggning' }, { status: 500 });
  }
}

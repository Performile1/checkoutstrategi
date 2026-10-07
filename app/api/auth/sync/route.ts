import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createAdminToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const cleanEmail = email ? String(email).trim().toLowerCase() : 'admin@checkoutstrategi.se';
    const token = createAdminToken(cleanEmail);

    const response = NextResponse.json({
      success: true,
      token,
      user: { email: cleanEmail, role: 'admin' },
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
  } catch {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

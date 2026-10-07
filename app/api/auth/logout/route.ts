import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  const response = NextResponse.redirect(new URL('/admin/login', request.url), { status: 303 });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}

import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { deleteStoredReview } from '@/lib/reviews-store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deleteStoredReview(params.id);

  // If request came from an HTML form submit, redirect back
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/html')) {
    return NextResponse.redirect(new URL('/admin/reviews', request.url), { status: 303 });
  }

  return NextResponse.json({ success: true });
}

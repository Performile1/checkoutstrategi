import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { getStoredPlayer, saveStoredPlayer, deleteStoredPlayer } from '@/lib/players-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const player = await getStoredPlayer(params.id);
  if (!player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  return NextResponse.json(player);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveStoredPlayer({ ...body, id: params.id });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Kunde inte uppdatera aktören' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deleteStoredPlayer(params.id);
  return NextResponse.json({ success: true });
}

// Support browser form deletion via POST method with _method="DELETE"
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return DELETE(request, { params }).then((res) => {
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      return NextResponse.redirect(new URL('/admin/players', request.url), { status: 303 });
    }
    return res;
  });
}

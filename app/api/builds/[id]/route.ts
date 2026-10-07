import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { getStoredBuild, saveStoredBuild, deleteStoredBuild } from '@/lib/builds-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const build = await getStoredBuild(params.id);
  if (!build) {
    return NextResponse.json({ error: 'Bygget hittades inte' }, { status: 404 });
  }

  return NextResponse.json(build);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveStoredBuild({ ...body, id: params.id });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Kunde inte uppdatera' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deleteStoredBuild(params.id);
  return NextResponse.json({ success: true });
}

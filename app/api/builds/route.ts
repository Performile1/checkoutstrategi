import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { getStoredBuilds, saveStoredBuild } from '@/lib/builds-store';

export async function GET(request: NextRequest) {
  const user = await getAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const builds = await getStoredBuilds();
  return NextResponse.json(builds);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json({ error: 'E-postadress krävs' }, { status: 400 });
    }

    const saved = await saveStoredBuild(body);
    return NextResponse.json({
      success: true,
      build: saved,
      message: 'Bygget har sparats och registrerats i databasen!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Kunde inte spara bygget' },
      { status: 500 }
    );
  }
}

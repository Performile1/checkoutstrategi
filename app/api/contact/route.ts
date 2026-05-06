import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Lead-magnet endpoint. Uses Resend if RESEND_API_KEY is set, otherwise
 * logs the lead to stdout (safe fallback for dev).
 *
 * Tip: for production, set FORMSPREE_ENDPOINT in env to skip this and
 * have the form POST directly to Formspree.
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let data: Record<string, string> = {};

  if (contentType.includes('application/json')) {
    data = await req.json();
  } else {
    const form = await req.formData();
    form.forEach((v, k) => (data[k] = String(v)));
  }

  const to = process.env.CONTACT_TO_EMAIL || 'hej@checkoutstrategi.se';
  const key = process.env.RESEND_API_KEY;

  if (key) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Checkoutstrategi <noreply@checkoutstrategi.se>',
          to: [to],
          subject: `Ny förfrågan: ${data.intent || 'kontakt'}`,
          text: Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n'),
        }),
      });
    } catch (e) {
      console.error('resend failed', e);
    }
  } else {
    console.log('[contact] lead received', data);
  }

  return NextResponse.redirect(new URL('/contact?sent=1', req.url), { status: 303 });
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getAdminUser } from '@/lib/auth';
import { slugify } from '@/lib/slugify';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getAdminUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Obehörig. Vänligen logga in som administratör.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general'; // 'logo' | 'cover' | 'general'

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Ingen fil bifogades.' }, { status: 400 });
    }

    // Validate mime type
    const mimeType = file.type || '';
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!allowedMimes.includes(mimeType) && !file.name.match(/\.(png|jpe?g|webp|svg|gif)$/i)) {
      return NextResponse.json(
        { error: 'Ogiltigt filformat. Endast PNG, JPG, WEBP, SVG och GIF tillåts.' },
        { status: 400 }
      );
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Filen är för stor (max 10MB).' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const origName = file.name || 'image';
    const ext = path.extname(origName) || (mimeType === 'image/svg+xml' ? '.svg' : '.png');
    const baseName = path.basename(origName, ext);
    const cleanBase = slugify(baseName) || 'asset';
    const uniqueFileName = `${type}-${cleanBase}-${Date.now()}${ext.toLowerCase()}`;

    // 1. Try uploading to Supabase Storage if configured (for permanent Vercel CDN hosting)
    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    );

    if (hasSupabase) {
      try {
        const supabase = getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY);
        const bucketName = 'public-assets';
        
        // Attempt upload to public-assets bucket
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(bucketName)
          .upload(`uploads/${uniqueFileName}`, buffer, {
            contentType: mimeType || 'image/png',
            upsert: true,
          });

        if (!uploadErr && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(`uploads/${uniqueFileName}`);

          if (publicUrlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicUrlData.publicUrl,
              filename: uniqueFileName,
              storage: 'supabase',
            });
          }
        }
      } catch {
        // Fallback to local filesystem / server storage
      }
    }

    // 2. Save locally into public folder
    let targetDir = path.join(process.cwd(), 'public', 'uploads');
    let publicUrl = `/uploads/${uniqueFileName}`;

    if (type === 'logo') {
      targetDir = path.join(process.cwd(), 'public', 'logos');
      publicUrl = `/logos/${uniqueFileName}`;
    } else if (type === 'cover') {
      targetDir = path.join(process.cwd(), 'public', 'uploads', 'covers');
      publicUrl = `/uploads/covers/${uniqueFileName}`;
    }

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);
    } catch {
      // If filesystem is completely read-only on serverless and Supabase storage was unavailable:
      // encode as base64 Data URL so the image still renders and saves perfectly
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mimeType || 'image/png'};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        filename: uniqueFileName,
        storage: 'embedded',
      });
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFileName,
      storage: 'local',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Ett fel uppstod vid uppladdning av bild.' },
      { status: 500 }
    );
  }
}

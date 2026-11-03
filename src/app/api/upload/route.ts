import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSiteConfig } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const config = await getSiteConfig();
    const adminPass = req.headers.get('x-admin-pass');

    // Auth check
    const currentPass = config.adminPassword || process.env.ADMIN_PASSWORD || 'admin';
    if (adminPass !== currentPass) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate image mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only images (JPG, PNG, WEBP, GIF, SVG) are allowed.' },
        { status: 400 }
      );
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 10MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const rawExt = path.extname(file.name) || `.${file.type.split('/')[1] || 'jpg'}`;
      const ext = rawExt.startsWith('.') ? rawExt : `.${rawExt}`;
      const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
      const filename = `${Date.now()}_${cleanBase || 'image'}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
        size: file.size
      });
    } catch (fsErr) {
      console.warn('File system write failed, falling back to base64 Data URL (e.g. Vercel serverless):', fsErr);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        size: file.size
      });
    }
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

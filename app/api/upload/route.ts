import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `images/${Date.now()}-${safeName}`;

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,     // ← Key fix: unique URL every upload
      allowOverwrite: true,      // ← Extra safety
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
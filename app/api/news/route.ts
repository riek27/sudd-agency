import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { newsDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-news');
    const data = saved ? { ...newsDefaults, ...saved } : newsDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(newsDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-news', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
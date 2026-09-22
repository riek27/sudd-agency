import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { aboutDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-about');
    const data = saved ? { ...aboutDefaults, ...saved } : aboutDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(aboutDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-about', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { partnersDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-partners');
    const data = saved ? { ...partnersDefaults, ...saved } : partnersDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(partnersDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-partners', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
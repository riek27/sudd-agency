import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { impactDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-impact');
    const data = saved ? { ...impactDefaults, ...saved } : impactDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(impactDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-impact', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
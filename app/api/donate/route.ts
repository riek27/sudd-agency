import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { donateDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-donate');
    const data = saved ? { ...donateDefaults, ...saved } : donateDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(donateDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-donate', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
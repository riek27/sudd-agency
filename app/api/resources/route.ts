import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { resourcesDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-resources');
    const data = saved ? { ...resourcesDefaults, ...saved } : resourcesDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(resourcesDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-resources', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
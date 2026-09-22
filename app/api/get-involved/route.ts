import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { getInvolvedDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-get-involved');
    const data = saved
      ? { ...getInvolvedDefaults, ...saved }
      : getInvolvedDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(getInvolvedDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-get-involved', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
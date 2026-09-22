import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { projectsDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('sudd-projects');
    const data = saved ? { ...projectsDefaults, ...saved } : projectsDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(projectsDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('sudd-projects', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
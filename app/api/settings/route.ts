import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { settingsDefaults } from '@/lib/defaults';

// Ensure Resources is always in the navLinks list,
// even if the DB has an older version saved.
function ensureNavLinks(links: any[]): any[] {
  const list = Array.isArray(links) && links.length > 0 ? [...links] : [];
  const hasResources = list.some((l: any) => l.href === '/resources');

  if (!hasResources) {
    const partnersIdx = list.findIndex((l: any) => l.href === '/partners');
    const resourceLink = { label: 'Resources', href: '/resources' };
    if (partnersIdx >= 0) {
      list.splice(partnersIdx, 0, resourceLink);
    } else {
      list.push(resourceLink);
    }
  }
  return list;
}

export async function GET() {
  try {
    const saved = await getPage('sudd-settings');
    const data = saved ? { ...settingsDefaults, ...saved } : settingsDefaults;

    // Never return the password hash
    if (data.account) {
      data.account = { username: data.account.username, passwordHash: '' };
    }

    // Force Resources into navLinks
    if (data.header) {
      data.header = {
        ...settingsDefaults.header,
        ...data.header,
        navLinks: ensureNavLinks(data.header.navLinks),
      };
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(settingsDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = (await getPage('sudd-settings')) || {};

    const incoming = { ...body };

    if (incoming.account) {
      incoming.account = {
        username:
          incoming.account.username ||
          existing?.account?.username ||
          'suddagency',
        passwordHash: incoming.account.passwordHash
          ? incoming.account.passwordHash
          : existing?.account?.passwordHash || '',
      };
    }

    // Also enforce navLinks on save
    if (incoming.header) {
      incoming.header = {
        ...incoming.header,
        navLinks: ensureNavLinks(incoming.header.navLinks),
      };
    }

    await savePage('sudd-settings', incoming);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { settingsDefaults } from '@/lib/defaults';
import crypto from 'crypto';

const FALLBACK_PASSWORD = 'Suddenvironment2020';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(candidate: string, stored: any): boolean {
  const hashed = hashPassword(candidate);
  if (stored?.account?.passwordHash) {
    return hashed === stored.account.passwordHash;
  }
  return hashed === hashPassword(FALLBACK_PASSWORD);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newUsername, newPassword, confirmPassword } = body;

    const existing = (await getPage('sudd-settings')) || {};

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is required.' },
        { status: 400 }
      );
    }

    if (!verifyPassword(currentPassword, existing)) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 401 }
      );
    }

    if (newPassword && newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'New password must be at least 6 characters.',
        },
        { status: 400 }
      );
    }

    if (newPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New passwords do not match.' },
        { status: 400 }
      );
    }

    const updatedAccount: any = {
      username:
        (newUsername && newUsername.trim()) ||
        existing?.account?.username ||
        'suddagency',
      passwordHash: existing?.account?.passwordHash || '',
    };

    if (newPassword) {
      updatedAccount.passwordHash = hashPassword(newPassword);
    }

    const merged = {
      ...settingsDefaults,
      ...existing,
      account: updatedAccount,
    };
    await savePage('sudd-settings', merged);

    return NextResponse.json({
      success: true,
      username: updatedAccount.username,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update credentials.' },
      { status: 500 }
    );
  }
}
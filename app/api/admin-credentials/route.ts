import { NextResponse } from 'next/server';
import { getPage } from '@/lib/db';
import crypto from 'crypto';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
  getClientIp,
} from '@/lib/rateLimit';

const FALLBACK_USERNAME = 'suddagency';
const FALLBACK_PASSWORD = 'Suddenvironment2020';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateKey = `login:${ip}`;

    // Rate limit check
    const status = checkRateLimit(rateKey);
    if (!status.allowed) {
      const minutes = Math.floor(status.retryAfterSeconds / 60);
      const seconds = status.retryAfterSeconds % 60;
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          retryAfterSeconds: status.retryAfterSeconds,
          error: `Too many failed attempts. Please try again in ${timeStr}.`,
        },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const settings = (await getPage('sudd-settings')) || {};
    const storedUsername = settings?.account?.username || FALLBACK_USERNAME;
    const storedHash = settings?.account?.passwordHash || '';
    const fallbackHash = hashPassword(FALLBACK_PASSWORD);
    const expectedHash = storedHash || fallbackHash;
    const candidateHash = hashPassword(password);

    if (username === storedUsername && candidateHash === expectedHash) {
      clearAttempts(rateKey);
      return NextResponse.json({ success: true });
    }

    const after = recordFailedAttempt(rateKey);
    if (!after.allowed) {
      const minutes = Math.floor(after.retryAfterSeconds / 60);
      const seconds = after.retryAfterSeconds % 60;
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          retryAfterSeconds: after.retryAfterSeconds,
          error: `Too many failed attempts. You are blocked for ${timeStr}.`,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        remainingAttempts: after.remainingAttempts,
        error: `Invalid username or password. ${after.remainingAttempts} attempt${
          after.remainingAttempts === 1 ? '' : 's'
        } remaining.`,
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication error.' },
      { status: 500 }
    );
  }
}
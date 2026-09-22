type AttemptRecord = {
  count: number;
  firstAttempt: number;
  blockedUntil: number;
};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

const store: Map<string, AttemptRecord> =
  (globalThis as any).__seaRateLimitStore || new Map();
(globalThis as any).__seaRateLimitStore = store;

export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  const cf = headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  return 'unknown';
}

export type RateLimitResult = {
  allowed: boolean;
  remainingAttempts: number;
  blockedUntil: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const rec = store.get(key);

  if (!rec) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      blockedUntil: 0,
      retryAfterSeconds: 0,
    };
  }

  if (rec.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: rec.blockedUntil,
      retryAfterSeconds: Math.ceil((rec.blockedUntil - now) / 1000),
    };
  }

  if (rec.blockedUntil > 0 && rec.blockedUntil <= now) {
    store.delete(key);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      blockedUntil: 0,
      retryAfterSeconds: 0,
    };
  }

  if (now - rec.firstAttempt > WINDOW_MS) {
    store.delete(key);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      blockedUntil: 0,
      retryAfterSeconds: 0,
    };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - rec.count),
    blockedUntil: 0,
    retryAfterSeconds: 0,
  };
}

export function recordFailedAttempt(key: string): RateLimitResult {
  const now = Date.now();
  const rec = store.get(key);

  if (rec && rec.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: rec.blockedUntil,
      retryAfterSeconds: Math.ceil((rec.blockedUntil - now) / 1000),
    };
  }

  let current: AttemptRecord;
  if (!rec || now - rec.firstAttempt > WINDOW_MS) {
    current = { count: 1, firstAttempt: now, blockedUntil: 0 };
  } else {
    current = { ...rec, count: rec.count + 1 };
  }

  if (current.count >= MAX_ATTEMPTS) {
    current.blockedUntil = now + BLOCK_MS;
    store.set(key, current);
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: current.blockedUntil,
      retryAfterSeconds: Math.ceil(BLOCK_MS / 1000),
    };
  }

  store.set(key, current);
  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - current.count,
    blockedUntil: 0,
    retryAfterSeconds: 0,
  };
}

export function clearAttempts(key: string): void {
  store.delete(key);
}
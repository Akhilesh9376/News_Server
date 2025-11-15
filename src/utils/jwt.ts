import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from "ms";
export function getJwtSecret(): string {
  const raw = (process.env.JWT_SECRET || 'your_jwt_secret').trim();
  if (!raw) {
    throw new Error('JWT_SECRET is missing or empty');
  }
  return raw;
}

// Basic validator for expiresIn; falls back to '1h' if invalid
export function getJwtExpiresIn(): number | StringValue {
  const raw = (process.env.JWT_EXPIRES_IN || '3600').trim();
  // numeric seconds
  if (/^\d+$/.test(raw)) {
    return parseInt(raw, 10);
  }
  // ms-style string values: 60s, 30m, 1h, 2d, or with space like '60 s'
  if (/^\d+\s*[smhd]$/.test(raw) || /^(\d+)\s*(seconds?|minutes?|hours?|days?)$/.test(raw)) {
    return raw as unknown as StringValue;
  }
  // fallback to 1 hour
  return 3600;
}

export function signToken(payload: object, options: SignOptions = {}): string {
  const secret = getJwtSecret();
  const expiresIn = getJwtExpiresIn();
  return jwt.sign(payload as any, secret, { expiresIn, ...options });
}
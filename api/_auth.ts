import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';

export function verifyJwt(authHeader: string | undefined): { email: string } | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(authHeader.slice(7), JWT_SECRET) as { email?: string };
    return payload.email ? { email: payload.email } : null;
  } catch {
    return null;
  }
}
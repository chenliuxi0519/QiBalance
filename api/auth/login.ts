import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'chenliuxi0519@gmail.com';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: 'Not configured' });

  const a = Buffer.from(password, 'utf8');
  const b = Buffer.from(ADMIN_PASSWORD, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, email: ADMIN_EMAIL });
}
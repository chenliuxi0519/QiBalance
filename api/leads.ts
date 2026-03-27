import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'chenliuxi0519@gmail.com';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';

let pool: mysql.Pool | null = null;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 10000,
    });
  }
  return pool;
}

function verifyJwt(authHeader: string | undefined) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const payload = jwt.verify(authHeader.slice(7), JWT_SECRET) as { email?: string };
    return payload.email ? { email: payload.email } : null;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    if (!email || email.length > 500) return res.status(400).json({ error: 'Invalid email' });
    try {
      await getPool().execute('INSERT INTO leads (email) VALUES (?)', [email]);
      return res.status(201).json({ ok: true });
    } catch (e) {
      console.error('[leads POST error]', e);
      return res.status(500).json({ error: 'Could not save', detail: String(e) });
    }
  }

  if (req.method === 'GET') {
    const auth = verifyJwt(req.headers.authorization);
    if (!auth || auth.email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const [rows] = await getPool().execute(
        'SELECT id, email, created_at AS createdAt FROM leads ORDER BY created_at DESC LIMIT 2000'
      );
      const leads = (rows as any[]).map((r) => ({
        id: String(r.id),
        email: r.email,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      }));
      return res.json(leads);
    } catch (e) {
      console.error('[leads GET error]', e);
      return res.status(500).json({ error: 'Could not load', detail: String(e) });
    }
  }

  return res.status(405).end();
}
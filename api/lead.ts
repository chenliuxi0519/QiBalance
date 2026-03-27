import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertLead, listLeads } from './_db';
import { verifyJwt } from './_auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'chenliuxi0519@gmail.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // POST /api/leads — 保存邮箱
  if (req.method === 'POST') {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    if (!email || email.length > 500) return res.status(400).json({ error: 'Invalid email' });
    try {
      await insertLead(email);
      return res.status(201).json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Could not save' });
    }
  }

  // GET /api/leads — 管理员查看
  if (req.method === 'GET') {
    const auth = verifyJwt(req.headers.authorization);
    if (!auth || auth.email !== ADMIN_EMAIL) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const leads = await listLeads();
      return res.json(leads);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Could not load' });
    }
  }

  return res.status(405).end();
}
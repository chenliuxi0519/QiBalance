import 'dotenv/config';
import crypto from 'crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';

const PORT = Number(process.env.SERVER_PORT || 3002);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-set-JWT_SECRET-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'chenliuxi0519@gmail.com';

type LeadRow = { id: string; email: string; createdAt: string };

type DbAdapter = {
  ensureSchema: () => Promise<void>;
  insertLead: (email: string) => Promise<void>;
  listLeads: () => Promise<LeadRow[]>;
  /** Optional: release MySQL pool when switching to SQLite */
  close?: () => Promise<void>;
};

function forceSqlite(): boolean {
  return process.env.USE_SQLITE === 'true' || process.env.USE_SQLITE === '1';
}

function hasMysqlConfig(): boolean {
  return Boolean(process.env.MYSQL_HOST?.trim());
}

function defaultSqlitePath(): string {
  if (process.env.SQLITE_PATH?.trim()) return process.env.SQLITE_PATH.trim();
  // Vercel serverless: only /tmp is writable; data is ephemeral unless you use MySQL / external DB.
  if (process.env.VERCEL) return '/tmp/leads.db';
  return path.join(process.cwd(), 'data', 'leads.db');
}

function createSqliteAdapter(): DbAdapter {
  const file = defaultSqlitePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);

  return {
    async ensureSchema() {
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
    },
    async insertLead(email: string) {
      sqlite.prepare('INSERT INTO leads (email) VALUES (?)').run(email);
    },
    async listLeads() {
      const rows = sqlite
        .prepare(
          'SELECT id, email, created_at AS createdAt FROM leads ORDER BY datetime(created_at) DESC LIMIT 2000'
        )
        .all() as { id: number; email: string; createdAt: string }[];
      return rows.map((r) => ({
        id: String(r.id),
        email: r.email,
        createdAt: normalizeSqliteTimestamp(r.createdAt),
      }));
    },
  };
}

function normalizeSqliteTimestamp(s: string): string {
  if (s.includes('T')) return new Date(s).toISOString();
  const isoLike = s.replace(' ', 'T');
  const d = new Date(isoLike.endsWith('Z') ? isoLike : `${isoLike}Z`);
  return Number.isNaN(d.getTime()) ? s : d.toISOString();
}

function createMysqlAdapter(): DbAdapter {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    ssl: process.env.MYSQL_SSL === 'true' ? {} : undefined,
    connectTimeout: Number(process.env.MYSQL_CONNECT_TIMEOUT_MS || 8000),
  });

  return {
    async ensureSchema() {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS leads (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(512) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    },
    async insertLead(email: string) {
      await pool.execute('INSERT INTO leads (email) VALUES (?)', [email]);
    },
    async listLeads() {
      const [rows] = await pool.execute(
        'SELECT id, email, created_at AS createdAt FROM leads ORDER BY created_at DESC LIMIT 2000'
      );
      return (rows as { id: number; email: string; createdAt: Date | string }[]).map((r) => ({
        id: String(r.id),
        email: r.email,
        createdAt:
          r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      }));
    },
    async close() {
      await pool.end();
    },
  };
}

function verifyJwt(authHeader: string | undefined): { email: string } | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email?: string };
    if (!payload.email) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN;
if (CORS_ORIGIN) {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });
}
app.use(express.json({ limit: '32kb' }));

let db: DbAdapter;

app.post('/api/auth/login', (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!ADMIN_PASSWORD) {
    res.status(503).json({ error: 'Admin login not configured' });
    return;
  }
  const a = Buffer.from(password, 'utf8');
  const b = Buffer.from(ADMIN_PASSWORD, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  const token = jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email: ADMIN_EMAIL });
});

app.post('/api/leads', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  if (!email || email.length > 500) {
    res.status(400).json({ error: 'Invalid contact info' });
    return;
  }
  try {
    await db.insertLead(email);
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not save' });
  }
});

app.get('/api/leads', async (req, res) => {
  const auth = verifyJwt(req.headers.authorization);
  if (!auth || auth.email !== ADMIN_EMAIL) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const leads = await db.listLeads();
    res.json(leads);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not load leads' });
  }
});

async function bootstrap() {
  if (forceSqlite() || !hasMysqlConfig()) {
    db = createSqliteAdapter();
    await db.ensureSchema();
    console.log('[db] SQLite →', defaultSqlitePath());
    return;
  }

  const mysqlDb = createMysqlAdapter();
  try {
    await mysqlDb.ensureSchema();
    db = mysqlDb;
    console.log('[db] MySQL (RDS) connected.');
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    await mysqlDb.close?.();
    console.warn(
      '[db] MySQL failed (%s). Falling back to SQLite. RDS is often unreachable from local PC (VPC-only, wrong whitelist, or need public endpoint + SSL).',
      err.code || err.message
    );
    db = createSqliteAdapter();
    await db.ensureSchema();
    console.log('[db] SQLite →', defaultSqlitePath());
  }
}

try {
  await bootstrap();
} catch (e) {
  console.error('Failed to start:', e);
  process.exit(1);
}

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

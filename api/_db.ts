import mysql from 'mysql2/promise';

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
      ssl: process.env.MYSQL_SSL === 'true' ? {} : undefined,
    });
  }
  return pool;
}

export async function ensureSchema() {
  await getPool().execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(512) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export async function insertLead(email: string) {
  await getPool().execute('INSERT INTO leads (email) VALUES (?)', [email]);
}

export async function listLeads() {
  const [rows] = await getPool().execute(
    'SELECT id, email, created_at AS createdAt FROM leads ORDER BY created_at DESC LIMIT 2000'
  );
  return (rows as any[]).map((r) => ({
    id: String(r.id),
    email: r.email,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  }));
}
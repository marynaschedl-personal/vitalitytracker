import { Pool } from '@neondatabase/serverless';

let pool = null;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('POSTGRES_URL or DATABASE_URL environment variable not set');
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

export async function query(text, params = []) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function sql(strings, ...values) {
  const text = strings.join('?');
  const result = await query(text, values);
  return result;
}


import { Pool } from 'pg';

// Utiliza a variável de ambiente DATABASE_URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Necessário para conexão segura com Neon/Vercel Postgres
  }
});

export default pool;


import { Pool } from 'pg';

// Utiliza a variável de ambiente DATABASE_URL ou a string de conexão fornecida diretamente
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_wLWz3katJn2P@ep-falling-night-ahvabkur-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Necessário para conexão segura com Neon/Vercel Postgres
  }
});

export default pool;


import { Pool } from 'pg';

// Utiliza a variável de ambiente DATABASE_URL configurada na Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para algumas configurações do Neon/Vercel
  }
});

export default pool;

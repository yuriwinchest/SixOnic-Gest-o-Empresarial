import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Configuração para conexão DIRETA com MySQL na VPS (sem túnel SSH)
const pool = mysql.createPool({
    // CONEXÃO DIRETA - Use o IP/domínio público da VPS
    host: process.env.DB_HOST || '161.97.124.179', // IP da VPS
    port: process.env.DB_PORT || 3306, // Porta MySQL (padrão 3306)
    user: process.env.DB_USER || 'ver8wdgr_root-14',
    password: process.env.DB_PASSWORD || 'Hugo2025/*-+',
    database: process.env.DB_NAME || 'ver8wdgr_root-14',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true,
    connectTimeout: 10000 // 10 segundos timeout
});

// Log da configuração (sem mostrar senha)
console.log('🔧 Configuração MySQL:');
console.log(`   Host: ${process.env.DB_HOST || '161.97.124.179'}`);
console.log(`   Port: ${process.env.DB_PORT || 3306}`);
console.log(`   User: ${process.env.DB_USER || 'ver8wdgr_root-14'}`);
console.log(`   Database: ${process.env.DB_NAME || 'ver8wdgr_root-14'}`);
console.log('');

export default pool;

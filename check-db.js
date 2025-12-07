import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Copia das configs do db.js para teste isolado
const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'ver8wdgr_root-14',
    password: process.env.DB_PASSWORD || 'Hugo2025/*-+',
    database: process.env.DB_NAME || 'ver8wdgr_root-14',
};

console.log('--- TESTE DE CONEXÃO COM BANCO DE DADOS ---');
console.log('Tentando conectar em:', config.host);
console.log('Usuário:', config.user);
console.log('Banco:', config.database);
console.log('-------------------------------------------');

async function test() {
    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ SUCESSO! Conexão estabelecida.');
        await connection.end();
    } catch (error) {
        console.error('❌ FALHA NA CONEXÃO:');
        console.error(error.message);
        console.log('\nDICA: Se o erro for ECONNREFUSED em 127.0.0.1, significa que não há banco rodando neste computador.');
        console.log('Se o banco é numa VPS, você DEVE trocar "127.0.0.1" pelo IP da VPS no arquivo server/db.js');
    }
}

test();

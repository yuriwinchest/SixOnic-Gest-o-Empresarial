import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Força localhost para usar o túnel
const config = {
    host: '127.0.0.1',
    user: process.env.DB_USER || 'ver8wdgr_root-14',
    password: process.env.DB_PASSWORD || 'Hugo2025/*-+',
    database: process.env.DB_NAME || 'ver8wdgr_root-14',
    multipleStatements: true, // Permite rodar o arquivo SQL inteiro de uma vez
    connectTimeout: 5000 // 5 segundos para desistir se o túnel não estiver aberto
};

console.log('🚀 Iniciando script de deploy do banco de dados...');
console.log(`Conectando em ${config.host} via Túnel SSH... (User: ${config.user})`);

async function run() {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Conectado ao banco de dados com sucesso!');

        const sql = fs.readFileSync('./tabelas_sistema.sql', 'utf8');
        console.log('📜 Lendo arquivo tabelas_sistema.sql...');

        console.log('▶️ Executando criação de tabelas...');
        await connection.query(sql);

        console.log('🎉 SUCESSO! Todas as tabelas foram criadas/atualizadas na VPS.');
    } catch (error) {
        console.error('\n❌ ERRO FATAL:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Não foi possível conectar no 127.0.0.1:3306.');
            console.error('⚠️  O TÚNEL SSH NÃO ESTÁ ABERTO!');
            console.error('Por favor, execute o arquivo "abrir-conexao-vps.bat" e deixe a janela aberta.');
        } else {
            console.error(error.message);
        }
    } finally {
        if (connection) await connection.end();
    }
}

run();

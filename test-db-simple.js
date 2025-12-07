import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.DB_HOST || '161.97.124.179',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'ver8wdgr_root-14',
    password: process.env.DB_PASSWORD || 'Hugo2025/*-+',
    database: process.env.DB_NAME || 'ver8wdgr_root-14',
    connectTimeout: 10000
};

console.log('Testando conexão MySQL...');
console.log('Host:', config.host);
console.log('Port:', config.port);
console.log('User:', config.user);
console.log('Database:', config.database);
console.log('');

try {
    const connection = await mysql.createConnection(config);
    console.log('✅ CONECTADO COM SUCESSO!');

    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Query teste OK:', rows[0].result);

    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Tabelas encontradas: ${tables.length}`);

    await connection.end();
    console.log('');
    console.log('🎉 TUDO FUNCIONANDO!');
    console.log('Agora execute: npm run dev');

} catch (error) {
    console.log('');
    console.log('❌ ERRO:', error.code);
    console.log('Mensagem:', error.message);
    console.log('');

    if (error.code === 'ECONNREFUSED') {
        console.log('💡 MySQL não está acessível no IP:', config.host);
        console.log('   Verifique se o MySQL permite conexões remotas');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('💡 Usuário ou senha incorretos');
    } else if (error.code === 'ETIMEDOUT') {
        console.log('💡 Timeout - firewall pode estar bloqueando');
    }

    process.exit(1);
}

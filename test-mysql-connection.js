import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Usar as mesmas configurações do server/db.js
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'ver8wdgr_root-14',
    password: process.env.DB_PASSWORD || 'Hugo2025/*-+',
    database: process.env.DB_NAME || 'ver8wdgr_root-14',
};

console.log('🔧 TESTE DE CONEXÃO MYSQL (phpMyAdmin)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 Configuração:');
console.log(`   Host: ${dbConfig.host}`);
console.log(`   Port: ${dbConfig.port}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Password: ${'*'.repeat(dbConfig.password.length)}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

async function testConnection() {
    let connection;

    try {
        console.log('📡 Tentando conectar...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ CONEXÃO ESTABELECIDA COM SUCESSO!');
        console.log('');

        // Teste 1: Query simples
        console.log('🔍 Teste 1: Query simples');
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('   Resultado:', rows[0].result);
        console.log('   ✅ Passou!');
        console.log('');

        // Teste 2: Listar tabelas
        console.log('🔍 Teste 2: Listar tabelas existentes');
        const [tables] = await connection.query('SHOW TABLES');
        if (tables.length === 0) {
            console.log('   ⚠️  Nenhuma tabela encontrada');
            console.log('   💡 Você precisa criar as tabelas primeiro');
            console.log('   💡 Acesse: http://localhost:3001/api/setup');
        } else {
            console.log(`   ✅ ${tables.length} tabela(s) encontrada(s):`);
            tables.forEach((table, i) => {
                console.log(`      ${i + 1}. ${Object.values(table)[0]}`);
            });
        }
        console.log('');

        // Teste 3: Contar clientes
        console.log('🔍 Teste 3: Verificar tabela clients');
        try {
            const [clients] = await connection.query('SELECT COUNT(*) as total FROM clients');
            console.log(`   ✅ Tabela 'clients' existe`);
            console.log(`   📊 Total de clientes: ${clients[0].total}`);
        } catch (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                console.log('   ⚠️  Tabela "clients" não existe');
                console.log('   💡 Execute: http://localhost:3001/api/setup');
            } else {
                throw err;
            }
        }
        console.log('');

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ TODOS OS TESTES PASSARAM!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('📝 Próximos passos:');
        console.log('   1. Se não há tabelas, acesse: http://localhost:3001/api/setup');
        console.log('   2. Inicie o sistema: npm run dev');
        console.log('   3. Teste criar um cliente no sistema');
        console.log('');

    } catch (error) {
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('❌ ERRO NA CONEXÃO');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('Código:', error.code);
        console.log('Mensagem:', error.message);
        console.log('');

        if (error.code === 'ECONNREFUSED') {
            console.log('💡 SOLUÇÃO:');
            console.log('   O túnel SSH não está funcionando!');
            console.log('');
            console.log('   Opção 1 - Abrir novo túnel:');
            console.log('   Execute em um NOVO terminal PowerShell:');
            console.log('   ');
            console.log('   ssh -L 3306:127.0.0.1:3306 deploy@161.97.124.179 -N');
            console.log('   ');
            console.log('   Ou se tiver chave SSH:');
            console.log('   ssh -i C:\\Users\\yuriv\\.ssh\\deploy_auto_key -L 3306:127.0.0.1:3306 HugoGabriel@161.97.124.179 -N');
            console.log('');
            console.log('   Opção 2 - Usar porta diferente (3307):');
            console.log('   ssh -L 3307:127.0.0.1:3306 deploy@161.97.124.179 -N');
            console.log('   E ajuste DB_PORT=3307 no arquivo .env');
            console.log('');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 SOLUÇÃO:');
            console.log('   Credenciais incorretas!');
            console.log('   Verifique usuário e senha no arquivo .env');
            console.log('');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 SOLUÇÃO:');
            console.log('   Banco de dados não existe!');
            console.log('   Verifique o nome do banco no arquivo .env');
            console.log('');
        }

        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexão fechada.');
        }
    }
}

testConnection();

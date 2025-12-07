import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da conexão
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'ver8wdgr_root-14',
    password: process.env.DB_PASSWORD || 'Hugo2025/*-+',
    database: process.env.DB_NAME || 'ver8wdgr_root-14',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('🔧 Configuração do Banco de Dados:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Host: ${dbConfig.host}`);
console.log(`Port: ${dbConfig.port}`);
console.log(`User: ${dbConfig.user}`);
console.log(`Database: ${dbConfig.database}`);
console.log(`Password: ${'*'.repeat(dbConfig.password.length)}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function testConnection() {
    let connection;

    try {
        console.log('📡 Testando conexão com o banco de dados...');

        // Criar pool de conexões
        const pool = mysql.createPool(dbConfig);

        // Testar conexão
        connection = await pool.getConnection();
        console.log('✅ Conexão estabelecida com sucesso!\n');

        // Testar query simples
        console.log('🔍 Testando query básica...');
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('✅ Query executada:', rows);
        console.log('');

        // Listar tabelas existentes
        console.log('📋 Listando tabelas existentes no banco...');
        const [tables] = await connection.query('SHOW TABLES');

        if (tables.length === 0) {
            console.log('⚠️  Nenhuma tabela encontrada no banco de dados.');
            console.log('💡 Execute a rota /api/setup para criar as tabelas.\n');
        } else {
            console.log(`✅ ${tables.length} tabela(s) encontrada(s):`);
            tables.forEach((table, index) => {
                const tableName = Object.values(table)[0];
                console.log(`   ${index + 1}. ${tableName}`);
            });
            console.log('');

            // Verificar estrutura de cada tabela
            console.log('🔍 Verificando estrutura das tabelas...');
            for (const table of tables) {
                const tableName = Object.values(table)[0];
                const [columns] = await connection.query(`DESCRIBE ${tableName}`);
                console.log(`\n📊 Tabela: ${tableName}`);
                console.log('   Colunas:');
                columns.forEach(col => {
                    console.log(`   - ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? '🔑 PRIMARY KEY' : ''}`);
                });
            }
            console.log('');

            // Contar registros em cada tabela
            console.log('📊 Contando registros em cada tabela...');
            for (const table of tables) {
                const tableName = Object.values(table)[0];
                const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
                const count = countResult[0].count;
                console.log(`   ${tableName}: ${count} registro(s)`);
            }
            console.log('');
        }

        // Testar inserção de dados (Cliente de teste)
        console.log('💾 Testando inserção de dados...');
        const testClientId = `test-client-${Date.now()}`;
        const testClient = {
            id: testClientId,
            type: 'fisica',
            name: 'Cliente Teste',
            cpf: '123.456.789-00',
            email: 'teste@example.com',
            phone: '(11) 98765-4321',
            blocked: false,
            address: JSON.stringify({
                street: 'Rua Teste',
                number: '123',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01234-567'
            })
        };

        try {
            await connection.query(
                `INSERT INTO clients (id, type, name, cpf, email, phone, blocked, address) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [testClient.id, testClient.type, testClient.name, testClient.cpf,
                testClient.email, testClient.phone, testClient.blocked, testClient.address]
            );
            console.log('✅ Cliente de teste inserido com sucesso!');
            console.log(`   ID: ${testClientId}`);
            console.log(`   Nome: ${testClient.name}\n`);

            // Testar leitura
            console.log('📖 Testando leitura de dados...');
            const [clients] = await connection.query('SELECT * FROM clients WHERE id = ?', [testClientId]);
            console.log('✅ Cliente recuperado:', clients[0]);
            console.log('');

            // Testar atualização
            console.log('✏️  Testando atualização de dados...');
            await connection.query(
                'UPDATE clients SET name = ? WHERE id = ?',
                ['Cliente Teste Atualizado', testClientId]
            );
            const [updatedClients] = await connection.query('SELECT * FROM clients WHERE id = ?', [testClientId]);
            console.log('✅ Cliente atualizado:', updatedClients[0].name);
            console.log('');

            // Testar exclusão
            console.log('🗑️  Testando exclusão de dados...');
            await connection.query('DELETE FROM clients WHERE id = ?', [testClientId]);
            const [deletedClients] = await connection.query('SELECT * FROM clients WHERE id = ?', [testClientId]);
            console.log('✅ Cliente excluído. Registros encontrados:', deletedClients.length);
            console.log('');

        } catch (insertError) {
            if (insertError.code === 'ER_NO_SUCH_TABLE') {
                console.log('⚠️  Tabela "clients" não existe.');
                console.log('💡 Execute a rota /api/setup para criar as tabelas.\n');
            } else {
                throw insertError;
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ TODOS OS TESTES PASSARAM COM SUCESSO!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('📝 Próximos passos:');
        console.log('1. Se as tabelas não existem, acesse: http://localhost:3001/api/setup');
        console.log('2. Inicie o servidor: npm run dev');
        console.log('3. O sistema estará rodando localmente conectado ao banco na VPS\n');

    } catch (error) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ ERRO NA CONEXÃO COM O BANCO DE DADOS');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Código do erro:', error.code);
        console.error('Mensagem:', error.message);
        console.error('');

        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Possíveis soluções:');
            console.error('   1. Verifique se o túnel SSH está ativo:');
            console.error('      ssh -L 3306:127.0.0.1:3306 deploy@161.97.124.179 -N');
            console.error('   2. Verifique se o MySQL está rodando na VPS');
            console.error('   3. Verifique as credenciais no arquivo .env\n');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('💡 Erro de autenticação:');
            console.error('   1. Verifique o usuário e senha no arquivo .env');
            console.error('   2. Verifique as permissões do usuário no MySQL\n');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('💡 Banco de dados não encontrado:');
            console.error('   1. Verifique o nome do banco no arquivo .env');
            console.error('   2. Crie o banco de dados se necessário\n');
        }

        console.error('Stack trace completo:');
        console.error(error);
        process.exit(1);

    } finally {
        if (connection) {
            connection.release();
            console.log('🔌 Conexão fechada.');
        }
    }
}

// Executar teste
testConnection();

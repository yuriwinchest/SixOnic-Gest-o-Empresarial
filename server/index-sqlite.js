import express from 'express';
import cors from 'cors';
import db from './db-sqlite.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

console.log('🚀 Servidor iniciando...');
console.log(`📡 Porta: ${PORT}`);
console.log('');

// Helper para converter snake_case para camelCase
const toCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

const keysToCamel = (o) => {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
        const n = {};
        Object.keys(o).forEach((k) => {
            n[toCamel(k)] = keysToCamel(o[k]);
        });
        return n;
    } else if (Array.isArray(o)) {
        return o.map((i) => keysToCamel(i));
    }
    return o;
};

// Rota de Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor rodando com SQLite local!',
        database: 'SQLite',
        timestamp: new Date().toISOString()
    });
});

// Rota de Setup (Já criadas automaticamente, mas mantém para compatibilidade)
app.get('/api/setup', (req, res) => {
    res.json({ message: 'Tabelas já foram criadas automaticamente (SQLite)!' });
});

// Rota de Estado Global
app.get('/api/state', (req, res) => {
    try {
        const tables = [
            'company_settings', 'store_settings', 'margin_rules', 'cost_centers',
            'payment_methods', 'clients', 'employees', 'products', 'sales',
            'quotes', 'checklists', 'work_orders', 'transactions',
            'client_purchases', 'contract_templates', 'contracts'
        ];

        const state = {};

        for (const table of tables) {
            try {
                const rows = db.prepare(`SELECT * FROM ${table}`).all();
                const camelTable = toCamel(table);

                // Garante que companySettings/storeSettings sejam objetos únicos se vierem como array
                if (['companySettings', 'storeSettings'].includes(camelTable)) {
                    state[camelTable] = rows[0] ? keysToCamel(rows[0]) : null;
                } else {
                    state[camelTable] = keysToCamel(rows);
                }
            } catch (e) {
                console.warn(`Tabela ${table} não encontrada ou vazia:`, e.message);
                state[toCamel(table)] = [];
            }
        }

        res.json(state);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Ações (CRUD)
app.post('/api/actions', (req, res) => {
    const { action, data, id } = req.body;

    try {
        if (action === 'create_client') {
            const { id, type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked, address } = data;

            const stmt = db.prepare(`
                INSERT INTO clients (id, type, name, razao_social, cpf, rg, cnpj, email, phone, company_phone, seller_contact, marital_status, password, blocked, address) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(id, type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked ? 1 : 0, JSON.stringify(address));

            console.log('✅ Cliente criado:', { id, name, email });

        } else if (action === 'update_client') {
            const { id, type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked, address } = data;

            const stmt = db.prepare(`
                UPDATE clients 
                SET type=?, name=?, razao_social=?, cpf=?, rg=?, cnpj=?, email=?, phone=?, company_phone=?, seller_contact=?, marital_status=?, password=?, blocked=?, address=? 
                WHERE id=?
            `);

            stmt.run(type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked ? 1 : 0, JSON.stringify(address), id);

            console.log('✅ Cliente atualizado:', { id, name });

        } else if (action === 'delete_client') {
            const stmt = db.prepare('DELETE FROM clients WHERE id=?');
            stmt.run(id);

            console.log('✅ Cliente excluído:', { id });
        }

        // Adicionar outros cases conforme necessidade...

        res.json({ success: true });
    } catch (error) {
        console.error('❌ Erro na ação:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para listar clientes
app.get('/api/clients', (req, res) => {
    try {
        const clients = db.prepare('SELECT * FROM clients').all();
        res.json(keysToCamel(clients));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para obter um cliente específico
app.get('/api/clients/:id', (req, res) => {
    try {
        const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
        if (client) {
            res.json(keysToCamel(client));
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📝 Rotas disponíveis:');
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   GET  http://localhost:${PORT}/api/state`);
    console.log(`   GET  http://localhost:${PORT}/api/clients`);
    console.log(`   POST http://localhost:${PORT}/api/actions`);
    console.log('');
});

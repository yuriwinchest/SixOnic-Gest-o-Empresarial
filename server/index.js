import express from 'express';
import cors from 'cors';
import pool from './db.js';
import setupSql from './sql.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
        message: 'Backend funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota de Setup (Criação de Tabelas)
app.get('/api/setup', async (req, res) => {
    try {
        const commands = setupSql.split(';').filter(cmd => cmd.trim());
        for (const cmd of commands) {
            if (cmd.trim()) await pool.query(cmd);
        }
        res.json({ message: 'Tabelas criadas/atualizadas com sucesso (MySQL)!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Rota de Estado Global
app.get('/api/state', async (req, res) => {
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
                const [rows] = await pool.query(`SELECT * FROM ${table}`);
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

// Ações (CRUD Básico de Clientes como exemplo)
app.post('/api/actions', async (req, res) => {
    const { action, data, id } = req.body;

    try {
        if (action === 'create_client') {
            const { id, type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked, address } = data;
            const sql = `INSERT INTO clients (id, type, name, razao_social, cpf, rg, cnpj, email, phone, company_phone, seller_contact, marital_status, password, blocked, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            await pool.query(sql, [id, type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked, JSON.stringify(address)]);
        } else if (action === 'update_client') {
            const { id, type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked, address } = data;
            const sql = `UPDATE clients SET type=?, name=?, razao_social=?, cpf=?, rg=?, cnpj=?, email=?, phone=?, company_phone=?, seller_contact=?, marital_status=?, password=?, blocked=?, address=? WHERE id=?`;
            await pool.query(sql, [type, name, razaoSocial, cpf, rg, cnpj, email, phone, companyPhone, sellerContact, maritalStatus, password, blocked, JSON.stringify(address), id]);
        } else if (action === 'delete_client') {
            await pool.query('DELETE FROM clients WHERE id=?', [id]);
        }

        // Adicionar outros cases conforme necessidade...

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

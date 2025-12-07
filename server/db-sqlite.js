import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração: usar SQLite para desenvolvimento local
const USE_SQLITE = process.env.USE_SQLITE !== 'false'; // Por padrão usa SQLite
const DB_PATH = join(__dirname, '..', 'database.sqlite');

console.log('🔧 Configuração do Banco de Dados:');
console.log(`   Tipo: ${USE_SQLITE ? 'SQLite (Local)' : 'MySQL (VPS)'}`);
if (USE_SQLITE) {
    console.log(`   Arquivo: ${DB_PATH}`);
}
console.log('');

// Criar conexão SQLite
const db = new Database(DB_PATH, { verbose: console.log });

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas
const createTables = () => {
    console.log('📋 Criando tabelas...');

    // Company Settings
    db.exec(`
        CREATE TABLE IF NOT EXISTS company_settings (
            id TEXT PRIMARY KEY DEFAULT 'SETTINGS',
            name TEXT,
            cnpj TEXT,
            ie TEXT,
            email TEXT,
            phone TEXT,
            logo TEXT,
            address TEXT,
            standard_price_table TEXT,
            discount_levels TEXT,
            document_sequences TEXT,
            auto_message_settings TEXT,
            os_footer_text TEXT,
            default_warranty_text TEXT,
            terms_text TEXT,
            service_commission REAL
        )
    `);

    // Store Settings
    db.exec(`
        CREATE TABLE IF NOT EXISTS store_settings (
            id TEXT PRIMARY KEY DEFAULT 'STORE',
            store_name TEXT,
            hero_slides TEXT,
            sidebar_slides TEXT
        )
    `);

    // Margin Rules
    db.exec(`
        CREATE TABLE IF NOT EXISTS margin_rules (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            percentage REAL NOT NULL
        )
    `);

    // Cost Centers
    db.exec(`
        CREATE TABLE IF NOT EXISTS cost_centers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT,
            description TEXT
        )
    `);

    // Payment Methods
    db.exec(`
        CREATE TABLE IF NOT EXISTS payment_methods (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT,
            fee_percentage REAL DEFAULT 0
        )
    `);

    // Clients
    db.exec(`
        CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            type TEXT,
            name TEXT,
            razao_social TEXT,
            cpf TEXT,
            rg TEXT,
            cnpj TEXT,
            email TEXT,
            phone TEXT,
            company_phone TEXT,
            seller_contact TEXT,
            marital_status TEXT,
            password TEXT,
            blocked INTEGER DEFAULT 0,
            address TEXT
        )
    `);

    // Employees
    db.exec(`
        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            cpf TEXT,
            role TEXT,
            salary REAL,
            advances REAL DEFAULT 0,
            username TEXT,
            email TEXT,
            password TEXT,
            address TEXT
        )
    `);

    // Products
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT,
            brand TEXT,
            model TEXT,
            ncm TEXT,
            price REAL NOT NULL,
            cost REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            min_stock INTEGER DEFAULT 5,
            profit_margin REAL,
            warranty_days INTEGER DEFAULT 90,
            show_in_store INTEGER DEFAULT 0,
            images TEXT
        )
    `);

    // Sales
    db.exec(`
        CREATE TABLE IF NOT EXISTS sales (
            id TEXT PRIMARY KEY,
            client_id TEXT,
            client_name TEXT,
            date TEXT,
            status TEXT,
            payment_method TEXT,
            total_value REAL,
            items TEXT
        )
    `);

    // Quotes
    db.exec(`
        CREATE TABLE IF NOT EXISTS quotes (
            id TEXT PRIMARY KEY,
            client_id TEXT,
            client_name TEXT,
            date TEXT,
            expire_date TEXT,
            status TEXT,
            total_value REAL,
            items TEXT
        )
    `);

    // Checklists
    db.exec(`
        CREATE TABLE IF NOT EXISTS checklists (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            date_created TEXT DEFAULT CURRENT_TIMESTAMP,
            items TEXT,
            parts TEXT,
            photos TEXT
        )
    `);

    // Work Orders
    db.exec(`
        CREATE TABLE IF NOT EXISTS work_orders (
            id TEXT PRIMARY KEY,
            client_id TEXT,
            client_name TEXT,
            description TEXT,
            status TEXT,
            priority TEXT,
            technician TEXT,
            date_created TEXT,
            date_start TEXT,
            date_end TEXT,
            labor_value REAL DEFAULT 0,
            total_value REAL DEFAULT 0,
            payment_status TEXT,
            warranty_details TEXT,
            observations TEXT,
            checklist_id TEXT,
            products TEXT
        )
    `);

    // Transactions
    db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            description TEXT,
            amount REAL,
            type TEXT,
            date TEXT,
            category TEXT
        )
    `);

    // Client Purchases
    db.exec(`
        CREATE TABLE IF NOT EXISTS client_purchases (
            id TEXT PRIMARY KEY,
            client_id TEXT,
            product_name TEXT,
            purchase_date TEXT,
            warranty_expire_date TEXT,
            payment_method TEXT,
            payment_status TEXT,
            value REAL
        )
    `);

    // Contract Templates
    db.exec(`
        CREATE TABLE IF NOT EXISTS contract_templates (
            id TEXT PRIMARY KEY,
            name TEXT,
            content TEXT
        )
    `);

    // Contracts
    db.exec(`
        CREATE TABLE IF NOT EXISTS contracts (
            id TEXT PRIMARY KEY,
            quote_id TEXT,
            client_name TEXT,
            date_created TEXT,
            status TEXT,
            content TEXT
        )
    `);

    console.log('✅ Tabelas criadas com sucesso!');
};

// Criar tabelas automaticamente
createTables();

export default db;

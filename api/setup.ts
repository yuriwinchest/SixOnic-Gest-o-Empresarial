
import pool from './db';

export default async function handler(req: any, res: any) {
  const sql = `
    -- Habilita extensão para UUIDs
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Configurações da Empresa
    CREATE TABLE IF NOT EXISTS company_settings (
      id TEXT PRIMARY KEY DEFAULT 'SETTINGS',
      name TEXT,
      cnpj TEXT,
      ie TEXT,
      email TEXT,
      phone TEXT,
      logo TEXT,
      address JSONB,
      standard_price_table TEXT,
      discount_levels JSONB,
      document_sequences JSONB,
      auto_message_settings JSONB,
      os_footer_text TEXT,
      default_warranty_text TEXT,
      terms_text TEXT,
      service_commission NUMERIC
    );

    -- Configurações da Loja Virtual
    CREATE TABLE IF NOT EXISTS store_settings (
      id TEXT PRIMARY KEY DEFAULT 'STORE',
      store_name TEXT,
      hero_slides JSONB,
      sidebar_slides JSONB
    );

    -- Regras de Margem
    CREATE TABLE IF NOT EXISTS margin_rules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      percentage NUMERIC NOT NULL
    );

    -- Centros de Custo
    CREATE TABLE IF NOT EXISTS cost_centers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT CHECK (type IN ('Fixo', 'Variável')),
      description TEXT
    );

    -- Formas de Pagamento
    CREATE TABLE IF NOT EXISTS payment_methods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT,
      fee_percentage NUMERIC DEFAULT 0
    );

    -- Clientes e Fornecedores
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      type TEXT CHECK (type IN ('Cliente', 'Fornecedor')),
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
      blocked BOOLEAN DEFAULT FALSE,
      address JSONB
    );

    -- Funcionários
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cpf TEXT,
      role TEXT,
      salary NUMERIC,
      advances NUMERIC DEFAULT 0,
      username TEXT,
      email TEXT,
      password TEXT,
      address JSONB
    );

    -- Produtos
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      brand TEXT,
      model TEXT,
      ncm TEXT,
      price NUMERIC NOT NULL,
      cost NUMERIC NOT NULL,
      stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 5,
      profit_margin NUMERIC,
      warranty_days INTEGER DEFAULT 90,
      show_in_store BOOLEAN DEFAULT FALSE,
      images JSONB
    );

    -- Vendas
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      client_name TEXT,
      date TIMESTAMP WITH TIME ZONE,
      status TEXT,
      payment_method TEXT,
      total_value NUMERIC,
      items JSONB
    );

    -- Orçamentos
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      client_name TEXT,
      date TIMESTAMP WITH TIME ZONE,
      expire_date TIMESTAMP WITH TIME ZONE,
      status TEXT CHECK (status IN ('Aberto', 'Aprovado', 'Rejeitado')),
      total_value NUMERIC,
      items JSONB
    );

    -- Checklists
    CREATE TABLE IF NOT EXISTS checklists (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      date_created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      items JSONB,
      parts JSONB,
      photos JSONB
    );

    -- Ordens de Serviço
    CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      client_name TEXT,
      description TEXT,
      status TEXT,
      priority TEXT,
      technician TEXT,
      date_created TIMESTAMP WITH TIME ZONE,
      date_start TIMESTAMP WITH TIME ZONE,
      date_end TIMESTAMP WITH TIME ZONE,
      labor_value NUMERIC DEFAULT 0,
      total_value NUMERIC DEFAULT 0,
      payment_status TEXT CHECK (payment_status IN ('Pendente', 'Pago')),
      warranty_details TEXT,
      observations TEXT,
      checklist_id TEXT,
      products JSONB
    );

    -- Transações
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      description TEXT,
      amount NUMERIC,
      type TEXT CHECK (type IN ('Receita', 'Despesa')),
      date TIMESTAMP WITH TIME ZONE,
      category TEXT
    );

    -- Compras do Cliente
    CREATE TABLE IF NOT EXISTS client_purchases (
      id TEXT PRIMARY KEY,
      client_id TEXT,
      product_name TEXT,
      purchase_date TIMESTAMP WITH TIME ZONE,
      warranty_expire_date TIMESTAMP WITH TIME ZONE,
      payment_method TEXT,
      payment_status TEXT,
      value NUMERIC
    );

    -- Modelos de Contrato
    CREATE TABLE IF NOT EXISTS contract_templates (
      id TEXT PRIMARY KEY,
      name TEXT,
      content TEXT
    );

    -- Contratos Gerados
    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      quote_id TEXT,
      client_name TEXT,
      date_created TIMESTAMP WITH TIME ZONE,
      status TEXT,
      content TEXT
    );
  `;

  try {
    await pool.query(sql);
    res.status(200).json({ message: 'Tabelas criadas/atualizadas com sucesso!' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export default `
  CREATE TABLE IF NOT EXISTS company_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'SETTINGS',
    name TEXT,
    cnpj TEXT,
    ie TEXT,
    email TEXT,
    phone TEXT,
    logo TEXT,
    address JSON,
    standard_price_table TEXT,
    discount_levels JSON,
    document_sequences JSON,
    auto_message_settings JSON,
    os_footer_text TEXT,
    default_warranty_text TEXT,
    terms_text TEXT,
    service_commission DECIMAL(10,2)
  );

  CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'STORE',
    store_name TEXT,
    hero_slides JSON,
    sidebar_slides JSON
  );

  CREATE TABLE IF NOT EXISTS margin_rules (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    percentage DECIMAL(10,2) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cost_centers (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    type VARCHAR(20),
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS payment_methods (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    type VARCHAR(50),
    fee_percentage DECIMAL(10,2) DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(20),
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
    address JSON
  );

  CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    cpf TEXT,
    role TEXT,
    salary DECIMAL(10,2),
    advances DECIMAL(10,2) DEFAULT 0,
    username TEXT,
    email TEXT,
    password TEXT,
    address JSON
  );

  CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    brand TEXT,
    model TEXT,
    ncm TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    profit_margin DECIMAL(10,2),
    warranty_days INTEGER DEFAULT 90,
    show_in_store BOOLEAN DEFAULT FALSE,
    images JSON
  );

  CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255),
    client_name TEXT,
    date DATETIME,
    status VARCHAR(50),
    payment_method TEXT,
    total_value DECIMAL(10,2),
    items JSON
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255),
    client_name TEXT,
    date DATETIME,
    expire_date DATETIME,
    status VARCHAR(50),
    total_value DECIMAL(10,2),
    items JSON
  );

  CREATE TABLE IF NOT EXISTS checklists (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT,
    description TEXT,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    items JSON,
    parts JSON,
    photos JSON
  );

  CREATE TABLE IF NOT EXISTS work_orders (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255),
    client_name TEXT,
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    technician VARCHAR(255),
    date_created DATETIME,
    date_start DATETIME,
    date_end DATETIME,
    labor_value DECIMAL(10,2) DEFAULT 0,
    total_value DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(50),
    warranty_details TEXT,
    observations TEXT,
    checklist_id VARCHAR(255),
    products JSON
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT,
    amount DECIMAL(10,2),
    type VARCHAR(20),
    date DATETIME,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS client_purchases (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255),
    product_name TEXT,
    purchase_date DATETIME,
    warranty_expire_date DATETIME,
    payment_method TEXT,
    payment_status VARCHAR(50),
    value DECIMAL(10,2)
  );

  CREATE TABLE IF NOT EXISTS contract_templates (
    id VARCHAR(255) PRIMARY KEY,
    name TEXT,
    content TEXT
  );

  CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR(255) PRIMARY KEY,
    quote_id VARCHAR(255),
    client_name TEXT,
    date_created DATETIME,
    status VARCHAR(50),
    content TEXT
  );
`;

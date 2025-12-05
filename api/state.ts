
import pool from './db';

export default async function handler(req: any, res: any) {
  try {
    // Busca dados de todas as tabelas em paralelo para performance
    const [
      companySettings, storeSettings, marginRules, costCenters, paymentMethods,
      clients, employees, products, sales, quotes, checklists, workOrders,
      transactions, clientPurchases, contractTemplates, contracts
    ] = await Promise.all([
      pool.query('SELECT * FROM company_settings LIMIT 1'),
      pool.query('SELECT * FROM store_settings LIMIT 1'),
      pool.query('SELECT * FROM margin_rules'),
      pool.query('SELECT * FROM cost_centers'),
      pool.query('SELECT * FROM payment_methods'),
      pool.query('SELECT * FROM clients'),
      pool.query('SELECT * FROM employees'),
      pool.query('SELECT * FROM products'),
      pool.query('SELECT * FROM sales'),
      pool.query('SELECT * FROM quotes'),
      pool.query('SELECT * FROM checklists'),
      pool.query('SELECT * FROM work_orders'),
      pool.query('SELECT * FROM transactions'),
      pool.query('SELECT * FROM client_purchases'),
      pool.query('SELECT * FROM contract_templates'),
      pool.query('SELECT * FROM contracts')
    ]);

    // Função auxiliar para processar campos numéricos que vêm como string do Postgres
    const fixNumbers = (rows: any[]) => rows.map((row: any) => {
      const newRow = { ...row };
      ['price', 'cost', 'profit_margin', 'total_value', 'labor_value', 'value', 'amount', 'salary', 'advances', 'fee_percentage', 'service_commission', 'percentage'].forEach(key => {
        if (newRow[key]) newRow[key] = Number(newRow[key]);
      });
      
      // Quick adaptations for snake_case DB to camelCase Frontend
      if(newRow.client_id) { newRow.clientId = newRow.client_id; delete newRow.client_id; }
      if(newRow.client_name) { newRow.clientName = newRow.client_name; delete newRow.client_name; }
      if(newRow.total_value) { newRow.totalValue = newRow.total_value; delete newRow.total_value; }
      if(newRow.payment_method) { newRow.paymentMethod = newRow.payment_method; delete newRow.payment_method; }
      if(newRow.expire_date) { newRow.expireDate = newRow.expire_date; delete newRow.expire_date; }
      if(newRow.date_created) { newRow.dateCreated = newRow.date_created; delete newRow.date_created; }
      if(newRow.date_start) { newRow.dateStart = newRow.date_start; delete newRow.date_start; }
      if(newRow.date_end) { newRow.dateEnd = newRow.date_end; delete newRow.date_end; }
      if(newRow.labor_value) { newRow.laborValue = newRow.labor_value; delete newRow.labor_value; }
      if(newRow.payment_status) { newRow.paymentStatus = newRow.payment_status; delete newRow.payment_status; }
      if(newRow.warranty_details) { newRow.warrantyDetails = newRow.warranty_details; delete newRow.warranty_details; }
      if(newRow.checklist_id) { newRow.checklistId = newRow.checklist_id; delete newRow.checklist_id; }
      if(newRow.razao_social) { newRow.razaoSocial = newRow.razao_social; delete newRow.razao_social; }
      if(newRow.company_phone) { newRow.companyPhone = newRow.company_phone; delete newRow.company_phone; }
      if(newRow.seller_contact) { newRow.sellerContact = newRow.seller_contact; delete newRow.seller_contact; }
      if(newRow.marital_status) { newRow.maritalStatus = newRow.marital_status; delete newRow.marital_status; }
      if(newRow.min_stock) { newRow.minStock = newRow.min_stock; delete newRow.min_stock; }
      if(newRow.profit_margin) { newRow.profitMargin = newRow.profit_margin; delete newRow.profit_margin; }
      if(newRow.warranty_days) { newRow.warrantyDays = newRow.warranty_days; delete newRow.warranty_days; }
      if(newRow.show_in_store) { newRow.showInStore = newRow.show_in_store; delete newRow.show_in_store; }
      if(newRow.fee_percentage) { newRow.feePercentage = newRow.fee_percentage; delete newRow.fee_percentage; }
      if(newRow.quote_id) { newRow.quoteId = newRow.quote_id; delete newRow.quote_id; }
      if(newRow.product_name) { newRow.productName = newRow.product_name; delete newRow.product_name; }
      if(newRow.purchase_date) { newRow.purchaseDate = newRow.purchase_date; delete newRow.purchase_date; }
      if(newRow.warranty_expire_date) { newRow.warrantyExpireDate = newRow.warranty_expire_date; delete newRow.warranty_expire_date; }

      return newRow;
    });

    // Helper for Settings (single row tables)
    const formatSettings = (rows: any[]) => {
       if (rows.length === 0) return null;
       const data = rows[0];
       // CamelCase fixes for settings
       if(data.standard_price_table) data.standardPriceTable = data.standard_price_table;
       if(data.discount_levels) data.discountLevels = data.discount_levels;
       if(data.document_sequences) data.documentSequences = data.document_sequences;
       if(data.quote_validity_days) data.quoteValidityDays = data.quote_validity_days;
       if(data.auto_delete_expired_quotes) data.autoDeleteExpiredQuotes = data.auto_delete_expired_quotes;
       if(data.service_commission) data.serviceCommission = Number(data.service_commission);
       if(data.auto_message_settings) data.autoMessageSettings = data.auto_message_settings;
       if(data.os_footer_text) data.osFooterText = data.os_footer_text;
       if(data.default_warranty_text) data.defaultWarrantyText = data.default_warranty_text;
       if(data.terms_text) data.termsText = data.terms_text;
       if(data.store_name) data.storeName = data.store_name;
       if(data.hero_slides) data.heroSlides = data.hero_slides;
       if(data.sidebar_slides) data.sidebarSlides = data.sidebar_slides;
       return data;
    }

    const payload = {
      companySettings: formatSettings(companySettings.rows),
      storeSettings: formatSettings(storeSettings.rows),
      marginRules: fixNumbers(marginRules.rows),
      costCenters: fixNumbers(costCenters.rows),
      paymentMethods: fixNumbers(paymentMethods.rows),
      clients: fixNumbers(clients.rows),
      employees: fixNumbers(employees.rows),
      products: fixNumbers(products.rows),
      sales: fixNumbers(sales.rows),
      quotes: fixNumbers(quotes.rows),
      checklists: fixNumbers(checklists.rows),
      workOrders: fixNumbers(workOrders.rows),
      transactions: fixNumbers(transactions.rows),
      clientPurchases: fixNumbers(clientPurchases.rows),
      contractTemplates: contractTemplates.rows,
      contracts: fixNumbers(contracts.rows)
    };

    res.status(200).json(payload);
  } catch (error: any) {
    console.error("Database fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data from Neon DB" });
  }
}

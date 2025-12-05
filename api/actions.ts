
import pool from './db';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, data, id } = req.body;

  try {
    let result;

    switch (action) {
      // --- CLIENTES ---
      case 'create_client':
        const { 
          id: cId, type, name, razaoSocial, cpf, rg, cnpj, email, 
          phone, companyPhone, sellerContact, maritalStatus, password, 
          blocked, address 
        } = data;

        result = await pool.query(
          `INSERT INTO clients (
            id, type, name, razao_social, cpf, rg, cnpj, email, 
            phone, company_phone, seller_contact, marital_status, 
            password, blocked, address
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *`,
          [
            cId, type, name, razaoSocial, cpf, rg, cnpj, email,
            phone, companyPhone, sellerContact, maritalStatus,
            password, blocked || false, JSON.stringify(address)
          ]
        );
        break;

      case 'update_client':
        const u = data;
        result = await pool.query(
          `UPDATE clients SET 
            type=$1, name=$2, razao_social=$3, cpf=$4, rg=$5, cnpj=$6, 
            email=$7, phone=$8, company_phone=$9, seller_contact=$10, 
            marital_status=$11, password=$12, blocked=$13, address=$14
           WHERE id=$15 RETURNING *`,
          [
            u.type, u.name, u.razaoSocial, u.cpf, u.rg, u.cnpj,
            u.email, u.phone, u.companyPhone, u.sellerContact,
            u.maritalStatus, u.password, u.blocked, JSON.stringify(u.address),
            u.id
          ]
        );
        break;

      case 'delete_client':
        result = await pool.query('DELETE FROM clients WHERE id = $1', [id]);
        break;

      // --- TODO: Adicionar cases para Produtos, OS, etc. conforme necessidade ---
      
      default:
        return res.status(400).json({ error: 'Action not supported' });
    }

    res.status(200).json({ success: true, data: result?.rows[0] });
  } catch (error: any) {
    console.error('Database error in actions.ts:', error);
    res.status(500).json({ error: error.message });
  }
}

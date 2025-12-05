import { GoogleGenAI } from "@google/genai";
import { AppState, TransactionType, OSTatus } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generateBusinessInsight = async (state: AppState): Promise<string> => {
  if (!API_KEY) {
    return "API Key não configurada. Por favor, configure a variável de ambiente para usar a IA.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Prepare a summary of data to save tokens
  const totalRevenue = state.transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = state.transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingOS = state.workOrders.filter(os => os.status === OSTatus.PENDING).length;
  const lowStockItems = state.products.filter(p => p.stock <= p.minStock).map(p => p.name);

  const prompt = `
    Atue como um consultor de negócios sênior. Analise os seguintes dados da empresa "Nexus Gestão":
    
    - Receita Total: R$ ${totalRevenue.toFixed(2)}
    - Despesas Totais: R$ ${totalExpense.toFixed(2)}
    - Lucro Líquido: R$ ${(totalRevenue - totalExpense).toFixed(2)}
    - Ordens de Serviço Pendentes: ${pendingOS}
    - Itens com Estoque Baixo: ${lowStockItems.length > 0 ? lowStockItems.join(', ') : 'Nenhum'}
    
    Forneça uma análise concisa de 1 parágrafo com 3 dicas estratégicas focadas em ação para melhorar a gestão na próxima semana. Use tom profissional e motivador. Formate a resposta em Markdown simples.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro ao conectar com o consultor IA. Tente novamente mais tarde.";
  }
};
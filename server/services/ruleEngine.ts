import { getDb } from "../db";
import { rules } from "../../drizzle/schema";
import { eq, like } from "drizzle-orm";

export interface RuleMatch {
  ruleId: number;
  keywords: string[];
  response: string;
  action?: string;
}

/**
 * Rule Engine: Processa mensagens contra regras pré-definidas
 * Verifica palavras-chave e retorna respostas automáticas configuradas
 */

export async function findMatchingRule(message: string): Promise<RuleMatch | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Rule Engine] Database not available");
    return null;
  }

  try {
    // Normalizar mensagem para busca case-insensitive
    const normalizedMessage = message.toLowerCase().trim();

    // Buscar todas as regras ativas
    const allRules = await db
      .select()
      .from(rules)
      .where(eq(rules.active, true));

    // Procurar por correspondência de palavras-chave
    for (const rule of allRules) {
      const keywords = rule.keywords as string[];
      
      // Verificar se alguma palavra-chave está presente na mensagem
      const hasMatch = keywords.some(keyword => 
        normalizedMessage.includes(keyword.toLowerCase())
      );

      if (hasMatch) {
        return {
          ruleId: rule.id,
          keywords,
          response: rule.response,
          action: rule.action || undefined,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("[Rule Engine] Error finding matching rule:", error);
    return null;
  }
}

export async function createRule(data: {
  userId: number;
  name: string;
  keywords: string[];
  response: string;
  action?: string;
  active?: boolean;
  priority?: number;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(rules).values({
      userId: data.userId,
      name: data.name,
      keywords: data.keywords,
      response: data.response,
      action: data.action,
      active: data.active ?? true,
      priority: data.priority ?? 0,
    });

    return result;
  } catch (error) {
    console.error("[Rule Engine] Error creating rule:", error);
    throw error;
  }
}

export async function updateRule(
  ruleId: number,
  data: {
    name?: string;
    keywords?: string[];
    response?: string;
    action?: string;
    active?: boolean;
  }
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.keywords !== undefined) updateData.keywords = data.keywords;
    if (data.response !== undefined) updateData.response = data.response;
    if (data.action !== undefined) updateData.action = data.action;
    if (data.active !== undefined) updateData.active = data.active;

    const result = await db
      .update(rules)
      .set(updateData)
      .where(eq(rules.id, ruleId));

    return result;
  } catch (error) {
    console.error("[Rule Engine] Error updating rule:", error);
    throw error;
  }
}

export async function deleteRule(ruleId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db
      .delete(rules)
      .where(eq(rules.id, ruleId));

    return result;
  } catch (error) {
    console.error("[Rule Engine] Error deleting rule:", error);
    throw error;
  }
}

export async function getAllRules() {
  const db = await getDb();
  if (!db) {
    console.warn("[Rule Engine] Database not available");
    return [];
  }

  try {
    const allRules = await db.select().from(rules);
    return allRules;
  } catch (error) {
    console.error("[Rule Engine] Error getting all rules:", error);
    return [];
  }
}

/**
 * Predefined rules templates for common scenarios
 */
export const DEFAULT_RULES = [
  {
    name: "Compra - Iniciar Pedido",
    keywords: ["comprar", "quero comprar", "faça um pedido", "novo pedido"],
    response: "Ótimo! Vou ajudá-lo com seu pedido. Qual produto você gostaria de comprar?",
    action: "create_order",
  },
  {
    name: "Suporte - Atendimento",
    keywords: ["suporte", "ajuda", "problema", "erro", "não funciona"],
    response: "Desculpe pelos inconvenientes! Um atendente entrará em contato em breve para ajudá-lo.",
    action: "notify_support",
  },
  {
    name: "Boleto - Pagamento",
    keywords: ["boleto", "pagamento", "fatura", "cobrança"],
    response: "Vou enviar o boleto para você. Por favor, aguarde um momento.",
    action: "send_invoice",
  },
  {
    name: "Recompra - Lembrete",
    keywords: ["recomprar", "comprar novamente", "próxima compra"],
    response: "Ótimo! Vejo que você está interessado em recomprar. Qual produto?",
    action: "schedule_repurchase",
  },
  {
    name: "Horário - Informação",
    keywords: ["horário", "aberto", "fechado", "que horas"],
    response: "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.",
    action: undefined,
  },
];

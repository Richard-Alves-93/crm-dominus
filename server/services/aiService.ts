import { invokeLLM } from "../_core/llm";
import { getToolConfigurationByName } from "../db";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateAIResponse(
  userId: number,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  try {
    // Get Groq configuration
    const groqConfig = await getToolConfigurationByName(userId, "groq");
    
    if (!groqConfig || !groqConfig.isActive) {
      throw new Error("Groq AI is not configured or inactive");
    }

    const config = groqConfig.config as any;
    if (!config?.apiKey) {
      throw new Error("Groq API key is not configured");
    }

    // Build messages array
    const llmMessages: AIMessage[] = [];

    if (systemPrompt) {
      llmMessages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    llmMessages.push(...messages);

    // Call Groq LLM
    const response = await invokeLLM({
      messages: llmMessages,
    });

    // Extract response text
    const content = response.choices?.[0]?.message?.content;
    const responseText = typeof content === "string" ? content : "Desculpe, não consegui gerar uma resposta.";

    return responseText;
  } catch (error) {
    console.error("[AI Service] Error generating response:", error);
    throw error;
  }
}

export async function analyzeCustomerContext(
  userId: number,
  customerName: string,
  purchaseHistory: string,
  lastMessages: string
): Promise<string> {
  const systemPrompt = `Você é um assistente de vendas inteligente para um CRM. 
Analise o contexto do cliente e forneça insights úteis para melhorar o atendimento.
Seja conciso e profissional.`;

  const messages: AIMessage[] = [
    {
      role: "user",
      content: `Cliente: ${customerName}
Histórico de Compras: ${purchaseHistory}
Últimas Mensagens: ${lastMessages}

Por favor, analise este cliente e forneça um resumo com recomendações de ações.`,
    },
  ];

  return generateAIResponse(userId, messages, systemPrompt);
}

export async function generateAutoReply(
  userId: number,
  customerMessage: string,
  customerContext: string,
  customPrompt?: string
): Promise<string> {
  const systemPrompt =
    customPrompt ||
    `Você é um assistente de atendimento ao cliente profissional.
Responda mensagens de clientes de forma amigável, eficiente e profissional.
Mantenha as respostas concisas (máximo 2-3 linhas).`;

  const messages: AIMessage[] = [
    {
      role: "user",
      content: `Contexto do Cliente: ${customerContext}

Mensagem do Cliente: "${customerMessage}"

Por favor, gere uma resposta automática apropriada.`,
    },
  ];

  return generateAIResponse(userId, messages, systemPrompt);
}

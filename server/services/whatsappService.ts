import { getToolConfigurationByName, createMessage, getCustomerByPhone, createCustomer } from "../db";
import { generateAutoReply } from "./aiService";

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
        }>;
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
      };
    }>;
  }>;
}

export async function processWhatsAppWebhook(
  userId: number,
  payload: WhatsAppWebhookPayload
): Promise<void> {
  try {
    // Get WhatsApp configuration
    const whatsappConfig = await getToolConfigurationByName(userId, "whatsapp");

    if (!whatsappConfig || !whatsappConfig.isActive) {
      console.warn("[WhatsApp] WhatsApp is not configured or inactive");
      return;
    }

    // Process each entry
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        // Process incoming messages
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            await processIncomingMessage(userId, message, value.contacts?.[0]);
          }
        }
      }
    }
  } catch (error) {
    console.error("[WhatsApp] Error processing webhook:", error);
    throw error;
  }
}

async function processIncomingMessage(
  userId: number,
  message: any,
  contact?: any
): Promise<void> {
  try {
    const phoneNumber = message.from;
    const messageText = message.text?.body || "";
    const timestamp = new Date(parseInt(message.timestamp) * 1000);

    // Get or create customer
    let customer = await getCustomerByPhone(userId, phoneNumber);

    if (!customer) {
      const customerName = contact?.profile?.name || `Cliente ${phoneNumber}`;
      await createCustomer({
        userId,
        name: customerName,
        phone: phoneNumber,
        email: null,
        segment: "lead",
        totalPurchases: 0,
        lastInteraction: timestamp,
      } as any);
      // Fetch the newly created customer
      customer = await getCustomerByPhone(userId, phoneNumber);
    }

    // Save message to database
    if (customer) {
      await createMessage({
        customerId: customer.id,
        content: messageText,
        sender: "customer",
        timestamp,
        isRead: false,
        metadata: {
          whatsappMessageId: message.id,
          whatsappPhone: phoneNumber,
        },
      } as any);

      // Generate auto-reply if AI is configured
      try {
        const aiResponse = await generateAutoReply(
          userId,
          messageText,
          `Cliente: ${customer.name}, Telefone: ${customer.phone}`
        );

        // Save AI response to database
        await createMessage({
          customerId: customer.id,
          content: aiResponse,
          sender: "bot",
          timestamp: new Date(),
          isRead: true,
          metadata: {
            isAutoReply: true,
            aiGenerated: true,
          },
        } as any);

        // TODO: Send message via WhatsApp API
        // await sendWhatsAppMessage(userId, phoneNumber, aiResponse);
      } catch (aiError) {
        console.warn("[WhatsApp] Failed to generate AI response:", aiError);
        // Continue without AI response
      }
    }
  } catch (error) {
    console.error("[WhatsApp] Error processing incoming message:", error);
    throw error;
  }
}

export async function sendWhatsAppMessage(
  userId: number,
  phoneNumber: string,
  messageText: string
): Promise<void> {
  try {
    const whatsappConfig = await getToolConfigurationByName(userId, "whatsapp");

    if (!whatsappConfig) {
      throw new Error("WhatsApp is not configured");
    }

    const config = whatsappConfig.config as any;
    const apiToken = config?.apiToken;
    const businessPhoneId = config?.businessPhoneId;

    if (!apiToken || !businessPhoneId) {
      throw new Error("WhatsApp credentials are incomplete");
    }

    // Call WhatsApp API
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${businessPhoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "text",
          text: {
            body: messageText,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    console.log(`[WhatsApp] Message sent to ${phoneNumber}`);
  } catch (error) {
    console.error("[WhatsApp] Error sending message:", error);
    throw error;
  }
}

export function verifyWhatsAppWebhook(
  token: string,
  verifyToken: string,
  challenge: string
): string | null {
  if (token === verifyToken) {
    return challenge;
  }
  return null;
}

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { processWhatsAppWebhook, verifyWhatsAppWebhook } from "../services/whatsappService";

export const webhookRouter = router({
  // WhatsApp webhook verification (GET)
  verifyWhatsApp: publicProcedure
    .input(
      z.object({
        "hub.mode": z.string(),
        "hub.challenge": z.string(),
        "hub.verify_token": z.string(),
      })
    )
    .query(({ input }) => {
      const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "crm_dominus_verify_token";
      const challenge = verifyWhatsAppWebhook(input["hub.verify_token"], verifyToken, input["hub.challenge"]);
      
      if (challenge) {
        return { challenge };
      }
      
      throw new Error("Invalid verification token");
    }),

  // WhatsApp webhook for incoming messages (POST)
  handleWhatsApp: publicProcedure
    .input(z.any())
    .mutation(async ({ input }) => {
      try {
        // TODO: Get userId from request context or webhook signature
        // For now, we'll need to extract it from the payload or use a service account
        const userId = 1; // Placeholder - should be extracted from webhook signature or context

        await processWhatsAppWebhook(userId, input);

        return { success: true };
      } catch (error) {
        console.error("[Webhook] Error processing WhatsApp webhook:", error);
        return { success: false, error: String(error) };
      }
    }),
});

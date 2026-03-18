import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getToolConfigurationsByUserId,
  getToolConfigurationByName,
  createToolConfiguration,
  updateToolConfiguration,
} from "../db";

export const toolsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const configs = await getToolConfigurationsByUserId(ctx.user.id);
    return configs.map(config => ({
      ...config,
      config: {}, // Don't expose full config to client
    }));
  }),

  getWhatsAppConfig: protectedProcedure.query(async ({ ctx }) => {
    const config = await getToolConfigurationByName(ctx.user.id, "whatsapp");
    if (!config) return null;
    return {
      id: config.id,
      toolName: config.toolName,
      isActive: config.isActive,
      isConfigured: !!(config.config && typeof config.config === "object" && "apiToken" in config.config),
    };
  }),

  getGroqConfig: protectedProcedure.query(async ({ ctx }) => {
    const config = await getToolConfigurationByName(ctx.user.id, "groq");
    if (!config) return null;
    return {
      id: config.id,
      toolName: config.toolName,
      isActive: config.isActive,
      isConfigured: !!(config.config && typeof config.config === "object" && "apiKey" in config.config),
    };
  }),

  saveWhatsAppConfig: protectedProcedure
    .input(
      z.object({
        apiToken: z.string().min(1, "API Token is required"),
        businessPhoneId: z.string().min(1, "Business Phone ID is required"),
        businessPhoneNumber: z.string().min(1, "Business Phone Number is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getToolConfigurationByName(ctx.user.id, "whatsapp");
      
      const config = {
        apiToken: input.apiToken,
        businessPhoneId: input.businessPhoneId,
        businessPhoneNumber: input.businessPhoneNumber,
      };

      if (existing) {
        return updateToolConfiguration(existing.id, { config });
      } else {
        return createToolConfiguration({
          userId: ctx.user.id,
          toolName: "whatsapp",
          config,
          isActive: true,
        } as any);
      }
    }),

  saveGroqConfig: protectedProcedure
    .input(
      z.object({
        apiKey: z.string().min(1, "API Key is required"),
        model: z.string().default("mixtral-8x7b-32768"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getToolConfigurationByName(ctx.user.id, "groq");
      
      const config = {
        apiKey: input.apiKey,
        model: input.model,
      };

      if (existing) {
        return updateToolConfiguration(existing.id, { config });
      } else {
        return createToolConfiguration({
          userId: ctx.user.id,
          toolName: "groq",
          config,
          isActive: true,
        } as any);
      }
    }),

  toggleTool: protectedProcedure
    .input(
      z.object({
        toolName: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const config = await getToolConfigurationByName(ctx.user.id, input.toolName);
      if (!config) {
        throw new Error(`Tool configuration for ${input.toolName} not found`);
      }
      return updateToolConfiguration(config.id, { isActive: input.isActive });
    }),
});

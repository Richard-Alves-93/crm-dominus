import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getAiConfigurationsByUserId,
  getActiveAiConfiguration,
  createAiConfiguration,
  updateAiConfiguration,
} from "../db";

export const aiRouter = router({
  configurations: protectedProcedure.query(async ({ ctx }) => {
    return getAiConfigurationsByUserId(ctx.user.id);
  }),

  active: protectedProcedure.query(async ({ ctx }) => {
    return getActiveAiConfiguration(ctx.user.id);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Configuration name is required"),
        systemPrompt: z.string().min(1, "System prompt is required"),
        model: z.string().default("mixtral-8x7b-32768"),
        temperature: z.number().min(0).max(2).default(0.7),
        maxTokens: z.number().min(1).default(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createAiConfiguration({
        userId: ctx.user.id,
        name: input.name,
        systemPrompt: input.systemPrompt,
        model: input.model,
        temperature: input.temperature.toString(),
        maxTokens: input.maxTokens,
        isActive: true,
      } as any);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        systemPrompt: z.string().optional(),
        temperature: z.number().min(0).max(2).optional(),
        maxTokens: z.number().min(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.temperature !== undefined) {
        updateData.temperature = data.temperature.toString();
      }
      return updateAiConfiguration(id, updateData);
    }),

  setActive: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const configs = await getAiConfigurationsByUserId(ctx.user.id);
      
      // Deactivate all other configs
      for (const config of configs) {
        if (config.id !== input.id) {
          await updateAiConfiguration(config.id, { isActive: false });
        }
      }
      
      // Activate the selected one
      return updateAiConfiguration(input.id, { isActive: true });
    }),

  generateResponse: protectedProcedure
    .input(
      z.object({
        customerId: z.number(),
        message: z.string().min(1, "Message is required"),
        context: z.any().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const config = await getActiveAiConfiguration(ctx.user.id);
      
      if (!config) {
        return { error: "No active AI configuration found" };
      }

      // TODO: Implement Groq LLM integration
      return {
        message: "AI response will be generated here",
        config: config.name,
      };
    }),
});

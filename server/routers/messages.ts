import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getMessagesByCustomerId,
  createMessage,
  updateMessageStatus,
} from "../db";

export const messagesRouter = router({
  listByCustomer: protectedProcedure
    .input(z.object({ customerId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return getMessagesByCustomerId(input.customerId, input.limit);
    }),

  send: protectedProcedure
    .input(
      z.object({
        customerId: z.number(),
        content: z.string().min(1, "Message content is required"),
        messageType: z.enum(["text", "image", "document", "audio", "video"]).default("text"),
        whatsappMessageId: z.string().optional(),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = {
        customerId: input.customerId,
        userId: ctx.user.id,
        content: input.content,
        messageType: input.messageType,
        direction: "outbound" as const,
        status: "sent" as const,
        aiGenerated: false,
        whatsappMessageId: input.whatsappMessageId || null,
        metadata: input.metadata || null,
      };
      return createMessage(data as any);
    }),

  receive: protectedProcedure
    .input(
      z.object({
        customerId: z.number(),
        content: z.string().min(1, "Message content is required"),
        whatsappMessageId: z.string(),
        messageType: z.enum(["text", "image", "document", "audio", "video"]).default("text"),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = {
        customerId: input.customerId,
        userId: ctx.user.id,
        content: input.content,
        messageType: input.messageType,
        direction: "inbound" as const,
        whatsappMessageId: input.whatsappMessageId,
        status: "delivered" as const,
        aiGenerated: false,
        metadata: input.metadata || null,
      };
      return createMessage(data as any);
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["sent", "delivered", "read", "failed"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateMessageStatus(input.id, input.status);
      return { success: true };
    }),
});

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getSalesFunnelStagesByUserId,
  createSalesFunnelStage,
  getLeadsByUserId,
  getLeadsByStageId,
  createLead,
  updateLead,
} from "../db";

export const funnelRouter = router({
  stages: protectedProcedure.query(async ({ ctx }) => {
    return getSalesFunnelStagesByUserId(ctx.user.id);
  }),

  createStage: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Stage name is required"),
        order: z.number(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createSalesFunnelStage({
        userId: ctx.user.id,
        ...input,
      });
    }),

  leads: protectedProcedure.query(async ({ ctx }) => {
    return getLeadsByUserId(ctx.user.id);
  }),

  leadsByStage: protectedProcedure
    .input(z.object({ stageId: z.number() }))
    .query(async ({ input }) => {
      return getLeadsByStageId(input.stageId);
    }),

  createLead: protectedProcedure
    .input(
      z.object({
        customerId: z.number(),
        stageId: z.number(),
        value: z.number().optional(),
        probability: z.number().min(0).max(100).default(0),
        expectedCloseDate: z.date().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createLead({
        customerId: input.customerId,
        userId: ctx.user.id,
        stageId: input.stageId,
        value: input.value ? input.value.toString() : undefined,
        probability: input.probability,
        expectedCloseDate: input.expectedCloseDate,
        notes: input.notes,
      } as any);
    }),

  moveLead: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        newStageId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return updateLead(input.leadId, { stageId: input.newStageId });
    }),

  updateLead: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        value: z.number().optional(),
        probability: z.number().min(0).max(100).optional(),
        expectedCloseDate: z.date().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateLead(id, data as any);
    }),
});

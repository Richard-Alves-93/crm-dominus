import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getWorkflowsByUserId,
  createWorkflow,
  updateWorkflow,
} from "../db";

export const workflowsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getWorkflowsByUserId(ctx.user.id);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Workflow name is required"),
        description: z.string().optional(),
        triggerType: z.enum(["message_received", "customer_created", "stage_changed", "time_based"]),
        flowData: z.any(), // JSON structure for the visual flow
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createWorkflow({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        triggerType: input.triggerType,
        flowData: input.flowData,
        isActive: true,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        flowData: z.any().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateWorkflow(id, data);
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.number(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      return updateWorkflow(input.id, { isActive: input.isActive });
    }),
});

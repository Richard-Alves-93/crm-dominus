import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  findMatchingRule,
  createRule,
  updateRule,
  deleteRule,
  getAllRules,
  DEFAULT_RULES,
} from "../services/ruleEngine";

export const rulesRouter = router({
  // Get all rules for the user
  list: protectedProcedure.query(async ({ ctx }) => {
    const allRules = await getAllRules();
    return allRules.filter((rule: any) => rule.userId === ctx.user.id);
  }),

  // Find matching rule for a message
  findMatch: protectedProcedure
    .input(z.object({ message: z.string() }))
    .query(async ({ input }) => {
      return await findMatchingRule(input.message);
    }),

  // Create a new rule
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        keywords: z.array(z.string()).min(1),
        response: z.string().min(1),
        action: z.string().optional(),
        active: z.boolean().optional(),
        priority: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await createRule({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Update an existing rule
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        response: z.string().optional(),
        action: z.string().optional(),
        active: z.boolean().optional(),
        priority: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return await updateRule(id, data);
    }),

  // Delete a rule
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteRule(input.id);
    }),

  // Get default rules templates
  getDefaults: protectedProcedure.query(async () => {
    return DEFAULT_RULES;
  }),

  // Initialize default rules for user
  initializeDefaults: protectedProcedure.mutation(async ({ ctx }) => {
    const results = [];
    for (const defaultRule of DEFAULT_RULES) {
      try {
        const result = await createRule({
          userId: ctx.user.id,
          ...defaultRule,
        });
        results.push(result);
      } catch (error) {
        console.error("[Rules Router] Error initializing default rule:", error);
      }
    }
    return results;
  }),
});

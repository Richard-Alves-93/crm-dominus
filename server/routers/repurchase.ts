import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getPurchasesByCustomerId,
  createPurchase,
  getRepurchaseRulesByUserId,
  createRepurchaseRule,
} from "../db";

export const repurchaseRouter = router({
  purchaseHistory: protectedProcedure
    .input(z.object({ customerId: z.number() }))
    .query(async ({ input }) => {
      return getPurchasesByCustomerId(input.customerId);
    }),

  recordPurchase: protectedProcedure
    .input(
      z.object({
        customerId: z.number(),
        amount: z.number().min(0, "Amount must be positive"),
        productName: z.string().optional(),
        productCategory: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createPurchase({
        customerId: input.customerId,
        userId: ctx.user.id,
        amount: input.amount.toString(),
        productName: input.productName,
        productCategory: input.productCategory,
        notes: input.notes,
      } as any);
    }),

  rules: protectedProcedure.query(async ({ ctx }) => {
    return getRepurchaseRulesByUserId(ctx.user.id);
  }),

  createRule: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Rule name is required"),
        description: z.string().optional(),
        productCategory: z.string().optional(),
        daysBetweenPurchases: z.number().min(1, "Days must be at least 1"),
        minPurchaseAmount: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createRepurchaseRule({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        productCategory: input.productCategory,
        daysBetweenPurchases: input.daysBetweenPurchases,
        minPurchaseAmount: input.minPurchaseAmount ? input.minPurchaseAmount.toString() : undefined,
        isActive: true,
      } as any);
    }),

  analyzeRepurchaseOpportunities: protectedProcedure
    .input(z.object({ customerId: z.number() }))
    .query(async ({ input }) => {
      const purchases = await getPurchasesByCustomerId(input.customerId);
      
      if (purchases.length === 0) {
        return { opportunities: [], lastPurchase: null };
      }

      const lastPurchase = purchases[0];
      const daysSinceLastPurchase = Math.floor(
        (Date.now() - lastPurchase.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        lastPurchase,
        daysSinceLastPurchase,
        purchaseFrequency: purchases.length > 1 
          ? Math.floor(
              (purchases[0].createdAt.getTime() - purchases[purchases.length - 1].createdAt.getTime()) 
              / (1000 * 60 * 60 * 24) / (purchases.length - 1)
            )
          : null,
      };
    }),
});

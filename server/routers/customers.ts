import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getCustomersByUserId,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from "../db";

export const customersRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return getCustomersByUserId(ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getCustomerById(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email().optional(),
        phone: z.string().min(1, "Phone is required"),
        whatsappPhone: z.string().optional(),
        segment: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createCustomer({
        userId: ctx.user.id,
        status: "active",
        ...input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        whatsappPhone: z.string().optional(),
        segment: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "inactive", "blocked"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateCustomer(id, data);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return updateCustomer(input.id, { status: "inactive" });
    }),
});

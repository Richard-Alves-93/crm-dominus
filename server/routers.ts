import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { customersRouter } from "./routers/customers";
import { messagesRouter } from "./routers/messages";
import { funnelRouter } from "./routers/funnel";
import { workflowsRouter } from "./routers/workflows";
import { repurchaseRouter } from "./routers/repurchase";
import { aiRouter } from "./routers/ai";
import { toolsRouter } from "./routers/tools";
import { webhookRouter } from "./routers/webhook";
import { rulesRouter } from "./routers/rules";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  customers: customersRouter,
  messages: messagesRouter,
  funnel: funnelRouter,
  workflows: workflowsRouter,
  repurchase: repurchaseRouter,
  ai: aiRouter,
  tools: toolsRouter,
  webhook: webhookRouter,
  rules: rulesRouter,
});


export type AppRouter = typeof appRouter;


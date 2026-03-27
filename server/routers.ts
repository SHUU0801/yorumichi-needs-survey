import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { sendSurveyEmail } from "./email";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  survey: router({
    submit: publicProcedure
      .input(
        z.object({
          q1_use_app: z.enum(['yes', 'no']),
          q2_why_app: z.string().min(1),
          q3_use_device: z.enum(['yes', 'no']),
          q4_why_device: z.string().min(1),
          q5_price: z.string().min(1),
          q6_coupon_map: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await sendSurveyEmail(input);
          return { success: true };
        } catch (error) {
          console.error('Survey submission error:', error);
          throw new Error('Failed to submit survey');
        }
      }),
  })
});

export type AppRouter = typeof appRouter;

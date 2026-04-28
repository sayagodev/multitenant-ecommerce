import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";
import { email } from "zod";
import { equal } from "assert";

export const authRouter = createTRPCRouter({

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies()
    cookies.delete(AUTH_COOKIE)
  }),

  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.db.auth({ headers })

    return session
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUsername = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username
          }
        }
      })

      const existingEmail = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          email: {
            equals: input.email
          }
        }
      })

      const isEmailTaken = existingEmail.docs[0]
      const isUsernameTaken = existingUsername.docs[0]

      if (isUsernameTaken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken"
        })
      }

      if (isEmailTaken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already register"
        })
      }

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
        }
      })

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        }
      })

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        })
      }

      const cookies = await getCookies()
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // TODO: ensure cross-domain cookie sharing
        // funroad.com // initial cookie
        // angel.funroad.com // cookie does not exists here
      })
    }),

  login: baseProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        }
      })

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        })
      }

      const cookies = await getCookies()
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // TODO: ensure cross-domain cookie sharing
        // funroad.com // initial cookie
        // angel.funroad.com // cookie does not exists here
      })

      return data
    }),
})

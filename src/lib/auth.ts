import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 10;
const LOCK_HOURS = 24;

function getRequestIp(req: unknown) {
  const request = req as { headers?: Headers | Record<string, string | string[] | undefined> };
  const headers = request?.headers;
  if (!headers) return "unknown-ip";

  if (headers instanceof Headers) {
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown-ip";
    return headers.get("x-real-ip") || "unknown-ip";
  }

  const rawForwarded = headers["x-forwarded-for"];
  if (Array.isArray(rawForwarded)) return rawForwarded[0] || "unknown-ip";
  if (rawForwarded) return String(rawForwarded).split(",")[0]?.trim() || "unknown-ip";
  const realIp = headers["x-real-ip"];
  return (Array.isArray(realIp) ? realIp[0] : realIp) || "unknown-ip";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const email = credentials.email.toLowerCase().trim();
        const ip = getRequestIp(req);
        const identifier = `${email}:${ip}`;
        const now = new Date();

        const limiter = await prisma.loginRateLimit.upsert({
          where: { identifier },
          update: {},
          create: { identifier },
        });

        if (limiter.lockedUntil && limiter.lockedUntil > now) {
          throw new Error(`RATE_LIMITED:${limiter.lockedUntil.toISOString()}`);
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) {
          const nextFailed = limiter.failedCount + 1;
          const shouldLock = nextFailed >= MAX_FAILED_ATTEMPTS;
          await prisma.loginRateLimit.update({
            where: { identifier },
            data: {
              failedCount: shouldLock ? 0 : nextFailed,
              firstFailedAt: limiter.firstFailedAt || now,
              lockedUntil: shouldLock ? new Date(now.getTime() + LOCK_HOURS * 60 * 60 * 1000) : null,
            },
          });

          if (shouldLock) {
            throw new Error(`RATE_LIMITED:${new Date(now.getTime() + LOCK_HOURS * 60 * 60 * 1000).toISOString()}`);
          }

          throw new Error("INVALID_CREDENTIALS");
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          const nextFailed = limiter.failedCount + 1;
          const shouldLock = nextFailed >= MAX_FAILED_ATTEMPTS;
          await prisma.loginRateLimit.update({
            where: { identifier },
            data: {
              failedCount: shouldLock ? 0 : nextFailed,
              firstFailedAt: limiter.firstFailedAt || now,
              lockedUntil: shouldLock ? new Date(now.getTime() + LOCK_HOURS * 60 * 60 * 1000) : null,
            },
          });

          if (shouldLock) {
            throw new Error(`RATE_LIMITED:${new Date(now.getTime() + LOCK_HOURS * 60 * 60 * 1000).toISOString()}`);
          }

          throw new Error("INVALID_CREDENTIALS");
        }

        await prisma.loginRateLimit.update({
          where: { identifier },
          data: {
            failedCount: 0,
            firstFailedAt: null,
            lockedUntil: null,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "ADMIN";
      }
      return session;
    },
  },
};

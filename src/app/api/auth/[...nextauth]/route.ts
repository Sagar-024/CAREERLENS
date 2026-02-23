import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user?.id) {
        // @ts-ignore
        session.user.id = user.id;
        // @ts-ignore
        session.user.plan = (user as any).plan || "FREE";
        // @ts-ignore
        session.user.usageCount = (user as any).usageCount || 0;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";
    },
  },
});

export { handler as GET, handler as POST };

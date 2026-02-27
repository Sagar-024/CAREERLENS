import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth/next";

const prisma = new PrismaClient();

const ADMIN_EMAILS = [
  "bishta2323@gmail.com",
  "sagarkharal024@gmail.com",
];

export const authOptions: NextAuthOptions = {
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.tier = (user as any).tier ?? "free";
        token.analysisCount = (user as any).analysisCount ?? 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
        // Fetch fresh data from DB periodically, or rely on token
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { tier: true, analysisCount: true },
        });
        
        const isWhitelisted = session.user?.email && ADMIN_EMAILS.includes(session.user.email);
        session.user.tier = isWhitelisted ? "pro" : (dbUser?.tier ?? token.tier ?? "free");
        session.user.analysisCount = dbUser?.analysisCount ?? token.analysisCount ?? 0;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + "/upload";
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

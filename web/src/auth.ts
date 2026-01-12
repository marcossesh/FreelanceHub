// web/src/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                // Se o usuário existe mas não tem senha, ele é um usuário EXCLUSIVO de OAuth
                if (!user || !user.password) {
                    // Retornar null impede o login por senha para contas sociais
                    return null
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isValid) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }
            return true;
        },
        async signIn({ user, account, profile }) {
            if (account?.provider === "credentials") return true;

            const existingUser = await prisma.user.findUnique({
                where: { email: user.email as string },
            });

            // Se o usuário não existe, precisamos saber se ele está tentando REGISTRAR
            if (!existingUser) {
                // Como o NextAuth v5 não passa os params de busca diretamente aqui de forma fácil,
                // a estratégia mais segura é permitir a criação se vier de um provider confiável,

                // Por padrão, o Auth.js criará o usuário se retornar true aqui.
                return true;
            }

            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) token.id = user.id;
            if (trigger === "update" && session?.name) token.name = session.name;
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
});

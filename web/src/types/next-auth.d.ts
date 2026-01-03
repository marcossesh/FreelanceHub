// web/src/types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Estende o objeto 'user' retornado na sessão
     */
    interface Session {
        user: {
            id: string
            role: "FREELANCER" | "CLIENT"
        } & DefaultSession["user"]
    }

    interface User {
        role: "FREELANCER" | "CLIENT"
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        role: "FREELANCER" | "CLIENT"
    }
}

declare module "next-auth/jwt" {
    /**
     * Estende o token JWT para incluir o role
     */
    interface JWT {
        role?: "FREELANCER" | "CLIENT"
    }
}

// web/src/lib/auth-helpers.ts
"use server";

import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Requires user to be authenticated.
 * Throws NOT_AUTHENTICATED error if session is invalid.
 */
export async function requireAuth() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("NOT_AUTHENTICATED");
    }
    return session;
}

/**
 * Higher-order function that wraps Server Actions with authentication check.
 * Automatically handles auth errors and returns standardized error messages.
 * 
 * @example
 * export async function createProject(prevState: any, formData: FormData) {
 *     return withAuth(async (session) => {
 *         // Your logic here - session.user.id is guaranteed
 *         await prisma.project.create({ ... });
 *         return { success: true };
 *     });
 * }
 */
export async function withAuth<T>(
    handler: (session: Session & { user: { id: string } }) => Promise<T>
): Promise<T | { error: string }> {
    try {
        const session = await requireAuth();
        return await handler(session as Session & { user: { id: string } });
    } catch (error: any) {
        if (error.message === "NOT_AUTHENTICATED") {
            return { error: "Não autorizado" };
        }
        throw error;
    }
}

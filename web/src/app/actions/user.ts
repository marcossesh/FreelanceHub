"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/auth-helpers";
import { VALIDATION_RULES } from "@/lib/validation-constants";

export async function updateProfile(prevState: any, formData: FormData) {
    return withAuth(async (session) => {
        const name = formData.get("name") as string;

        // Validate using constants
        if (!name || name.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
            return { error: `O nome deve ter pelo menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres.` };
        }

        if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
            return { error: `O nome é muito longo (máximo ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres).` };
        }

        try {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { name: name.trim() }
            });

            revalidatePath("/dashboard/settings");

            return {
                success: true,
                name: name.trim(),
                timestamp: new Date().toISOString()
            };
        } catch (e) {
            return { error: "Erro técnico ao salvar no banco de dados." };
        }
    });
}

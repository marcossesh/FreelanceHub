"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth();
    const name = formData.get("name") as string;

    if (!session?.user?.id) return { error: "Não autorizado" };

    if (!name || name.trim().length < 3) {
        return { error: "O nome deve ter pelo menos 3 caracteres." };
    }

    if (name.length > 50) {
        return { error: "O nome é muito longo (máximo 50 caracteres)." };
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
}

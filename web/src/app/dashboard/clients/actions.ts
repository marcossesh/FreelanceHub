"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ClientActionState = {
    success?: boolean;
    error?: string;
} | null;

export async function createClient(
    prevState: ClientActionState,
    formData: FormData
): Promise<ClientActionState> {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Sessão expirada. Faça login novamente." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;

    if (!name || name.length < 3) {
        return { error: "O nome do cliente é obrigatório e deve ter mais de 3 caracteres." };
    }

    try {
        await prisma.client.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
                company: company || null,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard/clients");

        return { success: true };

    } catch (error) {
        console.error("ERRO_AO_CRIAR_CLIENTE:", error);
        return { error: "Ocorreu um erro interno ao salvar o cliente." };
    }
}

export async function updateClient(prevState: any, formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;

    try {
        await prisma.client.update({
            where: { id },
            data: { name, company, email, phone }
        });
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (e) {
        return { error: "Erro ao atualizar cliente." };
    }
}

export async function deleteClient(id: string) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        await prisma.client.delete({
            where: { id, userId: session.user.id }
        });
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir cliente." };
    }
}

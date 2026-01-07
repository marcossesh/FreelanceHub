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
    if (!session?.user?.id) return { error: "Sessão expirada." };

    const name = formData.get("name") as string;
    const document = formData.get("document") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;

    if (!name || name.length < 3) {
        return { error: "O nome deve ter mais de 3 caracteres." };
    }

    if (document) {
        const cleanDoc = document.replace(/\D/g, "");

        if (cleanDoc.length < 11) {
            return { error: "O documento deve ter pelo menos 11 dígitos." };
        }

        if (/^(\d)\1+$/.test(cleanDoc)) {
            return { error: "Documento inválido (números repetidos)." };
        }
    }

    try {
        await prisma.client.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
                company: company || null,
                document: document || null,
                userId: session.user.id,
            },
        });
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error) {
        return { error: "Ocorreu um erro interno ao salvar o cliente." };
    }
}

export async function updateClient(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;
    const document = formData.get("document") as string;

    if (document) {
        const cleanDoc = document.replace(/\D/g, "");
        if (cleanDoc.length > 0 && cleanDoc.length < 11) {
            return { error: "Documento inválido. Digite pelo menos 11 números." };
        }
    }
    try {
        await prisma.client.update({
            where: { id },
            data: { name, company, email, phone, document }
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

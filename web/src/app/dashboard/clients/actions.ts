"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/auth-helpers";
import { validateDocument } from "@/lib/validators/document";
import { VALIDATION_RULES } from "@/lib/validation-constants";

export type ClientActionState = {
    success?: boolean;
    error?: string;
} | null;

export async function createClient(
    prevState: ClientActionState,
    formData: FormData
): Promise<ClientActionState> {
    return withAuth(async (session) => {
        const name = formData.get("name") as string;
        const document = formData.get("document") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const company = formData.get("company") as string;

        // Validate name using constants
        if (!name || name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
            return { error: `O nome deve ter mais de ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres.` };
        }

        // Validate document using proper CPF/CNPJ validation
        if (document) {
            const validation = validateDocument(document);
            if (!validation.valid) {
                return { error: `${validation.type || 'Documento'} inválido.` };
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
    });
}

export async function updateClient(prevState: any, formData: FormData) {
    return withAuth(async (session) => {
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const company = formData.get("company") as string;
        const document = formData.get("document") as string;

        // Validate document if provided
        if (document) {
            const validation = validateDocument(document);
            if (!validation.valid) {
                return { error: `${validation.type || 'Documento'} inválido.` };
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
    });
}

export async function deleteClient(id: string) {
    "use server";
    return withAuth(async (session) => {
        try {
            await prisma.client.delete({
                where: { id, userId: session.user.id }
            });

            revalidatePath("/dashboard/clients");
            return { success: true };
        } catch (error) {
            return { error: "Erro ao excluir cliente." };
        }
    });
}

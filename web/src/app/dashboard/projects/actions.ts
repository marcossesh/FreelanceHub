"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";

export async function createProject(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const clientId = formData.get("clientId") as string;
    const status = formData.get("status") as ProjectStatus;

    const value = Number(formData.get("value") || 0);

    try {
        await prisma.project.create({
            data: { name, description, status, clientId, value },
        });

        revalidatePath("/dashboard/projects");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { error: "Falha ao criar o projeto." };
    }
}

export async function updateProject(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as any;
    const clientId = formData.get("clientId") as string;

    const value = Number(formData.get("value") || 0);

    try {
        await prisma.project.update({
            where: { id },
            data: { name, description, status, clientId, value }
        });
        revalidatePath("/dashboard/projects");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao atualizar o projeto." };
    }
}

export async function deleteProject(id: string) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {

        await prisma.project.delete({
            where: {
                id,
                client: { userId: session.user.id }
            }
        });
        revalidatePath("/dashboard/projects");
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir projeto." };
    }
}


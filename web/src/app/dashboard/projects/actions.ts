"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";
import { stripe } from "@/lib/stripe";

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

    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        await prisma.project.update({
            where: {
                id,
                client: {
                    userId: session.user.id
                }
            },
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

export async function getProjectsForExport() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        const projects = await prisma.project.findMany({
            where: { client: { userId: session.user.id } },
            include: { client: { select: { name: true } } },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: projects };
    } catch (error) {
        return { error: "Falha ao buscar dados." };
    }
}

export async function createInvoice(prevState: any, formData: FormData) {
    const session = await auth();
    let stripeCustomer;

    if (!session?.user?.id) return { error: "Não autorizado" };

    const projectId = formData.get("projectId") as string;
    const rawAmount = formData.get("totalAmount") as string;

    // Remove tudo que não for número, vírgula ou ponto, depois troca vírgula por ponto
    const sanitizedAmount = rawAmount.replace(/[^\d,.]/g, '').replace(',', '.');
    // Converta para centavos ANTES de qualquer conta matemática para evitar flutuação
    const amountInCents = Math.round((Number(sanitizedAmount) || 0) * 100);
    const dueDate = new Date(formData.get("dueDate") as string);

    dueDate.setHours(23, 59, 59, 999);

    const now = new Date();
    if (dueDate <= now) {
        // Se a data ainda assim for hoje ou passado, jogamos para daqui a 24h
        dueDate.setDate(now.getDate() + 1);
    }
    const notes = formData.get("notes") as string;

    try {
        const project = await prisma.project.findFirst({
            where: { id: projectId, client: { userId: session.user.id } },
            include: { client: true }
        });

        if (!project) return { error: "Projeto não encontrado." };
        if (!project.client.email) {
            return { error: "O cliente vinculado a este projeto precisa de um e-mail cadastrado para gerar faturas." };
        }

        const existingCustomers = await stripe.customers.list({
            email: project.client.email,
            limit: 1
        });

        if (existingCustomers.data.length > 0) {
            stripeCustomer = existingCustomers.data[0];
        } else {
            stripeCustomer = await stripe.customers.create({
                email: project.client.email,
                name: project.client.name,
            });
        }

        await stripe.invoiceItems.create({
            customer: stripeCustomer.id,
            amount: amountInCents, // Use o valor inteiro calculado
            currency: 'brl',
            description: `Fatura para o projeto: ${project.name}`,
        });

        const stripeInvoice = await stripe.invoices.create({
            customer: stripeCustomer.id,
            collection_method: 'send_invoice',
            due_date: Math.floor(dueDate.getTime() / 1000), // Stripe usa Unix Timestamp
            description: notes || `Fatura para o projeto: ${project.name}`,
        });

        const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);

        await prisma.invoice.create({
            data: {
                invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
                totalAmount: amountInCents / 100,
                dueDate,
                notes,
                projectId,
                status: "PENDING",
                stripeInvoiceId: finalizedInvoice.id,
                stripePaymentUrl: finalizedInvoice.hosted_invoice_url, // URL para o cliente pagar
            },
        });

        revalidatePath(`/dashboard/projects/${projectId}`);
        revalidatePath("/dashboard/invoices");
        return { success: true };

    } catch (error: any) {
        console.error("Erro no Stripe/Prisma:", error);
        return { error: error.message || "Falha ao processar faturamento." };
    }
}

export async function addProjectStep(projectId: string, title: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        // Verifica se o projeto pertence ao usuário
        const project = await prisma.project.findFirst({
            where: { id: projectId, client: { userId: session.user.id } }
        });

        if (!project) return { error: "Projeto não encontrado" };

        await prisma.projectStep.create({
            data: {
                title,
                projectId,
                isCompleted: false
            }
        });

        revalidatePath(`/dashboard/projects/${projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Erro ao criar etapa." };
    }
}

export async function toggleStepStatus(stepId: string, isCompleted: boolean) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        const step = await prisma.projectStep.findUnique({
            where: { id: stepId },
            include: { project: { include: { client: true } } }
        });

        if (!step || step.project.client.userId !== session.user.id) {
            return { error: "Não autorizado ou etapa não encontrada" };
        }

        await prisma.projectStep.update({
            where: { id: stepId },
            data: {
                isCompleted,
                completedAt: isCompleted ? new Date() : null
            }
        });

        revalidatePath(`/dashboard/projects/${step.projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Erro ao atualizar etapa." };
    }
}

export async function generateShareLink(projectId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        const shareToken = crypto.randomUUID();

        await prisma.project.update({
            where: {
                id: projectId,
                client: { userId: session.user.id }
            },
            data: { shareToken }
        });

        revalidatePath(`/dashboard/projects/${projectId}`);

        return { success: true, token: shareToken };
    } catch (error) {
        return { error: "Erro ao gerar link." };
    }
}

export async function deleteProjectStep(stepId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Não autorizado" };

    try {
        const step = await prisma.projectStep.findUnique({
            where: { id: stepId },
            include: { project: { include: { client: true } } }
        });

        if (!step || step.project.client.userId !== session.user.id) {
            return { error: "Não autorizado" };
        }

        await prisma.projectStep.delete({
            where: { id: stepId }
        });

        revalidatePath(`/dashboard/projects/${step.projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Erro ao excluir etapa." };
    }
}
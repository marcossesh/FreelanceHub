"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";
import { withAuth } from "@/lib/auth-helpers";
import { getOrCreateStripeCustomer } from "@/lib/services/stripe-customer.service";
import { createStripeInvoice, voidStripeInvoice } from "@/lib/services/stripe-invoice.service";
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "@/lib/validation-constants";
import { z } from "zod";

// ========================================
// Project Actions
// ========================================

export async function createProject(prevState: any, formData: FormData) {
    return withAuth(async (session) => {
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
    });
}

export async function updateProject(prevState: any, formData: FormData) {
    return withAuth(async (session) => {
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const status = formData.get("status") as any;
        const clientId = formData.get("clientId") as string;
        const value = Number(formData.get("value") || 0);

        try {
            await prisma.project.update({
                where: {
                    id,
                    client: { userId: session.user!.id }
                },
                data: { name, description, status, clientId, value }
            });

            revalidatePath("/dashboard/projects");
            return { success: true };
        } catch (error) {
            return { error: "Erro ao atualizar o projeto." };
        }
    });
}

export async function deleteProject(id: string) {
    "use server";
    return withAuth(async (session) => {
        try {
            await prisma.project.delete({
                where: {
                    id,
                    client: { userId: session.user!.id }
                }
            });

            revalidatePath("/dashboard/projects");
            return { success: true };
        } catch (error) {
            return { error: "Erro ao excluir projeto." };
        }
    });
}

export async function getProjectsForExport() {
    return withAuth(async (session) => {
        try {
            const projects = await prisma.project.findMany({
                where: { client: { userId: session.user!.id } },
                include: { client: { select: { name: true } } },
                orderBy: { createdAt: "desc" }
            });

            return { success: true, data: projects };
        } catch (error) {
            return { error: "Falha ao buscar dados." };
        }
    });
}

// ========================================
// Invoice Actions
// ========================================

const invoiceSchema = z.object({
    projectId: z.string().cuid(),
    totalAmount: z.string()
        .transform(s => s.replace(/[^\d,.]/g, '').replace(',', '.'))
        .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > VALIDATION_RULES.INVOICE.MIN_AMOUNT, {
            message: VALIDATION_MESSAGES.INVOICE.TOO_SMALL
        })
        .refine(val => parseFloat(val) <= VALIDATION_RULES.INVOICE.MAX_AMOUNT, {
            message: VALIDATION_MESSAGES.INVOICE.TOO_LARGE
        }),
    dueDate: z.coerce.date()
        .refine(date => date > new Date(), VALIDATION_MESSAGES.INVOICE.INVALID_DATE),
    notes: z.string().max(VALIDATION_RULES.INVOICE.NOTES_MAX_LENGTH).optional(),
});

export async function createInvoice(prevState: any, formData: FormData) {
    return withAuth(async (session) => {
        let stripeInvoiceId: string | null = null;

        try {
            // 1. Validate input
            const validated = invoiceSchema.parse({
                projectId: formData.get("projectId"),
                totalAmount: formData.get("totalAmount"),
                dueDate: formData.get("dueDate"),
                notes: formData.get("notes") || "",
            });

            const totalAmount = parseFloat(validated.totalAmount);
            const amountInCents = Math.round(totalAmount * 100);
            const dueDate = new Date(validated.dueDate);
            dueDate.setHours(23, 59, 59, 999);

            // 2. Fetch project and validate ownership
            const project = await prisma.project.findFirst({
                where: { id: validated.projectId, client: { userId: session.user.id } },
                include: { client: true }
            });

            if (!project) return { error: "Projeto não encontrado." };
            if (!project.client.email) {
                return { error: "O cliente precisa de um e-mail cadastrado para gerar faturas." };
            }

            // 3. Get or create Stripe customer
            const stripeCustomer = await getOrCreateStripeCustomer(
                project.client.email,
                project.client.name
            );

            // 4. Create Stripe invoice
            const finalizedInvoice = await createStripeInvoice(
                stripeCustomer.id,
                amountInCents,
                dueDate,
                validated.notes || `Fatura para o projeto: ${project.name}`
            );
            stripeInvoiceId = finalizedInvoice.id;

            // 5. Save invoice to database with temporary number
            const createdInvoice = await prisma.invoice.create({
                data: {
                    invoiceNumber: "TEMP", // Temporary, will be updated below
                    totalAmount,
                    dueDate,
                    notes: validated.notes,
                    projectId: validated.projectId,
                    status: "PENDING",
                    stripeInvoiceId: finalizedInvoice.id,
                    stripePaymentUrl: finalizedInvoice.hosted_invoice_url,
                },
            });

            // 6. Update invoice number with sequential format using autoincrement ID
            await prisma.invoice.update({
                where: { id: createdInvoice.id },
                data: {
                    invoiceNumber: `INV-${createdInvoice.id.slice(-6).padStart(6, '0')}`
                }
            });

            revalidatePath(`/dashboard/projects/${validated.projectId}`);
            revalidatePath("/dashboard/invoices");
            return { success: true };

        } catch (error: any) {
            // Rollback: void Stripe invoice if it was created
            if (stripeInvoiceId) {
                await voidStripeInvoice(stripeInvoiceId);
            }

            console.error("[createInvoice] Erro:", {
                code: error.code,
                type: error.type,
                // Don't log sensitive data
            });

            // Sanitized error messages for user
            if (error instanceof z.ZodError) {
                return { error: error.issues[0].message };
            }
            if (error.type?.includes('Stripe')) {
                return { error: "Erro ao processar pagamento. Tente novamente." };
            }
            if (error.code === 'P2002') {
                return { error: "Número de fatura duplicado." };
            }

            return { error: "Erro ao processar faturamento." };
        }
    });
}

// ========================================
// Project Step Actions
// ========================================

export async function addProjectStep(projectId: string, title: string, description?: string, attachmentUrl?: string) {
    return withAuth(async (session) => {
        try {
            const project = await prisma.project.findFirst({
                where: { id: projectId, client: { userId: session.user!.id } }
            });

            if (!project) return { error: "Projeto não encontrado" };

            await prisma.projectStep.create({
                data: {
                    title,
                    description,
                    attachmentUrl,
                    projectId,
                    isCompleted: false
                }
            });

            revalidatePath(`/dashboard/projects/${projectId}`);
            return { success: true };
        } catch (error) {
            return { error: "Erro ao criar etapa." };
        }
    });
}

export async function toggleStepStatus(stepId: string, isCompleted: boolean) {
    return withAuth(async (session) => {
        try {
            const step = await prisma.projectStep.findUnique({
                where: { id: stepId },
                include: { project: { include: { client: true } } }
            });

            if (!step || step.project.client.userId !== session.user!.id) {
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
    });
}

export async function deleteProjectStep(stepId: string) {
    return withAuth(async (session) => {
        try {
            const step = await prisma.projectStep.findUnique({
                where: { id: stepId },
                include: { project: { include: { client: true } } }
            });

            if (!step || step.project.client.userId !== session.user!.id) {
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
    });
}

// ========================================
// Share Link Actions
// ========================================

export async function generateShareLink(projectId: string) {
    return withAuth(async (session) => {
        try {
            const shareToken = crypto.randomUUID();
            const shareTokenExpiry = new Date();
            shareTokenExpiry.setDate(shareTokenExpiry.getDate() + VALIDATION_RULES.SHARE_LINK.EXPIRY_DAYS);

            await prisma.project.update({
                where: {
                    id: projectId,
                    client: { userId: session.user!.id }
                },
                data: {
                    shareToken,
                    shareTokenExpiry
                }
            });

            revalidatePath(`/dashboard/projects/${projectId}`);

            return { success: true, token: shareToken, expiresAt: shareTokenExpiry };
        } catch (error) {
            return { error: "Erro ao gerar link." };
        }
    });
}
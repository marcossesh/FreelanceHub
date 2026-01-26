"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getProjectsForExport() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Não autorizado");

    const projects = await prisma.project.findMany({
        where: { client: { userId: session.user.id } },
        include: {
            client: { select: { name: true } },
            invoices: true,
            steps: {
                orderBy: { createdAt: 'asc' },
                select: { title: true, isCompleted: true, completedAt: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return projects.map(p => ({
        name: p.name,
        clientName: p.client.name,
        status: p.status,
        totalValue: p.value,
        paidValue: p.invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.totalAmount, 0),
        pendingValue: p.invoices.filter(i => i.status !== "PAID").reduce((s, i) => s + i.totalAmount, 0),
        createdAt: p.createdAt,
        description: p.description,
        steps: p.steps // Incluindo os steps no retorno
    }));
}

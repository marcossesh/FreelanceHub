"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateProjectsPDF } from "@/lib/pdf-generator";

export async function exportProjectsPDF() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Não autorizado");
    }

    const projects = await prisma.project.findMany({
        where: {
            client: {
                userId: session.user.id
            }
        },
        include: {
            client: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const projectsForReport = projects.map(p => ({
        name: p.name,
        clientName: p.client.name,
        status: p.status,
        value: p.value,
        createdAt: p.createdAt
    }));

    // Gerar o PDF
    generateProjectsPDF(projectsForReport);

    return { success: true };
}

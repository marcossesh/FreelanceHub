"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"

export async function sendMessage(projectId: string, text: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Não autorizado")

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { client: { select: { userId: true } } },
    })

    if (!project || project.client.userId !== session.user.id) {
        throw new Error("Acesso negado ao chat deste projeto")
    }

    let safeText = text.trim()

    // Mascarar padrão de cartão de crédito
    const hasCardPattern = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/.test(safeText)
    if (hasCardPattern) {
        safeText = safeText.replace(/\b(\d{4})[- ]?\d{4}[- ]?\d{4}[- ]?(\d{4})\b/g, "$1 **** **** $2")
    }

    const message = await prisma.message.create({
        data: {
            text: safeText,
            projectId,
            userId: session.user.id,
        },
        include: {
            user: { select: { name: true, image: true } }
        }
    })

    // 2. Dispara via Pusher (Canal único por projeto)
    await pusherServer.trigger(`project-${projectId}`, "new-message", {
        id: message.id,
        text: message.text,
        userId: message.userId,
        userName: message.user.name,
        userImage: message.user.image,
        createdAt: message.createdAt,
    })

    return message
}


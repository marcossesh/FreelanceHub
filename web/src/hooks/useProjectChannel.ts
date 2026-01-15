// web/src/hooks/useProjectChannel.ts
"use client"

import { useEffect } from "react"
import { pusherClient } from "@/lib/pusher"

type MessageEvent = {
    id: string
    text: string
    userId: string
    userName: string | null
    userImage?: string | null
    createdAt: string
}

export function useProjectChannel(
    projectId: string,
    onMessage: (message: MessageEvent) => void,
) {
    useEffect(() => {
        const channelName = `project-${projectId}`
        const channel = pusherClient.subscribe(channelName)

        const handler = (data: MessageEvent) => {
            onMessage(data)
        }

        channel.bind("new-message", handler)

        return () => {
            channel.unbind("new-message", handler)
            pusherClient.unsubscribe(channelName)
        }
    }, [projectId, onMessage])
}

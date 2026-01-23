// web/src/hooks/useProjectChannel.ts
"use client"

import { pusherClient } from "@/lib/pusher"
import { useEffect, useRef } from "react"

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
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        const channelName = `project-${projectId}`
        const channel = pusherClient.subscribe(channelName)

        const handler = (data: MessageEvent) => {
            if (onMessageRef.current) {
                onMessageRef.current(data);
            }
        }

        channel.bind("new-message", handler)

        return () => {
            channel.unbind("new-message", handler)
            pusherClient.unsubscribe(channelName)
        }
    }, [projectId])
}
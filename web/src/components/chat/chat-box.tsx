"use client"

import { useState } from "react"
import { useProjectChannel } from "@/hooks/useProjectChannel"
import { sendMessage } from "@/app/actions/chat"

export type Message = {
    id: string
    text: string
    userName: string | null
    createdAt: string
}

export function ChatBox({ projectId, initialMessages = [] }: { projectId: string, initialMessages?: Message[] }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [text, setText] = useState("")

    useProjectChannel(projectId, (message) => {
        setMessages((prev) => [...prev, message])
    })

    async function handleSend() {
        if (!text.trim()) return
        await sendMessage(projectId, text)
        setText("")
    }

    return (
        <div className="flex flex-col h-80 border rounded-lg">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((m) => (
                    <div key={m.id} className="text-sm">
                        <span className="font-bold text-gray-900">{m.userName ?? "Usuário"}</span>
                        <span className="ml-2 text-gray-700">{m.text}</span>
                    </div>
                ))}
            </div>
            <div className="border-t p-2 flex gap-2 items-center">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 min-w-0 border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite uma mensagem..."
                />
                <button
                    onClick={handleSend}
                    className="shrink-0 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Enviar
                </button>
            </div>
        </div>
    )
}

"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChatBox, Message } from "./chat-box";

type ChatSheetProps = {
    projectId: string;
    initialMessages: Message[];
};

export function ChatSheet({ projectId, initialMessages }: ChatSheetProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
                    <MessageSquare size={20} />
                    Abrir Chat do Projeto
                </button>
            </SheetTrigger>

            {/* O Chat vai abrir na lateral direita, ocupando toda a altura */}
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full p-0">
                <SheetHeader className="p-6 border-b border-gray-100">
                    <SheetTitle className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <MessageSquare size={18} />
                        </div>
                        Discussão do Projeto
                    </SheetTitle>
                </SheetHeader>

                {/* Wrapper para o ChatBox ocupar o espaço restante */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Passamos uma prop isFullHeight para o ChatBox saber que deve crescer */}
                    <ChatBox
                        projectId={projectId}
                        initialMessages={initialMessages}
                        isFullHeight={true}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ConfirmationModalProps {
    trigger: ReactNode;
    title: string;
    description: ReactNode;
    confirmLabel?: string;
    loadingLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
    trigger,
    title,
    description,
    confirmLabel = "Confirmar",
    loadingLabel = "Processando...",
    isLoading = false,
    onConfirm,
    variant = "danger"
}: ConfirmationModalProps) {

    // Configuração de cores baseada na variante
    const styles = {
        danger: {
            iconBg: "bg-red-50 text-red-600",
            buttonBg: "bg-red-600 hover:bg-red-700",
            icon: <AlertTriangle size={32} />
        },
        warning: {
            iconBg: "bg-orange-50 text-orange-600",
            buttonBg: "bg-orange-600 hover:bg-orange-700",
            icon: <AlertTriangle size={32} />
        },
        info: {
            iconBg: "bg-blue-50 text-blue-600",
            buttonBg: "bg-blue-600 hover:bg-blue-700",
            icon: <AlertTriangle size={32} />
        }
    };

    const currentStyle = styles[variant];

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>

            <Dialog.Portal>
                {/* Overlay */}
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />

                {/* Conteúdo */}
                <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">

                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${currentStyle.iconBg}`}>
                            {currentStyle.icon}
                        </div>

                        <Dialog.Title className="text-xl font-bold text-gray-900">
                            {title}
                        </Dialog.Title>

                        <div className="text-gray-500 leading-relaxed text-sm">
                            {description}
                        </div>

                        <div className="mt-8 flex gap-3 w-full">
                            <Dialog.Close asChild>
                                <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                    Cancelar
                                </button>
                            </Dialog.Close>

                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${currentStyle.buttonBg}`}
                            >
                                {isLoading && <Loader2 size={18} className="animate-spin" />}
                                {isLoading ? loadingLabel : confirmLabel}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

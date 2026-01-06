"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export function DeleteConfirmationModal({
    onConfirm,
    isPending,
    label,
    itemName
}: {
    onConfirm: () => void,
    isPending: boolean,
    label: string,
    itemName: string
}) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50">
                    <Trash2 size={18} />
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                {/* Overlay com Fade In */}
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />

                {/* Conteúdo com Slide Down + Fade */}
                <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">

                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                            <AlertTriangle size={32} />
                        </div>

                        <Dialog.Title className="text-xl font-bold text-gray-900">
                            Confirmar Exclusão
                        </Dialog.Title>

                        <Dialog.Description className="text-gray-500 leading-relaxed">
                            Tem certeza que deseja excluir o {label.toLowerCase()} <strong>{itemName}</strong>? Esta ação é permanente e não poderá ser desfeita.
                        </Dialog.Description>

                        <div className="mt-8 flex gap-3">
                            <Dialog.Close asChild>
                                <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                    Cancelar
                                </button>
                            </Dialog.Close>

                            <button
                                onClick={onConfirm}
                                disabled={isPending}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                {isPending ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

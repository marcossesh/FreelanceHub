"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function DeleteButton({
    id,
    action,
    label,
    itemName,
    redirectTo,
    warningMessage
}: {
    id: string,
    action: any,
    label: string,
    itemName: string,
    redirectTo?: string,
    warningMessage?: string
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleConfirm = () => {
        startTransition(async () => {
            const result = await action(id);
            if (result?.success) {
                toast.success(`${label} excluído com sucesso!`);
                if (redirectTo) router.push(redirectTo);
            } else {
                toast.error(result?.error || "Erro ao excluir.");
            }
        });
    };

    return (
        <ConfirmationModal
            trigger={
                <button className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50">
                    <Trash2 size={18} />
                </button>
            }
            title="Confirmar Exclusão"
            description={
                <div className="space-y-3">
                    <p>
                        Tem certeza que deseja excluir o {label.toLowerCase()} <strong>{itemName}</strong>?
                        Esta ação é permanente.
                    </p>
                    {warningMessage && (
                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 font-medium">
                            ⚠️ Atenção: {warningMessage}
                        </div>
                    )}
                </div>
            }
            confirmLabel="Excluir"
            loadingLabel="Excluindo..."
            isLoading={isPending}
            onConfirm={handleConfirm}
            variant="danger"
        />
    );
}

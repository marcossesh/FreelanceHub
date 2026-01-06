"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";

export function DeleteButton({ id, action, label, itemName, redirectTo }: { id: string, action: any, label: string, itemName: string, redirectTo?: string }) {
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
        <DeleteConfirmationModal
            label={label}
            itemName={itemName}
            isPending={isPending}
            onConfirm={handleConfirm}
        />
    );
}

"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

type ActionState = {
    success?: boolean;
    error?: string;
} | null;

interface ProjectFormProps {
    clients: { id: string; name: string }[];
    initialData?: any;
    action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export function ProjectForm({ clients, initialData, action }: ProjectFormProps) {
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(action, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Projeto atualizado!" : "Projeto criado!");
            router.push("/dashboard/projects");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, initialData, router]);

    return (
        <form action={formAction} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nome do Projeto *</label>
                <input
                    name="name"
                    defaultValue={initialData?.name}
                    required
                    disabled={isPending}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 text-black"
                />
                <input
                    name="value"
                    defaultValue={initialData?.value}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    disabled={isPending}
                    placeholder="Valor a receber pelo projeto"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 text-black"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cliente *</label>
                    <select
                        name="clientId"
                        defaultValue={initialData?.clientId}
                        required
                        disabled={isPending}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all disabled:bg-gray-50 text-black"
                    >
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <select
                        name="status"
                        defaultValue={initialData?.status || "PLANNING"}
                        disabled={isPending}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all text-black"
                    >
                        <option value="PLANNING">Planejamento</option>
                        <option value="IN_PROGRESS">Em andamento</option>
                        <option value="COMPLETED">Concluído</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Descrição</label>
                <textarea
                    name="description"
                    defaultValue={initialData?.description}
                    rows={4}
                    disabled={isPending}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-black"
                />
            </div>

            <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white p-3 rounded-lg flex justify-center items-center gap-2 font-bold transition-all hover:bg-blue-700 disabled:opacity-50">
                {isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isPending ? "Salvando..." : (initialData ? "Atualizar Projeto" : "Criar Projeto")}
            </button>
        </form>
    );
}

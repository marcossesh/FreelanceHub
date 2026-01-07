"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface ActionState {
    success?: boolean;
    error?: string;
}

interface ClientFormProps {
    initialData?: {
        id: string;
        name: string;
        document?: string | null;
        company?: string | null;
        email?: string | null;
        phone?: string | null;
    };
    action: (state: ActionState | null, formData: FormData) => Promise<ActionState>;
}

export function ClientForm({ initialData, action }: ClientFormProps) {
    const [state, formAction, isPending] = useActionState(action, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast.success(initialData ? "Cliente atualizado!" : "Cliente cadastrado!");
            router.push("/dashboard/clients");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, initialData, router]);

    return (
        <form action={formAction} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome Completo *</label>
                    <input
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">CPF ou CNPJ</label>
                    <input
                        name="document"
                        defaultValue={initialData?.document || ""}
                        type="text"
                        minLength={11}
                        placeholder="000.000.000-00"
                        disabled={isPending}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 text-black"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Empresa</label>
                    <input
                        name="company"
                        defaultValue={initialData?.company || ""}
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">E-mail</label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={initialData?.email || ""}
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Telefone</label>
                    <input
                        name="phone"
                        defaultValue={initialData?.phone || ""}
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-50">
                <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50">
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isPending ? "Salvando..." : (initialData ? "Atualizar" : "Salvar")}
                </button>
            </div>
        </form>
    );
}

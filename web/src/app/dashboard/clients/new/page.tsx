"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { createClient } from "../actions";

export default function NewClientPage() {

    const [state, formAction, isPending] = useActionState(createClient, null);

    // Escuta mudanças no estado retornado pela Server Action
    useEffect(() => {
        if (state?.success) {
            toast.success("Cliente cadastrado com sucesso!");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Cabeçalho com Voltar */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/clients"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
                    <p className="text-gray-500 text-sm">Preencha os dados abaixo para o cadastro.</p>
                </div>
            </div>

            <form action={formAction} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Nome Completo *</label>
                        <input
                            name="name"
                            required
                            disabled={isPending}
                            placeholder="Ex: João Silva"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Empresa</label>
                        <input
                            name="company"
                            disabled={isPending}
                            placeholder="Ex: Tech Solutions"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">E-mail de Contato</label>
                    <input
                        name="email"
                        type="email"
                        disabled={isPending}
                        placeholder="cliente@email.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Telefone / WhatsApp</label>
                    <input
                        name="phone"
                        disabled={isPending}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 text-gray-900 placeholder:text-gray-500"
                    />
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-50">
                    <Link
                        href="/dashboard/clients"
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all font-bold shadow-md shadow-blue-100"
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Salvar Cliente
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

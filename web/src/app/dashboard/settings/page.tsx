"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { updateProfile } from "@/app/actions/user";
import { Save, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {

    const { data: session, update } = useSession();
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(updateProfile, null);
    const lastUpdateRef = useRef<string | null>(null);

    useEffect(() => {
        if (state?.success && state.timestamp !== lastUpdateRef.current) {
            lastUpdateRef.current = state.timestamp;

            toast.success("Perfil atualizado!");

            update({ name: state.name }).then(() => {
                router.refresh();
            });
        }

        if (state?.error) toast.error(state.error);
    }, [state, update, router]);

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-500 text-sm">Gerencie suas informações de conta.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <form action={formAction} className="p-8 space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                            {session?.user?.name?.[0] || <User size={32} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Seu Perfil</h3>
                            <p className="text-gray-500 text-sm">Essas informações são visíveis no seu dashboard.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Nome de Exibição</label>
                            <input
                                name="name"
                                defaultValue={session?.user?.name || ""}
                                placeholder="Seu nome"
                                required
                                minLength={3}
                                maxLength={50}
                                disabled={isPending}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black disabled:bg-gray-50"
                            />
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                                <Mail size={12} /> E-mail (Não alterável)
                            </div>
                            <p className="text-gray-900 font-medium text-sm">{session?.user?.email}</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isPending ? "Salvando..." : (
                                <>
                                    <Save size={18} />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}   

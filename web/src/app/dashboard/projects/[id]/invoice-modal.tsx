"use client";

import { useState } from "react";
import { createInvoice } from "@/app/dashboard/projects/actions";
import { X, Receipt } from "lucide-react";

export function InvoiceModal({ projectId }: { projectId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [dateValue, setDateValue] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await createInvoice(null, formData);

        if (result.success) {
            setIsOpen(false);
            setDateValue("");
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bold text-sm shadow-sm"
        >
            <Receipt size={18} /> Nova Fatura
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Gerar Nova Fatura</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="hidden" name="projectId" value={projectId} />

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Valor da Fatura (R$)</label>
                        <input
                            name="totalAmount"
                            type="number"
                            step="0.01"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 text-black"
                            placeholder="0,00"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Data de Vencimento</label>
                        <input
                            name="dueDate"
                            type="date"
                            required
                            onChange={(e) => setDateValue(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none ${dateValue ? "text-black" : "text-gray-500"}`}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notas (Opcional)</label>
                        <textarea
                            name="notes"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none placeholder-gray-500 text-black"
                            placeholder="Ex: Primeira parcela do projeto..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Gerando..." : "Confirmar e Gerar Fatura"}
                    </button>
                </form>
            </div>
        </div>
    );
}

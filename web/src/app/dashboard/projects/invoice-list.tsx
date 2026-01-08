import { Invoice } from "@prisma/client";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface InvoiceWithProject extends Invoice {
    project?: {
        name: string;
        client: {
            name: string;
        }
    } | null;
}

export function InvoiceList({ invoices }: { invoices: InvoiceWithProject[] }) {
    if (invoices.length === 0) {
        return (
            <div className="bg-gray-50 p-8 text-center rounded-xl border border-dashed border-gray-200 mt-6">
                <p className="text-gray-500 text-sm">Nenhuma fatura gerada para este projeto ainda.</p>
            </div>
        );
    }

    const showProject = invoices.some(i => i.project);

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Faturas do Projeto
            </h3>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Número</th>
                            {showProject && <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Projeto</th>}
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Vencimento</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Valor</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-gray-700">{invoice.invoiceNumber}</td>
                                {invoice.project && (
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium">{invoice.project.name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">
                                                {invoice.project.client.name}
                                            </span>
                                        </div>
                                    </td>
                                )}
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.totalAmount)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${invoice.status === 'PAID' ? 'bg-green-50 text-green-700' :
                                        invoice.status === 'OVERDUE' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                                        }`}>
                                        {invoice.status === 'PAID' ? <CheckCircle size={12} /> :
                                            invoice.status === 'OVERDUE' ? <AlertCircle size={12} /> : <Clock size={12} />}
                                        {invoice.status === 'PENDING' ? 'Pendente' :
                                            invoice.status === 'PAID' ? 'Pago' :
                                                invoice.status === 'CANCELLED' ? 'Cancelado' : 'Atrasado'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

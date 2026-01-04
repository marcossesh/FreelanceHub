import { Mail, Phone, Building2 } from "lucide-react";

export function ClientTable({ clients }: { clients: any[] }) {
    if (clients.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium">Nenhum cliente cadastrado</h3>
                <p className="text-gray-500 text-sm">Comece adicionando sua primeira empresa ou contato.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Nome / Empresa</th>
                        <th className="px-6 py-4">Contato</th>
                        <th className="px-6 py-4 text-center">Projetos</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-xs text-gray-500">{client.company || "Pessoa Física"}</div>
                            </td>
                            <td className="px-6 py-4 space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} /> {client.email || "-"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} /> {client.phone || "-"}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                                    {client._count.projects}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-gray-600 font-medium text-sm">Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

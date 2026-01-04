import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ClientTable } from "@/components/dashboard/client-table";

export default async function ClientsPage() {
    const session = await auth();

    // Busca apenas os clientes que pertencem ao usuário logado
    const clients = await prisma.client.findMany({
        where: { userId: session?.user?.id },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { projects: true } } } // Conta quantos projetos cada cliente tem
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                    <p className="text-gray-500 text-sm">Gerencie seus contatos e empresas.</p>
                </div>

                <Link
                    href="/dashboard/clients/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Novo Cliente
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <ClientTable clients={clients} />
            </div>
        </div>
    );
}

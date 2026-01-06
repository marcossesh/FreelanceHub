import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Users, Briefcase, Clock, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();

    // Busca estatísticas em paralelo (Alta Performance)
    const [clientCount, projectCount, activeProjects] = await Promise.all([
        prisma.client.count({ where: { userId: session?.user?.id } }),
        prisma.project.count({ where: { client: { userId: session?.user?.id } } }),
        prisma.project.count({
            where: {
                client: { userId: session?.user?.id },
                status: "IN_PROGRESS"
            }
        }),
    ]);

    const stats = [
        { label: "Total de Clientes", value: clientCount, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total de Projetos", value: projectCount, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Em Andamento", value: activeProjects, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm">Olá, {session?.user?.name}. Aqui está o resumo do seu trabalho.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Espaço para um futuro gráfico ou lista de projetos recentes */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Próximos Passos</h3>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <CheckCircle size={18} className="text-green-500" />
                        <span>Continue cadastrando seus clientes para ter um histórico completo.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

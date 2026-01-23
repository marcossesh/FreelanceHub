import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Users, Briefcase, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const [clientCount, projectCount, invoiceStats] = await Promise.all([
        prisma.client.count({ where: { userId } }),
        prisma.project.count({ where: { client: { userId } } }),
        prisma.invoice.groupBy({
            by: ['status'],
            where: {
                project: { client: { userId } }
            },
            _sum: { totalAmount: true }
        }),
    ]);

    const paidAmount = invoiceStats.find(s => s.status === 'PAID')?._sum.totalAmount || 0;
    const pendingAmount = invoiceStats.find(s => s.status === 'PENDING')?._sum.totalAmount || 0;

    const stats = [
        {
            label: "Ganhos Reais",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(paidAmount),
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            label: "A Receber",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pendingAmount),
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Total de Projetos",
            value: projectCount,
            icon: Briefcase,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm">Olá, {session?.user?.name}. Aqui está o resumo do seu faturamento real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
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

            {/* Lista de faturas recentes ou tarefas poderia entrar aqui */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Próximos Passos</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-white p-4 rounded-lg border border-gray-200">
                    <CheckCircle size={18} className="text-gray-400" />
                    <span>Seu sistema de faturamento automático está ativo. Acompanhe os pagamentos em tempo real.</span>
                </div>
            </div>
        </div>
    );
}

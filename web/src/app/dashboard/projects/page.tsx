import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Briefcase, Calendar } from "lucide-react";
import { ExportButton } from "@/components/dashboard/projects/export-button";
import { StatusPieChart } from "@/components/dashboard/projects/status-chart";
import { RevenueBarChart } from "@/components/dashboard/projects/revenue-chart";

export default async function ProjectsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const projects = await prisma.project.findMany({
        where: {
            client: { userId: session.user.id }
        },
        include: {
            client: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    const statusData = [
        { name: "Planejamento", value: projects.filter(p => p.status === "PLANNING").length },
        { name: "Em Progresso", value: projects.filter(p => p.status === "IN_PROGRESS").length },
        { name: "Finalizados", value: projects.filter(p => p.status === "COMPLETED").length },
    ].filter(d => d.value > 0);

    const revenueData = [
        {
            name: "Em Aberto",
            total: projects
                .filter(p => p.status !== "COMPLETED")
                .reduce((acc, p) => acc + (p.value || 0), 0)
        },
        {
            name: "Faturado",
            total: projects
                .filter(p => p.status === "COMPLETED")
                .reduce((acc, p) => acc + (p.value || 0), 0)
        },
    ];

    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
                    <p className="text-gray-500 text-sm">Acompanhe o andamento dos seus trabalhos.</p>
                </div>
                <div className="flex gap-3">
                    <ExportButton projects={projects} />
                    <Link
                        href="/dashboard/projects/new"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-sm"
                    >
                        <Plus size={18} /> Novo Projeto
                    </Link>
                </div>
            </div>

            {/* Dashboard Visual */}
            {projects.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StatusPieChart data={statusData} />
                    <RevenueBarChart data={revenueData} />
                </div>
            )}

            {/* Lista de Projetos */}
            {projects.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                    <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Você ainda não tem projetos criados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${project.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                                    project.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {project.status === "PLANNING" ? "Planejamento" :
                                        project.status === "IN_PROGRESS" ? "Em Progresso" : "Finalizado"}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <p className="text-sm text-gray-500 line-clamp-2">{project.description || "Sem descrição."}</p>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">Cliente</span>
                                    <span className="text-sm font-semibold text-gray-700">{project.client.name}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">Valor Estimado</span>
                                    <span className="text-lg font-black text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.value)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                    <Calendar size={14} />
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                                <Link
                                    href={`/dashboard/projects/${project.id}`}
                                    className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors"
                                >
                                    Ver Detalhes
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Briefcase, Calendar } from "lucide-react";


import { ExportButton } from "@/components/dashboard/projects/export-button";

export default async function ProjectsPage() {
    const session = await auth();

    const projects = await prisma.project.findMany({
        where: {
            client: { userId: session?.user?.id }
        },
        include: {
            client: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
                    <p className="text-gray-500 text-sm">Acompanhe o andamento dos seus trabalhos.</p>
                </div>
                <div className="flex gap-3">
                    <ExportButton projects={projects} />
                    <Link
                        href="/dashboard/projects/new"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        <Plus size={18} /> Novo Projeto
                    </Link>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
                    <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Você ainda não tem projetos criados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-gray-900 leading-tight">{project.name}</h3>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${project.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                                    project.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600 line-clamp-2">{project.description || "Sem descrição."}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="font-semibold text-gray-600">Cliente:</span> {project.client.name}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                                <Link
                                    href={`/dashboard/projects/${project.id}`}
                                    className="text-blue-600 font-bold hover:underline"
                                >Ver Detalhes</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

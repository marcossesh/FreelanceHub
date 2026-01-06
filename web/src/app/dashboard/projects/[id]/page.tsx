import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Briefcase, Tag } from "lucide-react";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { deleteProject } from "@/app/dashboard/projects/actions";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            client: true
        }
    });

    if (!project || project.client.userId !== session?.user?.id) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Botão Voltar */}
            <Link href="/dashboard/projects" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Voltar para Projetos</span>
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header do Projeto */}
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Projeto</span>
                            <h1 className="text-3xl font-black text-gray-900">{project.name}</h1>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {project.status}
                        </span>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Coluna Principal: Descrição */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <Briefcase size={16} /> Descrição do Escopo
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {project.description || "Este projeto ainda não possui uma descrição detalhada."}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar de Info: Cliente e Datas */}
                    <div className="space-y-8 bg-gray-50/30 p-6 rounded-xl border border-gray-100">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <User size={14} /> Cliente Responsável
                            </h3>
                            <div className="font-bold text-gray-900">{project.client.name}</div>
                            <div className="text-sm text-gray-500">{project.client.company || "Pessoa Física"}</div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <Calendar size={14} /> Data de Início
                            </h3>
                            <div className="text-sm text-gray-900 font-medium">
                                {new Date(project.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: 'long', year: 'numeric'
                                })}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link
                                href={`/dashboard/projects/${project.id}/edit`}
                                className="block w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold text-center hover:bg-black transition-colors"
                            >Editar Projeto</Link>
                            <DeleteButton id={project.id} itemName={project.name} action={deleteProject} label="Projeto" redirectTo="/dashboard/projects" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

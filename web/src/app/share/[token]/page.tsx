import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle, Circle, Clock, FileText, DollarSign, Calendar, ExternalLink, Paperclip, Mail } from "lucide-react";
import Link from "next/link";

export default async function PublicProjectPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;

    const project = await prisma.project.findUnique({
        where: { shareToken: token },
        include: {
            client: {
                include: { user: true }
            },
            steps: { orderBy: { createdAt: 'asc' } },
            invoices: { orderBy: { dueDate: 'asc' } }
        }
    });

    if (!project) {
        return notFound();
    }

    // Cálculos de Progresso
    const totalSteps = project.steps.length;
    const completedSteps = project.steps.filter(s => s.isCompleted).length;
    const progressPercentage = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

    // Cálculos Financeiros
    const totalInvoiced = project.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalPaid = project.invoices.filter(i => i.status === 'PAID').reduce((acc, inv) => acc + inv.totalAmount, 0);
    const pendingAmount = totalInvoiced - totalPaid;

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100">
            {/* Header Simples */}
            <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                        <span className="font-bold text-gray-900 tracking-tight">FreelanceHub</span>
                    </div>
                    <a
                        href={`mailto:${project.client.user.email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors"
                    >
                        <Mail size={16} />
                        Fale com o Freelancer
                    </a>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 md:p-12 space-y-12">

                {/* Hero Section */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">
                                Acompanhamento de Projeto
                            </span>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                {project.name}
                            </h1>
                            <p className="text-gray-500 mt-2 max-w-2xl text-lg">
                                {project.description || "Sem descrição disponível."}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider self-start md:self-center
                            ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-200 text-gray-600'}`}>
                            {project.status === 'IN_PROGRESS' ? 'Em Andamento' :
                                project.status === 'COMPLETED' ? 'Concluído' : 'Planejamento'}
                        </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-3xl font-bold text-gray-900">{progressPercentage}%</span>
                                <span className="text-sm text-gray-400 ml-2 font-medium">Concluído</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400">
                                {completedSteps} de {totalSteps} etapas
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Coluna Esquerda: Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={20} className="text-blue-500" /> Linha do Tempo
                        </h2>

                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
                            {project.steps.length === 0 ? (
                                <p className="text-gray-400 italic pl-8">Nenhuma etapa cadastrada ainda.</p>
                            ) : (
                                project.steps.map((step, index) => (
                                    <div key={step.id} className="relative pl-8">
                                        {/* Bolinha da Timeline */}
                                        <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-4 border-white 
                                            ${step.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        </div>

                                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`font-bold text-lg ${step.isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {step.title}
                                                </h3>
                                                {step.isCompleted && (
                                                    <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                                                        Concluído
                                                    </span>
                                                )}
                                            </div>

                                            {step.description && (
                                                <p className="text-gray-600 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                                                    {step.description}
                                                </p>
                                            )}

                                            {/* Meta Dados (Datas e Anexos) */}
                                            <div className="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-gray-50">
                                                {step.completedAt ? (
                                                    <span className="text-green-600 font-medium flex items-center gap-1">
                                                        <Calendar size={12} /> Finalizado em {new Date(step.completedAt).toLocaleDateString('pt-BR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 flex items-center gap-1">
                                                        <Calendar size={12} /> Criado em {new Date(step.createdAt).toLocaleDateString('pt-BR')}
                                                    </span>
                                                )}

                                                {step.attachmentUrl && (
                                                    <a href={step.attachmentUrl} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline font-bold">
                                                        <Paperclip size={12} /> Ver Anexo <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Coluna Direita: Financeiro */}
                    <div className="space-y-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <DollarSign size={20} className="text-green-500" /> Faturas e Pagamentos
                        </h2>

                        {/* Cards Resumo */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-bold uppercase">Pago</span>
                                <div className="text-lg font-bold text-green-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs text-gray-400 font-bold uppercase">Pendente</span>
                                <div className="text-lg font-bold text-orange-500">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pendingAmount)}
                                </div>
                            </div>
                        </div>

                        {/* Lista de Faturas */}
                        <div className="space-y-3">
                            {project.invoices.length === 0 ? (
                                <p className="text-sm text-gray-400 bg-white p-4 rounded-xl border border-gray-100 text-center">
                                    Nenhuma fatura gerada.
                                </p>
                            ) : (
                                project.invoices.map(inv => (
                                    <div key={inv.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-800 text-sm">{inv.invoiceNumber}</span>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase 
                                                ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                    inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'}`}>
                                                {inv.status === 'PAID' ? 'Pago' : inv.status === 'PENDING' ? 'Pendente' : 'Atrasado'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div>
                                                <div className="text-xs text-gray-400">Vencimento</div>
                                                <div className="text-sm font-medium text-gray-700">
                                                    {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-gray-900">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.totalAmount)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botão de Pagar (Só se tiver link e estiver pendente) */}
                                        {inv.stripePaymentUrl && inv.status !== 'PAID' && (
                                            <a
                                                href={inv.stripePaymentUrl}
                                                target="_blank"
                                                className="mt-3 block w-full py-2 bg-gray-900 text-white text-center text-xs font-bold rounded-lg hover:bg-black transition-colors"
                                            >
                                                Pagar Fatura
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

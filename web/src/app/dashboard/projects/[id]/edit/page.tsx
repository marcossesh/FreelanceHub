import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/app/dashboard/projects/project-form";
import { updateProject } from "../../actions";
import { notFound } from "next/navigation";
import { InvoiceModal } from "@/app/dashboard/projects/[id]/invoice-modal";
import { InvoiceList } from "@/app/dashboard/projects/invoice-list";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const [project, clients] = await Promise.all([
        prisma.project.findUnique({
            where: { id },
            include: {
                client: true,
                invoices: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        }),
        prisma.client.findMany({ where: { userId: session?.user?.id } })
    ]);

    if (!project) notFound();

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20"> {/* pb-20 para não colar no final */}
            <h1 className="text-2xl font-bold text-black">Editar Projeto</h1>
            <ProjectForm initialData={project} clients={clients} action={updateProject} />

            <div className="pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Gestão de Faturamento</h2>
                    <InvoiceModal projectId={project.id} />
                </div>

                {/* ADICIONE ESTA LINHA: */}
                <InvoiceList invoices={project.invoices} />
            </div>
        </div>
    );
}
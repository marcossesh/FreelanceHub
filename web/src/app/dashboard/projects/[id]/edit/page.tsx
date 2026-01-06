import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/app/dashboard/projects/project-form";
import { updateProject } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const [project, clients] = await Promise.all([
        prisma.project.findUnique({ where: { id } }),
        prisma.client.findMany({ where: { userId: session?.user?.id } })
    ]);

    if (!project) notFound();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-black">Editar Projeto</h1>
            <ProjectForm initialData={project} clients={clients} action={updateProject} />
        </div>
    );
}

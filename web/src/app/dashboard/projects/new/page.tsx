import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../project-form";

import { createProject } from "../actions";

export default async function NewProjectPage() {
    const session = await auth();

    const clients = await prisma.client.findMany({
        where: { userId: session?.user?.id },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });

    return <ProjectForm clients={clients} action={createProject} />;
}

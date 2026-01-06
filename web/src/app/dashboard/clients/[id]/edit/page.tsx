import { prisma } from "@/lib/prisma";
import { ClientForm } from "@/components/dashboard/client-form";
import { updateClient } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const client = await prisma.client.findUnique({
        where: { id }
    });

    if (!client) notFound();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
            <ClientForm initialData={client} action={updateClient} />
        </div>
    );
}

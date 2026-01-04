"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
    "use server";

    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;

    await prisma.client.create({
        data: {
            name,
            email,
            phone,
            company,
            userId: session.user.id,
        },
    });

    // Limpa o cache da página de listagem para mostrar o novo cliente
    revalidatePath("/dashboard/clients");
    redirect("/dashboard/clients");
}

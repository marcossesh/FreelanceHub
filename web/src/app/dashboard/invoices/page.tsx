import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InvoiceList } from "@/app/dashboard/projects/invoice-list";
import { Receipt } from "lucide-react";

export default async function InvoicesPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const invoices = await prisma.invoice.findMany({
        where: {
            project: {
                client: { userId: session.user.id }
            }
        },
        include: {
            project: {
                select: {
                    name: true,
                    client: { select: { name: true } }
                }
            }
        },
        orderBy: { dueDate: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Centro Financeiro</h1>
                <p className="text-gray-500 text-sm">Gerencie todas as suas faturas em um só lugar.</p>
            </div>

            {invoices.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                    <Receipt className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Você ainda não gerou nenhuma fatura.</p>
                </div>
            ) : (
                <InvoiceList invoices={invoices} />
            )}
        </div>
    );
}

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "invoice.paid") {
        const invoice = event.data.object;
        
        await prisma.invoice.update({
            where: { stripeInvoiceId: invoice.id },
            data: { status: "PAID" },
        });

    }

    if (event.type === "invoice.payment_failed") {
        const invoice = event.data.object;
        await prisma.invoice.update({
            where: { stripeInvoiceId: invoice.id },
            data: { status: "OVERDUE" },
        });
    }

    return new NextResponse(null, { status: 200 });
}

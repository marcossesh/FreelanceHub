// web/src/lib/services/stripe-invoice.service.ts
import { stripe } from "@/lib/stripe";

/**
 * Creates, finalizes and returns Stripe invoice
 * @param customerId Stripe customer ID
 * @param amountInCents Total amount in cents (e.g., 5000 = R$ 50.00)
 * @param dueDate Invoice due date
 * @param description Invoice description
 * @returns Finalized Stripe Invoice
 */
export async function createStripeInvoice(
    customerId: string,
    amountInCents: number,
    dueDate: Date,
    description: string
) {
    // Add line item to customer's invoice
    await stripe.invoiceItems.create({
        customer: customerId,
        amount: amountInCents,
        currency: 'brl',
        description,
    });

    // Create invoice
    const invoice = await stripe.invoices.create({
        customer: customerId,
        collection_method: 'send_invoice',
        due_date: Math.floor(dueDate.getTime() / 1000), // Unix timestamp
        description,
    });

    // Finalize invoice (makes it ready for payment)
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    return finalizedInvoice;
}

/**
 * Voids/cancels a Stripe invoice (used for rollback)
 * @param invoiceId Stripe invoice ID
 */
export async function voidStripeInvoice(invoiceId: string) {
    try {
        await stripe.invoices.voidInvoice(invoiceId);
    } catch (error) {
        // Log but don't throw - this is best-effort cleanup
        console.error('[voidStripeInvoice] Failed to void invoice:', invoiceId, error);
    }
}

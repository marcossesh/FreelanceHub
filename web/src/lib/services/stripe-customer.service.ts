// web/src/lib/services/stripe-customer.service.ts
import { stripe } from "@/lib/stripe";

/**
 * Gets existing Stripe customer or creates new one
 * @param email Customer email
 * @param name Customer name
 * @returns Stripe Customer object
 */
export async function getOrCreateStripeCustomer(email: string, name: string) {
    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
        email,
        limit: 1
    });

    if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
    }

    // Create new customer
    return stripe.customers.create({
        email,
        name,
    });
}

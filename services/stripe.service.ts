import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) throw new Error('Stripe api key was not provided');

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
  typescript: true,
});

export default stripe;

export async function getSubscriptionType(customerId: string | undefined) {
  if (!customerId) return 'free';

  try {
    const stripeCustomer: any = await stripe.customers.retrieve(customerId, {
      expand: ['subscriptions'],
    });

    const subscription = stripeCustomer.subscriptions.data[0];
    if (!subscription) return 'free';

    const productId = subscription.plan.product;
    const product = await stripe.products.retrieve(productId);

    return product.metadata.name as string;
  } catch (e) {
    return 'free';
  }
}

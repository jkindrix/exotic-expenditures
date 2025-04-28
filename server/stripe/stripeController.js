/**
 * Stripe API Controller
 * Manages payment methods and subscriptions for recurring contributions
 */

const { validationResult } = require('express-validator');
const { stripe, handleStripeError } = require('../config/stripe');
const logger = require('../utils/logger');

/**
 * Create a payment method with bank account details
 */
exports.createPaymentMethod = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, accountId } = req.body;

    // In a real implementation, fetch account details from your database:
    // const accountDetails = await Account.findOne({ userId, accountId });
    
    // For this example, we'll simulate it:
    const accountDetails = {
      account_number: '000123456789',
      routing_number: '110000000',
      account_holder_name: 'John Doe'
    };

    // Create payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'us_bank_account',
      us_bank_account: {
        account_number: accountDetails.account_number,
        routing_number: accountDetails.routing_number,
        account_holder_type: 'individual',
        account_holder_name: accountDetails.account_holder_name
      }
    });

    // Create a customer or retrieve existing one
    // In a real app, you'd store the customer ID with the user
    let customer;
    
    // Check if customer exists
    // const existingCustomer = await Customer.findOne({ userId });
    const existingCustomer = null; // Simulated for example
    
    if (existingCustomer) {
      customer = await stripe.customers.retrieve(existingCustomer.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        name: accountDetails.account_holder_name,
        metadata: { userId }
      });
      
      // Save customer ID to database
      // await Customer.create({ userId, stripeCustomerId: customer.id });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }
    });

    logger.info('Created Stripe payment method', {
      userId,
      paymentMethodId: paymentMethod.id,
      customerId: customer.id
    });

    return res.json({
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        last4: paymentMethod.us_bank_account.last4,
        bank_name: paymentMethod.us_bank_account.bank_name,
        account_type: paymentMethod.us_bank_account.account_type
      },
      customerId: customer.id
    });
  } catch (error) {
    return next(handleStripeError(error, 'creating payment method'));
  }
};

/**
 * Create a subscription for recurring contributions
 */
exports.createSubscription = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, paymentMethodId, amount, frequency, startDate } = req.body;

    // Convert startDate to Unix timestamp
    const startDateTimestamp = new Date(startDate).getTime() / 1000;

    // Calculate the interval based on frequency
    let interval = 'month';
    let intervalCount = 1;
    
    if (frequency === 'biweekly') {
      interval = 'week';
      intervalCount = 2;
    }

    // Create or retrieve customer
    // In a real app, you'd fetch this from your database
    // const customer = await Customer.findOne({ userId });
    // const customerId = customer.stripeCustomerId;
    
    // For this example, we'll simulate it:
    const customerId = 'cus_example123';

    // Create a product for the contribution
    const product = await stripe.products.create({
      name: 'Exotic Expenditures Membership Contribution',
      metadata: {
        type: 'membership_contribution'
      }
    });

    // Create a price for the contribution
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      recurring: {
        interval,
        interval_count: intervalCount
      }
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.id }],
      default_payment_method: paymentMethodId,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['us_bank_account'],
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId,
        contributionType: 'membership',
        frequency
      },
      billing_cycle_anchor: startDateTimestamp
    });

    // In a real app, store subscription details in your database
    // await Subscription.create({ ... });

    logger.info('Created Stripe subscription', {
      userId,
      subscriptionId: subscription.id,
      amount,
      frequency
    });

    return res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        amount: amount,
        frequency: frequency,
        next_payment_date: new Date(subscription.current_period_end * 1000).toISOString()
      }
    });
  } catch (error) {
    return next(handleStripeError(error, 'creating subscription'));
  }
};

/**
 * Update an existing subscription
 */
exports.updateSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const { amount, frequency } = req.body;

    // Fetch the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Get the subscription item ID
    const subscriptionItemId = subscription.items.data[0].id;

    // For changing amount, we need to create a new price
    if (amount) {
      // Create a new price
      const price = await stripe.prices.create({
        product: subscription.items.data[0].price.product,
        unit_amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        recurring: {
          interval: subscription.items.data[0].price.recurring.interval,
          interval_count: subscription.items.data[0].price.recurring.interval_count
        }
      });

      // Update the subscription with the new price
      await stripe.subscriptionItems.update(subscriptionItemId, {
        price: price.id
      });
    }

    // For changing frequency, more complex steps are needed
    if (frequency) {
      // Calculate the new interval parameters
      let interval = 'month';
      let intervalCount = 1;
      
      if (frequency === 'biweekly') {
        interval = 'week';
        intervalCount = 2;
      }

      // Create a new price with updated frequency
      const price = await stripe.prices.create({
        product: subscription.items.data[0].price.product,
        unit_amount: subscription.items.data[0].price.unit_amount,
        currency: 'usd',
        recurring: {
          interval,
          interval_count: intervalCount
        }
      });

      // Update the subscription with the new price
      await stripe.subscriptionItems.update(subscriptionItemId, {
        price: price.id
      });

      // Update metadata
      await stripe.subscriptions.update(subscriptionId, {
        metadata: {
          ...subscription.metadata,
          frequency
        }
      });
    }

    // Get the updated subscription
    const updatedSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    logger.info('Updated Stripe subscription', {
      subscriptionId,
      amount,
      frequency
    });

    return res.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        current_period_start: updatedSubscription.current_period_start,
        current_period_end: updatedSubscription.current_period_end,
        amount: updatedSubscription.items.data[0].price.unit_amount / 100, // Convert cents to dollars
        frequency: updatedSubscription.metadata.frequency,
        next_payment_date: new Date(updatedSubscription.current_period_end * 1000).toISOString()
      }
    });
  } catch (error) {
    return next(handleStripeError(error, 'updating subscription'));
  }
};

/**
 * Pause a subscription
 */
exports.pauseSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    // Pause subscription by updating it
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: 'void'
      }
    });

    logger.info('Paused Stripe subscription', {
      subscriptionId
    });

    return res.json({
      success: true,
      status: subscription.status,
      paused: true
    });
  } catch (error) {
    return next(handleStripeError(error, 'pausing subscription'));
  }
};

/**
 * Resume a paused subscription
 */
exports.resumeSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    // Resume subscription by removing pause_collection
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: ''
    });

    logger.info('Resumed Stripe subscription', {
      subscriptionId
    });

    return res.json({
      success: true,
      status: subscription.status,
      paused: false
    });
  } catch (error) {
    return next(handleStripeError(error, 'resuming subscription'));
  }
};

/**
 * Cancel a subscription
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    // Cancel the subscription
    const subscription = await stripe.subscriptions.del(subscriptionId);

    logger.info('Cancelled Stripe subscription', {
      subscriptionId
    });

    return res.json({
      success: true,
      status: subscription.status,
      canceled_at: subscription.canceled_at
    });
  } catch (error) {
    return next(handleStripeError(error, 'canceling subscription'));
  }
};

/**
 * Handle webhooks from Stripe
 */
exports.handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    logger.info('Received Stripe webhook', {
      type: event.type,
      id: event.id
    });

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      // Add more event types as needed
    }

    // Return a 200 success response
    return res.json({ received: true });
  } catch (error) {
    logger.error('Error processing Stripe webhook', {
      error: error.message,
      headers: req.headers
    });
    
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${error.message}`
    });
  }
};

/**
 * Handle payment intent succeeded events
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  // Record the successful payment in your database
  logger.info('Payment succeeded', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    customerId: paymentIntent.customer
  });

  // Update subscription status in your database
  // Create a transaction record
  // Send a receipt to the customer
}

/**
 * Handle payment intent failed events
 */
async function handlePaymentIntentFailed(paymentIntent) {
  logger.warn('Payment failed', {
    paymentIntentId: paymentIntent.id,
    error: paymentIntent.last_payment_error,
    customerId: paymentIntent.customer
  });

  // Update subscription status in your database
  // Send a notification to the customer
}

/**
 * Handle invoice payment succeeded events
 */
async function handleInvoicePaymentSucceeded(invoice) {
  logger.info('Invoice payment succeeded', {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription,
    amount: invoice.amount_paid / 100,
    customerId: invoice.customer
  });

  // Update subscription status in your database
  // Create a transaction record
  // Send a receipt to the customer
}

/**
 * Handle invoice payment failed events
 */
async function handleInvoicePaymentFailed(invoice) {
  logger.warn('Invoice payment failed', {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription,
    customerId: invoice.customer
  });

  // Update subscription status in your database
  // Send a notification to the customer
}

/**
 * Handle subscription created events
 */
async function handleSubscriptionCreated(subscription) {
  logger.info('Subscription created', {
    subscriptionId: subscription.id,
    status: subscription.status,
    customerId: subscription.customer
  });

  // Update subscription status in your database
}

/**
 * Handle subscription updated events
 */
async function handleSubscriptionUpdated(subscription) {
  logger.info('Subscription updated', {
    subscriptionId: subscription.id,
    status: subscription.status,
    customerId: subscription.customer
  });

  // Update subscription status in your database
}

/**
 * Handle subscription deleted events
 */
async function handleSubscriptionDeleted(subscription) {
  logger.info('Subscription deleted', {
    subscriptionId: subscription.id,
    status: subscription.status,
    customerId: subscription.customer
  });

  // Update subscription status in your database
  // Send a notification to the customer
}
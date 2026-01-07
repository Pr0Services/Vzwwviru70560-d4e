/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — PRICING HOOK
 * Phase 5: Monetization System
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback } from 'react';

export interface Subscription {
  id: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function usePricing() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = useCallback(async (
    priceId: string,
    billingPeriod: 'monthly' | 'yearly'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ price_id: priceId, billing_period: billingPeriod }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCustomerPortal = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/billing/portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to open portal');

      const data = await response.json();
      window.location.href = data.portal_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/billing/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createCheckoutSession,
    openCustomerPortal,
    cancelSubscription,
  };
}

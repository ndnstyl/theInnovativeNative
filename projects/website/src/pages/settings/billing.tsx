import React from 'react';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import { useSubscription } from '@/hooks/useSubscription';

function formatDate(date: string | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'billing__status--active' },
  trialing: { label: 'Trial', className: 'billing__status--trial' },
  past_due: { label: 'Past Due', className: 'billing__status--past-due' },
  canceled: { label: 'Canceled', className: 'billing__status--canceled' },
  incomplete: { label: 'Incomplete', className: 'billing__status--incomplete' },
};

export default function BillingPage() {
  const { subscription, loading, isActive, openCustomerPortal } = useSubscription();

  return (
    <ClassroomLayout title="Billing">
      <div className="billing">
        <h2 className="billing__title">Billing & Subscription</h2>

        {loading ? (
          <div className="billing__loading">
            <div className="billing__spinner" />
          </div>
        ) : !subscription ? (
          <div className="billing__no-sub">
            <i className="fa-solid fa-credit-card"></i>
            <h3>No Active Subscription</h3>
            <p>You&apos;re currently on the free plan. Upgrade to access premium courses and features.</p>
          </div>
        ) : (
          <div className="billing__details">
            <div className="billing__card">
              <div className="billing__card-header">
                <h3>Current Plan</h3>
                <span className={`billing__status ${STATUS_LABELS[subscription.status]?.className || ''}`}>
                  {STATUS_LABELS[subscription.status]?.label || subscription.status}
                </span>
              </div>
              <div className="billing__card-body">
                <div className="billing__row">
                  <span className="billing__label">Plan</span>
                  <span className="billing__value">
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                    {subscription.lifetime_access && ' (Lifetime)'}
                  </span>
                </div>
                {!subscription.lifetime_access && subscription.current_period_end && (
                  <div className="billing__row">
                    <span className="billing__label">
                      {subscription.cancel_at_period_end ? 'Access Until' : 'Next Billing Date'}
                    </span>
                    <span className="billing__value">{formatDate(subscription.current_period_end)}</span>
                  </div>
                )}
                {subscription.cancel_at_period_end && (
                  <p className="billing__cancel-notice">
                    Your subscription will not renew. You&apos;ll retain access until the end of your current billing period.
                  </p>
                )}
              </div>
              {subscription.stripe_customer_id && (
                <div className="billing__card-actions">
                  <button className="btn btn--primary" onClick={openCustomerPortal}>
                    Manage Subscription
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ClassroomLayout>
  );
}

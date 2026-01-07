/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — PRICING PAGE
 * Phase 5: Monetization System
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
}

interface Plan {
  tier: 'free' | 'pro' | 'enterprise';
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: PlanFeature[];
  popular?: boolean;
}

export const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: Plan[] = [
    {
      tier: 'free',
      name: 'Free',
      description: 'Découvrez CHE·NU™',
      price_monthly: 0,
      price_yearly: 0,
      features: [
        { name: '9 Spheres', included: true },
        { name: '10K tokens/mois', included: true, limit: 10000 },
        { name: '8 Agents IA', included: true, limit: 8 },
        { name: '10 Threads', included: true, limit: 10 },
        { name: 'Support Email', included: true },
        { name: 'API Access', included: false },
      ],
    },
    {
      tier: 'pro',
      name: 'Pro',
      description: 'Pour professionnels',
      price_monthly: 29,
      price_yearly: 290,
      popular: true,
      features: [
        { name: '9 Spheres', included: true },
        { name: '100K tokens/mois', included: true, limit: 100000 },
        { name: '38 Agents IA', included: true, limit: 38 },
        { name: '100 Threads', included: true, limit: 100 },
        { name: 'Priority Support', included: true },
        { name: 'API Access', included: true },
        { name: 'Custom Agents', included: true },
        { name: 'Advanced Analytics', included: true },
      ],
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      description: 'Pour équipes',
      price_monthly: 99,
      price_yearly: 990,
      features: [
        { name: 'Tout de Pro +', included: true },
        { name: '500K tokens/mois', included: true, limit: 500000 },
        { name: '160 Agents IA', included: true },
        { name: 'Threads illimités', included: true },
        { name: 'Support 24/7', included: true },
        { name: 'SSO/SAML', included: true },
        { name: 'Team Collaboration', included: true },
        { name: 'SLA 99.9%', included: true },
      ],
    },
  ];

  const handleSelectPlan = (tier: string) => {
    logger.debug(`Selected plan: ${tier} (${billingPeriod})`);
    // TODO: Redirect to checkout
  };

  return (
    <div className="pricing-page">
      {/* Header */}
      <div className="pricing-header">
        <h1>Plans & Tarifs</h1>
        <p>Choisissez le plan qui correspond à vos besoins</p>

        {/* Billing toggle */}
        <div className="billing-toggle">
          <button
            className={billingPeriod === 'monthly' ? 'active' : ''}
            onClick={() => setBillingPeriod('monthly')}
          >
            Mensuel
          </button>
          <button
            className={billingPeriod === 'yearly' ? 'active' : ''}
            onClick={() => setBillingPeriod('yearly')}
          >
            Annuel
            <span className="badge">-17%</span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`plan-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="popular-badge">Populaire</div>}

            <div className="plan-header">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>

            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">
                {billingPeriod === 'monthly' ? plan.price_monthly : Math.floor(plan.price_yearly / 12)}
              </span>
              <span className="period">/mois</span>
            </div>

            {billingPeriod === 'yearly' && plan.price_yearly > 0 && (
              <div className="yearly-total">
                ${plan.price_yearly}/an (2 mois gratuits)
              </div>
            )}

            <button
              className="select-btn"
              onClick={() => handleSelectPlan(plan.tier)}
            >
              {plan.tier === 'free' ? 'Commencer gratuitement' : 'Choisir ce plan'}
            </button>

            <div className="plan-features">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="feature">
                  <span className={`icon ${feature.included ? 'check' : 'cross'}`}>
                    {feature.included ? '✓' : '✗'}
                  </span>
                  <span className="feature-name">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="pricing-faq">
        <h2>Questions fréquentes</h2>
        
        <div className="faq-item">
          <h4>Qu'est-ce qu'un token CHE·NU?</h4>
          <p>
            Les tokens CHE·NU sont des crédits utilitaires internes qui représentent l'énergie d'intelligence. 
            Ce ne sont PAS des cryptomonnaies. Ils sont utilisés pour exécuter des agents IA et traiter vos données.
          </p>
        </div>

        <div className="faq-item">
          <h4>Puis-je changer de plan?</h4>
          <p>
            Oui! Vous pouvez upgrade ou downgrade à tout moment. 
            Les changements sont proratisés et prennent effet immédiatement.
          </p>
        </div>

        <div className="faq-item">
          <h4>Puis-je acheter plus de tokens?</h4>
          <p>
            Oui! En plus de votre allocation mensuelle, vous pouvez acheter des packages de tokens à tout moment.
          </p>
        </div>

        <div className="faq-item">
          <h4>Quelle est votre politique de remboursement?</h4>
          <p>
            Nous offrons un remboursement complet dans les 14 jours si vous n'êtes pas satisfait, sans questions.
          </p>
        </div>
      </div>

      <style jsx>{`
        .pricing-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .pricing-header h1 {
          font-size: 48px;
          color: #1e1f22;
          margin: 0 0 16px;
        }

        .pricing-header p {
          font-size: 18px;
          color: #8d8371;
          margin: 0 0 32px;
        }

        .billing-toggle {
          display: inline-flex;
          background: #e9e4d6;
          border-radius: 8px;
          padding: 4px;
        }

        .billing-toggle button {
          padding: 12px 24px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .billing-toggle button.active {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .badge {
          background: #3f7249;
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          margin-bottom: 80px;
        }

        .plan-card {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 16px;
          padding: 40px;
          position: relative;
          transition: all 0.3s;
        }

        .plan-card:hover {
          border-color: #d8b26a;
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .plan-card.popular {
          border-color: #d8b26a;
          border-width: 3px;
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #d8b26a 0%, #c9a159 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .plan-header h3 {
          font-size: 24px;
          color: #1e1f22;
          margin: 0 0 8px;
        }

        .plan-header p {
          color: #8d8371;
          margin: 0 0 24px;
        }

        .plan-price {
          margin-bottom: 8px;
        }

        .currency {
          font-size: 24px;
          color: #8d8371;
          vertical-align: top;
        }

        .amount {
          font-size: 56px;
          font-weight: 700;
          color: #1e1f22;
        }

        .period {
          font-size: 16px;
          color: #8d8371;
        }

        .yearly-total {
          font-size: 14px;
          color: #3f7249;
          margin-bottom: 24px;
          font-weight: 600;
        }

        .select-btn {
          width: 100%;
          padding: 16px;
          background: #d8b26a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 32px;
        }

        .select-btn:hover {
          background: #c9a159;
          transform: translateY(-2px);
        }

        .plan-features {
          border-top: 2px solid #e9e4d6;
          padding-top: 24px;
        }

        .feature {
          display: flex;
          align-items: center;
          margin: 12px 0;
        }

        .icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .icon.check {
          background: #3f7249;
          color: white;
        }

        .icon.cross {
          background: #e9e4d6;
          color: #8d8371;
        }

        .feature-name {
          color: #2f4c39;
          font-size: 14px;
        }

        .pricing-faq {
          max-width: 800px;
          margin: 0 auto;
        }

        .pricing-faq h2 {
          font-size: 36px;
          text-align: center;
          margin-bottom: 40px;
          color: #1e1f22;
        }

        .faq-item {
          margin-bottom: 32px;
        }

        .faq-item h4 {
          font-size: 18px;
          color: #1e1f22;
          margin: 0 0 12px;
        }

        .faq-item p {
          color: #2f4c39;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

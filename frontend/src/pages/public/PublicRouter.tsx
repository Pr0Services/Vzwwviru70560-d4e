/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — PUBLIC ROUTER                                   ║
 * ║                    Routes pour les pages publiques (PRE-LOGIN)               ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  AUTHORIZED PUBLIC SECTIONS (as per MAPPING OFFICIEL):                       ║
 * ║  1) HOME — What is CHE·NU                                                    ║
 * ║  2) SERVICES CHE·NU — Capabilities & Domains                                 ║
 * ║  3) NARRATIVE DEMO — Scripted explanation                                    ║
 * ║  4) INVESTORS — Governance-first                                             ║
 * ║  5) JOIN CHE·NU — Conscious entry point                                      ║
 * ║  + FAQ, PRICING, LEGAL PAGES                                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES PUBLIQUES
// ═══════════════════════════════════════════════════════════════════════════════
import { LandingPage } from './LandingPage';
import { ServicesPage } from './ServicesPage';
import { DemoPage } from './DemoPage';
import { InvestorPage } from './InvestorPage';
import { SignupPage } from './SignupPage';
import { FAQPage } from './FAQPage';
import { PricingPage } from './PricingPage';
import { LoginPage } from './LoginPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { PrivacyPage } from './PrivacyPage';
import { TermsPage } from './TermsPage';
import { SecurityPage } from './SecurityPage';
import { OnboardingPage, OnboardingCompletePage } from './OnboardingPage';

/**
 * Routes publiques - accessibles sans authentification
 */
export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — HOME (What is CHE·NU)                                       */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/" element={<LandingPage />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — SERVICES CHE·NU (Capabilities & Domains)                    */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/features" element={<Navigate to="/services" replace />} />
      <Route path="/fonctionnalites" element={<Navigate to="/services" replace />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — NARRATIVE DEMO (5-15 min scripted)                          */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/demo" element={<DemoPage />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — INVESTORS (Governance-first)                                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/investor" element={<InvestorPage />} />
      <Route path="/investors" element={<Navigate to="/investor" replace />} />
      <Route path="/invest" element={<Navigate to="/investor" replace />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — JOIN CHE·NU (Conscious entry point)                         */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/join" element={<Navigate to="/signup" replace />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/inscription" element={<Navigate to="/signup" replace />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ADDITIONAL SECTIONS                                                     */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      {/* FAQ */}
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/help" element={<Navigate to="/faq" replace />} />
      
      {/* Pricing */}
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/tarifs" element={<Navigate to="/pricing" replace />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* AUTHENTIFICATION                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<Navigate to="/login" replace />} />
      <Route path="/connexion" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<Navigate to="/forgot-password" replace />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ONBOARDING (POST-LOGIN)                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/onboarding/complete" element={<OnboardingCompletePage />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* PAGES LÉGALES                                                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/confidentialite" element={<Navigate to="/privacy" replace />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/conditions" element={<Navigate to="/terms" replace />} />
      <Route path="/cgu" element={<Navigate to="/terms" replace />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/securite" element={<Navigate to="/security" replace />} />
      
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* FALLBACK — Redirect to HOME                                             */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

/**
 * Liste des routes publiques officielles (MAPPING OFFICIEL)
 */
export const PUBLIC_ROUTES = {
  // Section 1 - HOME
  home: '/',
  
  // Section 2 - SERVICES
  services: '/services',
  
  // Section 3 - DEMO
  demo: '/demo',
  
  // Section 4 - INVESTORS
  investor: '/investor',
  
  // Section 5 - JOIN
  signup: '/signup',
  
  // Additional
  faq: '/faq',
  pricing: '/pricing',
  
  // Auth
  login: '/login',
  forgotPassword: '/forgot-password',
  
  // Onboarding
  onboarding: '/onboarding',
  
  // Legal
  privacy: '/privacy',
  terms: '/terms',
  security: '/security',
} as const;

// Export all pages
export { 
  LandingPage, 
  ServicesPage,
  DemoPage,
  InvestorPage, 
  SignupPage,
  FAQPage, 
  PricingPage,
  LoginPage,
  ForgotPasswordPage,
  PrivacyPage,
  TermsPage,
  SecurityPage,
  OnboardingPage,
  OnboardingCompletePage,
};

// Alias for backwards compatibility
export { ServicesPage as FeaturesPage };

export default PublicRoutes;

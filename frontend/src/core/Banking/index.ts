/**
 * CHE·NU™ — BANKING MODULE
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Connexions bancaires multi-identité avec gouvernance
 * ════════════════════════════════════════════════════════════════════════════
 */

export {
  MultiIdentityBankingService,
  multiIdentityBanking,
  SUPPORTED_INSTITUTIONS,
  CATEGORY_RULES
} from './multiIdentityBanking';

export type {
  BankingProvider,
  AccountType,
  IdentityType,
  TransactionCategory,
  BankingIdentity,
  IdentitySettings,
  IdentityGovernance,
  BankConnection,
  BankAccount,
  Transaction,
  SpendingAnalytics,
  SpendingInsight,
  SupportedInstitution,
  CategoryRule
} from './multiIdentityBanking';

// ═══════════════════════════════════════════════════════════════════════════
// QUICK ACCESS API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * API rapide pour les opérations bancaires courantes
 */
export const BankingAPI = {
  // Identity Management
  createIdentity: multiIdentityBanking.createIdentity.bind(multiIdentityBanking),
  getAllIdentities: multiIdentityBanking.getAllIdentities.bind(multiIdentityBanking),
  getIdentitiesBySphere: multiIdentityBanking.getIdentitiesBySphere.bind(multiIdentityBanking),
  
  // Connections
  initiateConnection: multiIdentityBanking.initiateConnection.bind(multiIdentityBanking),
  completeConnection: multiIdentityBanking.completeConnection.bind(multiIdentityBanking),
  syncTransactions: multiIdentityBanking.syncTransactions.bind(multiIdentityBanking),
  
  // Transactions
  getTransactions: multiIdentityBanking.getTransactions.bind(multiIdentityBanking),
  recategorizeTransaction: multiIdentityBanking.recategorizeTransaction.bind(multiIdentityBanking),
  linkTransactionToThread: multiIdentityBanking.linkTransactionToThread.bind(multiIdentityBanking),
  aiCategorizeTransactions: multiIdentityBanking.aiCategorizeTransactions.bind(multiIdentityBanking),
  
  // Analytics
  getSpendingAnalytics: multiIdentityBanking.getSpendingAnalytics.bind(multiIdentityBanking),
  getMultiIdentitySummary: multiIdentityBanking.getMultiIdentitySummary.bind(multiIdentityBanking),
  
  // Info
  getSupportedInstitutions: () => SUPPORTED_INSTITUTIONS,
  getCapabilities: multiIdentityBanking.getCapabilityReport.bind(multiIdentityBanking)
};

export default BankingAPI;

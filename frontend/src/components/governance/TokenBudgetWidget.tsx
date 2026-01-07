/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — TOKEN BUDGET WIDGET                         ║
 * ║                    Affichage Visuel du Budget Tokens                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Affiche:
 * - Balance totale
 * - Tokens réservés (pour opération en cours)
 * - Tokens disponibles
 * - Historique d'utilisation (mini)
 *
 * NOTE: Les tokens sont des crédits internes, PAS de crypto
 */

import React, { useState } from 'react';
import { useTokenStore, TokenTransaction } from '../../stores/token.store';

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN BUDGET WIDGET COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface TokenBudgetWidgetProps {
  className?: string;
  showHistory?: boolean;
  compact?: boolean;
}

export function TokenBudgetWidget({ 
  className = '', 
  showHistory = true,
  compact = false 
}: TokenBudgetWidgetProps) {
  const { balance, reservedTokens, usedToday, dailyLimit, recentTransactions } = useTokenStore();
  const [showDetails, setShowDetails] = useState(false);
  
  const available = balance - reservedTokens;
  const usagePercent = dailyLimit > 0 ? Math.min((usedToday / dailyLimit) * 100, 100) : 0;
  
  // Determine status color
  const getStatusColor = () => {
    if (usagePercent >= 90) return { bg: 'bg-red-500', text: 'text-red-400' };
    if (usagePercent >= 70) return { bg: 'bg-yellow-500', text: 'text-yellow-400' };
    return { bg: 'bg-[#3EB4A2]', text: 'text-[#3EB4A2]' };
  };
  
  const statusColor = getStatusColor();

  // ─────────────────────────────────────────────────────────────────────────────
  // Compact Mode
  // ─────────────────────────────────────────────────────────────────────────────
  
  if (compact) {
    return (
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 bg-[#1E1F22] rounded-lg border border-[#2A2B2E] ${className}`}
        data-testid="token-budget-compact"
      >
        <span className="text-[#D8B26A]">🪙</span>
        <span className="text-sm text-[#E9E4D6] font-medium">{available.toLocaleString()}</span>
        {reservedTokens > 0 && (
          <span className="text-xs text-[#F59E0B]">(-{reservedTokens.toLocaleString()})</span>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Full Mode
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div 
      className={`bg-[#1E1F22] border border-[#2A2B2E] rounded-xl overflow-hidden ${className}`}
      data-testid="token-budget-widget"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2A2B2E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🪙</span>
          <span className="text-sm font-medium text-[#E9E4D6]">Budget Tokens</span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-[#5A5B5E] hover:text-[#8D8371] transition-colors"
        >
          {showDetails ? 'Masquer' : 'Détails'}
        </button>
      </div>

      {/* Main Balance */}
      <div className="p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#E9E4D6]">
            {available.toLocaleString()}
          </span>
          <span className="text-sm text-[#5A5B5E]">disponibles</span>
        </div>
        
        {/* Reserved indicator */}
        {reservedTokens > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#F59E0B]">
              {reservedTokens.toLocaleString()} réservés
            </span>
          </div>
        )}
      </div>

      {/* Usage Bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#5A5B5E]">Usage quotidien</span>
          <span className="text-xs text-[#8D8371]">
            {usedToday.toLocaleString()} / {dailyLimit.toLocaleString()}
          </span>
        </div>
        <div className="h-2 bg-[#2A2B2E] rounded-full overflow-hidden">
          <div 
            className={`h-full ${statusColor.bg} transition-all duration-500`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${statusColor.text}`}>
          {usagePercent.toFixed(1)}% utilisé
        </p>
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="px-4 pb-4 border-t border-[#2A2B2E] pt-4 space-y-3">
          {/* Balance breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-[#141517] rounded-lg">
              <p className="text-xs text-[#5A5B5E]">Balance totale</p>
              <p className="text-sm font-medium text-[#E9E4D6]">{balance.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-[#141517] rounded-lg">
              <p className="text-xs text-[#5A5B5E]">Réservés</p>
              <p className="text-sm font-medium text-[#F59E0B]">{reservedTokens.toLocaleString()}</p>
            </div>
          </div>

          {/* Recent Transactions */}
          {showHistory && recentTransactions && recentTransactions.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-[#5A5B5E] mb-2">Transactions récentes</h4>
              <div className="space-y-1">
                {recentTransactions.slice(0, 5).map((tx, i) => (
                  <TransactionRow key={i} transaction={tx} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION ROW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface TransactionRowProps {
  transaction: TokenTransaction;
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const isDebit = transaction.type === 'debit' || transaction.type === 'reserve';
  const isCredit = transaction.type === 'credit' || transaction.type === 'refund';
  
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <div className="flex items-center gap-2">
        <span className={isDebit ? 'text-red-400' : 'text-green-400'}>
          {isDebit ? '−' : '+'}
        </span>
        <span className="text-[#8D8371] truncate max-w-[150px]">
          {transaction.description || transaction.type}
        </span>
      </div>
      <span className={isDebit ? 'text-red-400' : 'text-green-400'}>
        {transaction.amount.toLocaleString()}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN USAGE CHART - Mini sparkline
// ═══════════════════════════════════════════════════════════════════════════════

interface TokenUsageChartProps {
  data: number[]; // Array of usage values (last 7 days)
  className?: string;
}

export function TokenUsageChart({ data, className = '' }: TokenUsageChartProps) {
  const max = Math.max(...data, 1);
  
  return (
    <div className={`flex items-end gap-1 h-12 ${className}`}>
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-[#D8B26A]/60 rounded-t transition-all duration-300 hover:bg-[#D8B26A]"
          style={{ height: `${(value / max) * 100}%`, minHeight: '2px' }}
          title={`${value.toLocaleString()} tokens`}
        />
      ))}
    </div>
  );
}

export default TokenBudgetWidget;

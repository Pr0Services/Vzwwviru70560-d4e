/**
 * CHE·NU™ — Hub Communication (Left)
 * 
 * Hub de clarification de l'intention humaine.
 * Contient:
 * - ✨ Nova (Guide, Narrateur, Assistant)
 * - 🤖 Agents IA (226 agents spécialisés)
 * - 💬 Messagerie interne
 * - 📧 Courriel
 * 
 * ⚠️ NO AI EXECUTION ALLOWED HERE
 * Toute exécution passe par le Governed Pipeline dans le Hub Workspace
 */

'use client';

import React, { useState } from 'react';
import { useChenuStore } from '../../hooks/useChenuStore';
import { NOVA } from '../../types';

type CommunicationTab = 'nova' | 'agents' | 'messages' | 'email';

interface HubCommunicationProps {
  className?: string;
}

export function HubCommunication({ className = '' }: HubCommunicationProps) {
  const [activeTab, setActiveTab] = useState<CommunicationTab>('nova');
  const [novaInput, setNovaInput] = useState('');
  const { agents, selectedSphereId } = useChenuStore();

  const tabs: { id: CommunicationTab; label: string; emoji: string }[] = [
    { id: 'nova', label: 'Nova', emoji: '✨' },
    { id: 'agents', label: 'Agents', emoji: '🤖' },
    { id: 'messages', label: 'Messages', emoji: '💬' },
    { id: 'email', label: 'Email', emoji: '📧' },
  ];

  const sphereAgents = agents.filter(a => a.sphere_id === selectedSphereId);

  return (
    <aside 
      className={`
        hub-communication
        w-[280px]
        bg-[#1A1B1E]
        border-r border-[#3A3B3F]
        flex flex-col
        h-full
        ${className}
      `}
    >
      {/* ═══════════════════════════════════════════════════════════════
          TAB BAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex border-b border-[#3A3B3F]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2 px-1
              text-xs font-medium
              transition-colors
              flex flex-col items-center gap-0.5
              ${activeTab === tab.id 
                ? 'bg-[#2A2B2F] text-[#D8B26A] border-b-2 border-[#D8B26A]' 
                : 'text-[#8D8371] hover:bg-[#2A2B2F]/50'
              }
            `}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB CONTENT
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-hidden flex flex-col">
        
        {/* ───────────────────────────────────────────────────────────
            NOVA TAB — Guide, Narrateur, Assistant
            ─────────────────────────────────────────────────────────── */}
        {activeTab === 'nova' && (
          <div className="flex-1 flex flex-col">
            {/* Nova Header */}
            <div className="p-3 border-b border-[#3A3B3F]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D8B26A] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#D8B26A]/30">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <div className="font-semibold text-[#E9E4D6]">{NOVA.name}</div>
                  <div className="text-[10px] text-[#8D8371]">
                    Guide • Narrateur • Assistant
                  </div>
                </div>
              </div>
              {/* IMPORTANT: Nova ne peut pas exécuter */}
              <div className="mt-2 px-2 py-1 bg-[#2A2B2F] rounded text-[9px] text-[#8D8371]">
                💡 Nova clarifie votre intention. L'exécution IA se fait dans le Workspace.
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Message Nova */}
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D8B26A] to-[#FFD700] flex items-center justify-center text-xs flex-shrink-0">
                  ✨
                </div>
                <div className="bg-[#2A2B2F] rounded-lg rounded-tl-none p-2 max-w-[200px]">
                  <p className="text-xs text-[#E9E4D6]">
                    Bonjour! Je suis Nova, votre guide CHE·NU. Comment puis-je vous aider à clarifier votre intention?
                  </p>
                </div>
              </div>

              {/* Message User Example */}
              <div className="flex gap-2 justify-end">
                <div className="bg-[#D8B26A]/20 rounded-lg rounded-tr-none p-2 max-w-[200px]">
                  <p className="text-xs text-[#E9E4D6]">
                    J'aimerais analyser mes finances du mois
                  </p>
                </div>
              </div>

              {/* Nova Response */}
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D8B26A] to-[#FFD700] flex items-center justify-center text-xs flex-shrink-0">
                  ✨
                </div>
                <div className="bg-[#2A2B2F] rounded-lg rounded-tl-none p-2 max-w-[200px]">
                  <p className="text-xs text-[#E9E4D6]">
                    Je comprends. Voulez-vous:
                  </p>
                  <ul className="text-xs text-[#8D8371] mt-1 space-y-0.5">
                    <li>• Analyser les dépenses</li>
                    <li>• Comparer avec le mois dernier</li>
                    <li>• Voir les tendances</li>
                  </ul>
                  <p className="text-[10px] text-[#D8B26A] mt-2">
                    🔒 Cela nécessitera ~500 tokens
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#3A3B3F]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaInput}
                  onChange={e => setNovaInput(e.target.value)}
                  placeholder="Exprimez votre intention..."
                  className="
                    flex-1 
                    bg-[#2A2B2F] 
                    border border-[#3A3B3F] 
                    rounded-lg 
                    px-3 py-2 
                    text-xs text-[#E9E4D6]
                    placeholder:text-[#8D8371]
                    focus:outline-none focus:border-[#D8B26A]
                  "
                />
                <button 
                  className="
                    px-3 py-2 
                    bg-gradient-to-r from-[#D8B26A] to-[#8D8371]
                    rounded-lg 
                    text-white text-xs font-medium
                    hover:opacity-90 transition-opacity
                  "
                >
                  Clarifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            AGENTS TAB — 226 agents spécialisés
            ─────────────────────────────────────────────────────────── */}
        {activeTab === 'agents' && (
          <div className="flex-1 overflow-y-auto">
            {/* Agent Categories */}
            <div className="p-3 border-b border-[#3A3B3F]">
              <div className="text-xs text-[#8D8371] mb-2">
                Agents de la sphère active ({sphereAgents.length})
              </div>
              <div className="flex gap-1 flex-wrap">
                {['L0', 'L1', 'L2', 'L3'].map(level => (
                  <span 
                    key={level}
                    className="px-2 py-0.5 bg-[#2A2B2F] rounded text-[10px] text-[#8D8371]"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {/* Agent List */}
            <div className="p-2 space-y-1">
              {sphereAgents.length === 0 ? (
                <div className="text-xs text-[#8D8371] text-center py-4">
                  Aucun agent dans cette sphère
                </div>
              ) : (
                sphereAgents.map(agent => (
                  <div 
                    key={agent.id}
                    className="
                      p-2 rounded-lg
                      bg-[#2A2B2F] hover:bg-[#3A3B3F]
                      cursor-pointer transition-colors
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#3A3B3F] flex items-center justify-center text-xs">
                          🤖
                        </div>
                        <div>
                          <div className="text-xs text-[#E9E4D6] font-medium">
                            {agent.name}
                          </div>
                          <div className="text-[10px] text-[#8D8371]">
                            {agent.level} • {agent.type}
                          </div>
                        </div>
                      </div>
                      <span 
                        className={`
                          w-2 h-2 rounded-full
                          ${agent.status === 'available' ? 'bg-green-500' :
                            agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'}
                        `}
                      />
                    </div>
                  </div>
                ))
              )}

              {/* Hire Orchestrator Button */}
              <button className="
                w-full mt-2 p-2 
                border border-dashed border-[#D8B26A]/50 
                rounded-lg
                text-xs text-[#D8B26A]
                hover:bg-[#D8B26A]/10 transition-colors
              ">
                + Engager un Orchestrateur L3
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            MESSAGES TAB
            ─────────────────────────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-xs text-[#8D8371] text-center py-8">
              💬 Messagerie interne
              <br />
              <span className="text-[10px]">Communication équipe</span>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            EMAIL TAB
            ─────────────────────────────────────────────────────────── */}
        {activeTab === 'email' && (
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-xs text-[#8D8371] text-center py-8">
              📧 Intégration Email
              <br />
              <span className="text-[10px]">Gmail, Outlook, etc.</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default HubCommunication;

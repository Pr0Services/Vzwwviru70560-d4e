/**
 * CHE·NU — GOVERNANCE PAGE
 * ============================================================
 * Explication de la gouvernance CHE·NU
 * 
 * @version 27.0.0
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Shield, ArrowLeft, CheckCircle, AlertTriangle, Lock } from 'lucide-react'

export function GovernancePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Logo size="small" variant="full" />
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Governance Canon
          </h1>
          <p className="text-xl text-gray-400">
            Les principes fondamentaux de CHE·NU
          </p>
        </div>

        {/* Main Quote */}
        <div className="p-8 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-12">
          <blockquote className="text-2xl text-center text-white leading-relaxed">
            "CHE·NU does not act for you.<br />
            CHE·NU acts with you.<br />
            CHE·NU acts only when you decide."
          </blockquote>
        </div>

        {/* Principles */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Consentement Explicite
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Toute action effectuée par CHE·NU requiert votre approbation explicite. 
              Aucune modification, envoi, ou décision n'est exécutée sans votre confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-400" />
              Transparence Totale
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Nova, votre assistant de gouvernance, explique chaque suggestion avant exécution.
              Vous comprenez toujours ce qui sera fait et pourquoi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              Contrôle Absolu
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Vous restez maître de vos données, projets et décisions. 
              CHE·NU est un outil qui vous assiste, jamais un système qui vous remplace.
            </p>
          </section>
        </div>

        {/* Hierarchy */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-800/50 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Hiérarchie d'Autorité</h3>
          <ol className="space-y-3">
            <li className="flex items-center gap-3 text-gray-300">
              <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">1</span>
              <span><strong className="text-white">UTILISATEUR</strong> — Autorité finale</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">2</span>
              <span><strong className="text-white">NOVA</strong> — Gouvernance & explication</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">3</span>
              <span><strong className="text-white">ORCHESTRATOR</strong> — Planning & coordination</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="w-8 h-8 rounded-full bg-purple-300 flex items-center justify-center text-gray-900 font-bold">4</span>
              <span><strong className="text-white">AGENTS</strong> — Analyse spécialisée</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">5</span>
              <span><strong className="text-white">SYSTEM</strong> — Exécution (après confirmation)</span>
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-purple-600 text-white text-lg font-semibold hover:bg-purple-500 transition-colors"
          >
            Commencer avec CHE·NU
          </Link>
        </div>
      </main>
    </div>
  )
}

export default GovernancePage

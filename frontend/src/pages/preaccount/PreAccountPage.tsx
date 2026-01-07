/**
 * CHE·NU — PRE-ACCOUNT PAGE
 * ============================================================
 * Page d'accueil pour utilisateurs non authentifiés
 * 
 * @version 27.0.0
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { ArrowRight, Shield, Sparkles, Globe } from 'lucide-react'

export function PreAccountPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Logo size="medium" variant="full" />
        <div className="flex items-center gap-4">
          <Link 
            to="/login"
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Connexion
          </Link>
          <Link 
            to="/register"
            className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors"
          >
            S'inscrire
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo size="hero" variant="icon" className="mx-auto mb-8" />
          
          <h1 className="text-5xl font-bold text-white mb-4">
            CHE·NU
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Governed Intelligence OS
          </p>
          <p className="text-lg text-purple-400 italic mb-12">
            "Chez Nous"
          </p>

          {/* Governance Quote */}
          <div className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <Shield className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <blockquote className="text-gray-300 italic">
              "CHE·NU does not act for you.<br />
              CHE·NU acts with you.<br />
              CHE·NU acts only when you decide."
            </blockquote>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Interaction</h3>
              <p className="text-xs text-gray-400">Nova · Gouvernance</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <Globe className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Navigation</h3>
              <p className="text-xs text-gray-400">11 Sphères · Agents</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <ArrowRight className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Conception</h3>
              <p className="text-xs text-gray-400">Workspace · Documents</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/governance"
              className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              En savoir plus
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors flex items-center gap-2"
            >
              Commencer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500">
        Pro-Service Construction · Brossard, Québec
      </footer>
    </div>
  )
}

export default PreAccountPage

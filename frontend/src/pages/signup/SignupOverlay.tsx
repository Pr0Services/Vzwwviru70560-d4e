/**
 * CHE·NU — SIGNUP OVERLAY
 * ============================================================
 * Modal d'inscription rapide
 * 
 * @version 27.0.0
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ArrowRight, Shield } from 'lucide-react'
import { Logo } from '@/components/Logo'

interface SignupOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function SignupOverlay({ isOpen, onClose, onSuccess }: SignupOverlayProps) {
  const [step, setStep] = useState<'email' | 'details' | 'governance'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [acceptedGovernance, setAcceptedGovernance] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'email') {
      setStep('details')
    } else if (step === 'details') {
      setStep('governance')
    } else if (acceptedGovernance) {
      // Submit registration
      onSuccess?.()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 p-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Logo size="small" variant="full" />
              <button 
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {['email', 'details', 'governance'].map((s, i) => (
                <div 
                  key={s}
                  className={`flex-1 h-1 rounded-full ${
                    i <= ['email', 'details', 'governance'].indexOf(step)
                      ? 'bg-purple-500'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Email */}
              {step === 'email' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Créer un compte</h2>
                  <p className="text-gray-400">Entrez votre email pour commencer</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 'details' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Vos informations</h2>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mot de passe"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Governance */}
              {step === 'governance' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Governance Canon</h2>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <p className="text-gray-300 text-sm italic">
                      "CHE·NU does not act for you.<br />
                      CHE·NU acts with you.<br />
                      CHE·NU acts only when you decide."
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedGovernance}
                      onChange={e => setAcceptedGovernance(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-gray-300 text-sm">
                      Je comprends et j'accepte les principes de gouvernance de CHE·NU. 
                      L'IA m'assiste mais ne prend jamais de décision sans mon approbation explicite.
                    </span>
                  </label>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={step === 'governance' && !acceptedGovernance}
                className="w-full mt-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {step === 'governance' ? 'Créer mon compte' : 'Continuer'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SignupOverlay

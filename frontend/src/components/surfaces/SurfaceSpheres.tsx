// ================================
// SURFACE B — SPHERES
// Contextual Navigation & Selection
// ================================

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, Wallet, Users, Megaphone, Cpu, Palette, 
  Home, Briefcase, Film, Microscope, Search, ChevronRight,
  Zap, Globe
} from 'lucide-react'
import type { Sphere } from '@/pages/app/ChenuApp'
import { clsx } from 'clsx'

interface SurfaceSpheresProps {
  activeSphere: Sphere | null
  onSelectSphere: (sphere: Sphere | null) => void
  onNavigateToNova: () => void
}

// CHE·NU Spheres Definition
const spheres: Sphere[] = [
  {
    id: 'construction',
    name: 'Construction',
    icon: '🏗️',
    color: 'from-orange-500 to-amber-500',
    description: 'Gestion de projets, conformité RBQ/CCQ/CNESST, estimation',
    agentCount: 45,
    isActive: true
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    description: 'Comptabilité, budgets, facturation, rapports financiers',
    agentCount: 28,
    isActive: true
  },
  {
    id: 'hr',
    name: 'Ressources Humaines',
    icon: '👥',
    color: 'from-blue-500 to-cyan-500',
    description: 'Gestion du personnel, paie CCQ, formation, recrutement',
    agentCount: 22,
    isActive: true
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📣',
    color: 'from-pink-500 to-rose-500',
    description: 'Communications, campagnes, réseaux sociaux, branding',
    agentCount: 18,
    isActive: true
  },
  {
    id: 'tech',
    name: 'Tech & Innovation',
    icon: '⚡',
    color: 'from-purple-500 to-violet-500',
    description: 'Développement, intégrations API, automatisation',
    agentCount: 35,
    isActive: true
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    icon: '🎨',
    color: 'from-fuchsia-500 to-pink-500',
    description: 'Design, visualisation 3D, rendus, présentations',
    agentCount: 15,
    isActive: true
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: '🏠',
    color: 'from-sky-500 to-blue-500',
    description: 'Tâches personnelles, rappels, notes, organisation',
    agentCount: 8,
    isActive: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: '🏢',
    color: 'from-slate-500 to-gray-500',
    description: 'Stratégie d\'entreprise, direction, décisions clés',
    agentCount: 12,
    isActive: false
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: 'from-red-500 to-orange-500',
    description: 'Médias, contenu, streaming, événements',
    agentCount: 10,
    isActive: false
  },
  {
    id: 'labs',
    name: 'AI Labs',
    icon: '🔬',
    color: 'from-teal-500 to-cyan-500',
    description: 'Expérimentation, recherche, prototypage IA',
    agentCount: 20,
    isActive: false
  },
]

export function SurfaceSpheres({ activeSphere, onSelectSphere, onNavigateToNova }: SurfaceSpheresProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredSphere, setHoveredSphere] = useState<string | null>(null)

  const filteredSpheres = spheres.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSpheres = filteredSpheres.filter(s => s.isActive)
  const inactiveSpheres = filteredSpheres.filter(s => !s.isActive)

  const handleSelectSphere = (sphere: Sphere) => {
    onSelectSphere(sphere)
    onNavigateToNova()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-full p-6 overflow-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="text-chenu-400" size={32} />
              Sphères
            </h1>
            <p className="text-gray-400 mt-1">
              Sélectionnez un contexte pour activer les agents appropriés
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher une sphère..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-chenu-500 w-72"
            />
          </div>
        </div>

        {/* Active Sphere Indicator */}
        {activeSphere && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-chenu-500/20 to-purple-500/20 border border-chenu-500/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{activeSphere.icon}</span>
                <div>
                  <p className="text-sm text-gray-400">Sphère Active</p>
                  <h3 className="text-xl font-bold text-white">{activeSphere.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => onSelectSphere(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
              >
                Désactiver
              </button>
            </div>
          </motion.div>
        )}

        {/* Active Spheres Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="text-green-400" size={20} />
            Sphères Actives
            <span className="text-sm font-normal text-gray-500">({activeSpheres.length})</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSpheres.map((sphere, index) => (
              <motion.div
                key={sphere.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredSphere(sphere.id)}
                onMouseLeave={() => setHoveredSphere(null)}
                onClick={() => handleSelectSphere(sphere)}
                className={clsx(
                  'relative p-5 rounded-2xl cursor-pointer transition-all duration-300',
                  'bg-gray-800/50 border border-gray-700 hover:border-gray-600',
                  'hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1',
                  activeSphere?.id === sphere.id && 'ring-2 ring-chenu-500 border-chenu-500'
                )}
              >
                {/* Gradient Background on Hover */}
                <div className={clsx(
                  'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300',
                  sphere.color,
                  hoveredSphere === sphere.id && 'opacity-10'
                )} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{sphere.icon}</span>
                    <div className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      'bg-green-500/20 text-green-400'
                    )}>
                      {sphere.agentCount} agents
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">{sphere.name}</h3>
                  <p className="text-sm text-gray-400">{sphere.description}</p>

                  <div className="flex items-center gap-2 mt-4 text-chenu-400 text-sm font-medium">
                    <span>Activer</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inactive Spheres */}
        {inactiveSpheres.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-400 mb-4 flex items-center gap-2">
              Sphères Disponibles
              <span className="text-sm font-normal text-gray-500">({inactiveSpheres.length})</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {inactiveSpheres.map((sphere, index) => (
                <motion.div
                  key={sphere.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  onClick={() => handleSelectSphere(sphere)}
                  className="p-4 rounded-xl bg-gray-800/30 border border-gray-800 cursor-pointer hover:bg-gray-800/50 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-60">{sphere.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-300">{sphere.name}</h3>
                      <p className="text-xs text-gray-500">{sphere.agentCount} agents</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-800 text-center">
            <p className="text-4xl font-bold text-white">{spheres.length}</p>
            <p className="text-sm text-gray-500 mt-1">Sphères Total</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-800 text-center">
            <p className="text-4xl font-bold text-chenu-400">
              {spheres.reduce((acc, s) => acc + s.agentCount, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Agents Disponibles</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-800/30 border border-gray-800 text-center">
            <p className="text-4xl font-bold text-green-400">
              {spheres.filter(s => s.isActive).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Sphères Configurées</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

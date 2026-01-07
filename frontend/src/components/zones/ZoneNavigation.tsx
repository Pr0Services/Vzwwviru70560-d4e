/**
 * CHE·NU — ZONE NAVIGATION
 * ============================================================
 * Sphères · Contexte · Agents
 * 
 * Cette zone permet de naviguer entre les 11 sphères,
 * de voir le contexte actuel, et de sélectionner des agents.
 * 
 * @version 27.0.0
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Users, Briefcase, Home, Building, Palette, GraduationCap, Landmark, Heart, TreePine, Gamepad2 } from 'lucide-react'

interface Sphere {
  id: string
  name: string
  icon: React.ElementType
  color: string
  gradient: string
  description: string
  agentCount: number
  projectCount: number
}

interface ZoneNavigationProps {
  onSphereSelect: (sphere: Sphere) => void
}

const SPHERES: Sphere[] = [
  {
    id: 'personnel',
    name: 'Personnel',
    icon: Users,
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-700',
    description: 'Vie personnelle et bien-être',
    agentCount: 12,
    projectCount: 3,
  },
  {
    id: 'social',
    name: 'Social & Divertissement',
    icon: Gamepad2,
    color: 'pink',
    gradient: 'from-pink-500 to-pink-700',
    description: 'Loisirs et vie sociale',
    agentCount: 8,
    projectCount: 2,
  },
  {
    id: 'scholars',
    name: 'Scholar',
    icon: GraduationCap,
    color: 'violet',
    gradient: 'from-violet-500 to-violet-700',
    description: 'Éducation et formation',
    agentCount: 15,
    projectCount: 4,
  },
  {
    id: 'maison',
    name: 'Maison',
    icon: Home,
    color: 'teal',
    gradient: 'from-teal-500 to-teal-700',
    description: 'Gestion du foyer',
    agentCount: 10,
    projectCount: 5,
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    icon: Building,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-700',
    description: 'Pro-Service Construction',
    agentCount: 45,
    projectCount: 12,
  },
  {
    id: 'projets',
    name: 'Projets',
    icon: Briefcase,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700',
    description: 'Gestion de projets',
    agentCount: 20,
    projectCount: 8,
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    icon: Palette,
    color: 'amber',
    gradient: 'from-amber-500 to-amber-700',
    description: 'Design et créativité',
    agentCount: 38,
    projectCount: 6,
  },
  {
    id: 'gouvernement',
    name: 'Gouvernement',
    icon: Landmark,
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-700',
    description: 'Services publics',
    agentCount: 8,
    projectCount: 2,
  },
  {
    id: 'immobilier',
    name: 'Immobilier',
    icon: Building,
    color: 'rose',
    gradient: 'from-rose-500 to-rose-700',
    description: 'Investissements immobiliers',
    agentCount: 12,
    projectCount: 4,
  },
  {
    id: 'associations',
    name: 'Associations',
    icon: Heart,
    color: 'green',
    gradient: 'from-green-500 to-green-700',
    description: 'OBNL et communautaire',
    agentCount: 6,
    projectCount: 3,
  },
  {
    id: 'environnement',
    name: 'Environnement',
    icon: TreePine,
    color: 'lime',
    gradient: 'from-lime-500 to-lime-700',
    description: 'Développement durable',
    agentCount: 4,
    projectCount: 2,
  },
]

export function ZoneNavigation({ onSphereSelect }: ZoneNavigationProps) {
  const [selectedSphere, setSelectedSphere] = useState<string | null>(null)
  const [hoveredSphere, setHoveredSphere] = useState<string | null>(null)

  const handleSelect = (sphere: Sphere) => {
    setSelectedSphere(sphere.id)
    onSphereSelect(sphere)
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-950 to-emerald-950/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-emerald-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Zone Navigation</h1>
            <p className="text-sm text-emerald-300">Sphères · Contexte · Agents</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">11</p>
            <p className="text-xs text-emerald-300">Sphères</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">168</p>
            <p className="text-xs text-emerald-300">Agents</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">51</p>
            <p className="text-xs text-emerald-300">Projets</p>
          </div>
        </div>
      </div>

      {/* Spheres Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SPHERES.map((sphere) => {
            const Icon = sphere.icon
            const isSelected = selectedSphere === sphere.id
            const isHovered = hoveredSphere === sphere.id
            
            return (
              <motion.button
                key={sphere.id}
                onClick={() => handleSelect(sphere)}
                onMouseEnter={() => setHoveredSphere(sphere.id)}
                onMouseLeave={() => setHoveredSphere(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? `bg-gradient-to-br ${sphere.gradient} border-transparent`
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected
                    ? 'bg-white/20'
                    : `bg-gradient-to-br ${sphere.gradient}`
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                <h3 className="font-semibold text-white mb-1">{sphere.name}</h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-1">{sphere.description}</p>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className={isSelected ? 'text-white/70' : 'text-gray-500'}>
                    {sphere.agentCount} agents
                  </span>
                  <span className={isSelected ? 'text-white/70' : 'text-gray-500'}>
                    {sphere.projectCount} projets
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ZoneNavigation

/**
 * CHE·NU™ — Auth Layout
 * Layout for login, register, forgot password pages
 */

import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CHE·NU</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Governed Intelligence OS</p>
            </div>
          </div>

          {/* Form Content */}
          <Outlet />
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 items-center justify-center">
        <div className="max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Your Governed Intelligence Operating System
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Structure precedes intelligence. Visibility precedes power.
              Human accountability is non-negotiable.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                '9 Spheres to organize your life',
                '226+ AI Agents with governed scopes',
                'Nova: Your system intelligence',
                'Human-in-the-loop at every step',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 right-40 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl" />
        </div>
      </div>
    </div>
  )
}

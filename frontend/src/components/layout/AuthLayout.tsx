/**
 * CHE·NU™ — Auth Layout
 * Layout for authentication pages (login, register)
 */

import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-ui-slate flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-shadow-moss to-ui-slate items-center justify-center p-12">
        <div className="max-w-md text-center">
          {/* Nova Logo */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-sacred-gold to-earth-ember flex items-center justify-center shadow-lg">
            <span className="text-4xl font-display font-bold text-ui-slate">N</span>
          </div>
          
          <h1 className="text-4xl font-display font-bold text-soft-sand mb-4">
            CHE·NU™
          </h1>
          
          <p className="text-xl text-sacred-gold mb-6">
            Governed Intelligence Operating System
          </p>
          
          <p className="text-ancient-stone leading-relaxed">
            Un système d'exploitation pour intelligence gouvernée. 
            9 sphères, 6 sections bureau, gouvernance complète.
          </p>

          {/* Architecture Summary */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="glass rounded-lg p-3">
              <div className="text-2xl font-bold text-sacred-gold">9</div>
              <div className="text-xs text-ancient-stone">Sphères</div>
            </div>
            <div className="glass rounded-lg p-3">
              <div className="text-2xl font-bold text-cenote-turquoise">6</div>
              <div className="text-xs text-ancient-stone">Sections</div>
            </div>
            <div className="glass rounded-lg p-3">
              <div className="text-2xl font-bold text-jungle-emerald">10</div>
              <div className="text-xs text-ancient-stone">Lois</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-sacred-gold to-earth-ember flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-ui-slate">N</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-soft-sand">CHE·NU™</h1>
            </Link>
          </div>

          {/* Auth Form Outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

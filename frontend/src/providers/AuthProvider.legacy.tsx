/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — AUTH PROVIDER                                   ║
 * ║                    Task B5.8: Authentication, protected routes, sessions     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  type ReactNode 
} from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  spheres: string[]
  primarySphere: string
  tokenBudget: number
  tokensUsed: number
  createdAt: string
  lastLoginAt: string
  preferences: UserPreferences
}

interface UserPreferences {
  theme: 'dark' | 'light' | 'system'
  language: 'fr' | 'en'
  notifications: boolean
  reducedMotion: boolean
  compactMode: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: 'google' | 'apple' | 'github') => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>
  refreshToken: () => Promise<void>
  verifyEmail: (token: string) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  primarySphere?: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ============================================================================
// AUTH PROVIDER
// ============================================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const TOKEN_KEY = 'chenu_auth_token'
const REFRESH_TOKEN_KEY = 'chenu_refresh_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize auth state from stored token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      
      if (token) {
        try {
          const user = await fetchCurrentUser(token)
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      }
    }

    initAuth()
  }, [])

  // Fetch current user from API
  const fetchCurrentUser = async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    return response.json()
  }

  // Login with email/password
  const login = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true, error: null }))

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const { user, token, refreshToken } = await response.json()

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }))
      throw error
    }
  }, [])

  // Login with OAuth provider
  const loginWithProvider = useCallback(async (provider: 'google' | 'apple' | 'github') => {
    setState(s => ({ ...s, isLoading: true, error: null }))

    try {
      // Open OAuth popup
      const width = 500
      const height = 600
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        `${API_URL}/auth/${provider}`,
        'oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      // Listen for OAuth callback
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'oauth_success') {
          const { user, token, refreshToken } = event.data

          localStorage.setItem(TOKEN_KEY, token)
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          popup?.close()
        } else if (event.data.type === 'oauth_error') {
          setState(s => ({
            ...s,
            isLoading: false,
            error: event.data.error || 'OAuth failed',
          }))
          popup?.close()
        }
      }

      window.addEventListener('message', handleMessage)

      // Cleanup on popup close
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          setState(s => ({ ...s, isLoading: false }))
        }
      }, 500)
    } catch (error) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'OAuth failed',
      }))
      throw error
    }
  }, [])

  // Register new user
  const register = useCallback(async (data: RegisterData) => {
    setState(s => ({ ...s, isLoading: true, error: null }))

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }

      const { user, token, refreshToken } = await response.json()

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }))
      throw error
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (error) {
      logger.error('Logout error:', error)
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  // Forgot password
  const forgotPassword = useCallback(async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send reset email')
    }
  }, [])

  // Reset password
  const resetPassword = useCallback(async (token: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to reset password')
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(async (data: Partial<User>) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) throw new Error('Not authenticated')

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update profile')
    }

    const updatedUser = await response.json()
    setState(s => ({ ...s, user: updatedUser }))
  }, [])

  // Update preferences
  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) throw new Error('Not authenticated')

    const response = await fetch(`${API_URL}/auth/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(prefs),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update preferences')
    }

    const updatedPrefs = await response.json()
    setState(s => ({
      ...s,
      user: s.user ? { ...s.user, preferences: updatedPrefs } : null,
    }))
  }, [])

  // Refresh token
  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refresh) throw new Error('No refresh token')

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    })

    if (!response.ok) {
      // Refresh token expired, logout
      await logout()
      throw new Error('Session expired')
    }

    const { token: newToken, refreshToken: newRefresh } = await response.json()
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh)
  }, [logout])

  // Verify email
  const verifyEmail = useCallback(async (token: string) => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to verify email')
    }
  }, [])

  // Auto refresh token before expiry
  useEffect(() => {
    if (!state.isAuthenticated) return

    // Refresh every 14 minutes (assuming 15 min token expiry)
    const interval = setInterval(() => {
      refreshToken().catch(console.error)
    }, 14 * 60 * 1000)

    return () => clearInterval(interval)
  }, [state.isAuthenticated, refreshToken])

  const value: AuthContextValue = {
    ...state,
    login,
    loginWithProvider,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePreferences,
    refreshToken,
    verifyEmail,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Check if user has specific permission
export function usePermission(permission: string): boolean {
  const { user } = useAuth()
  
  // Define permission mappings based on plan
  const planPermissions: Record<string, string[]> = {
    free: ['basic_features', 'limited_agents'],
    pro: ['basic_features', 'limited_agents', 'unlimited_threads', 'xr_features', 'api_access'],
    enterprise: ['basic_features', 'limited_agents', 'unlimited_threads', 'xr_features', 'api_access', 'team_management', 'custom_agents', 'priority_support'],
  }

  if (!user) return false
  return planPermissions[user.plan]?.includes(permission) || false
}

// Get current auth token
export function useAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// ============================================================================
// PROTECTED ROUTE COMPONENT
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode
  requiredPlan?: 'free' | 'pro' | 'enterprise'
  requiredPermission?: string
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requiredPlan,
  requiredPermission,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()
  const hasPermission = usePermission(requiredPermission || '')

  // Show loading while checking auth
  if (isLoading) {
    return fallback || <AuthLoadingScreen />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check plan requirement
  if (requiredPlan && user) {
    const planHierarchy = { free: 0, pro: 1, enterprise: 2 }
    if (planHierarchy[user.plan] < planHierarchy[requiredPlan]) {
      return <Navigate to="/upgrade" state={{ requiredPlan }} replace />
    }
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

// ============================================================================
// AUTH UI COMPONENTS
// ============================================================================

// Loading screen during auth check
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-obsidian-base flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-cenote-turquoise/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-6 h-6 text-cenote-turquoise animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-sm text-ancient-stone">Chargement...</p>
      </div>
    </div>
  )
}

// User Avatar
export function UserAvatar({ 
  size = 'md',
  className = '',
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const { user } = useAuth()

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  if (!user) return null

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`rounded-full ${sizes[size]} ${className}`}
      />
    )
  }

  // Fallback to initials
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={`rounded-full bg-cenote-turquoise/20 text-cenote-turquoise flex items-center justify-center font-medium ${sizes[size]} ${className}`}>
      {initials}
    </div>
  )
}

// User Menu
export function UserMenu({ onLogout }: { onLogout?: () => void }) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    onLogout?.()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5"
      >
        <UserAvatar size="sm" />
        <span className="text-sm text-soft-sand hidden sm:block">{user.name}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-ui-slate rounded-xl border border-white/10 shadow-xl z-50">
            <div className="p-4 border-b border-white/5">
              <p className="text-sm font-medium text-soft-sand">{user.name}</p>
              <p className="text-xs text-ancient-stone">{user.email}</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                user.plan === 'pro' 
                  ? 'bg-sacred-gold/20 text-sacred-gold' 
                  : user.plan === 'enterprise'
                    ? 'bg-cenote-turquoise/20 text-cenote-turquoise'
                    : 'bg-white/10 text-ancient-stone'
              }`}>
                {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
              </span>
            </div>

            <div className="p-2">
              <MenuLink href="/settings/profile">Profil</MenuLink>
              <MenuLink href="/settings">Paramètres</MenuLink>
              <MenuLink href="/settings/billing">Facturation</MenuLink>
              <hr className="my-2 border-white/5" />
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MenuLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="block px-3 py-2 text-sm text-soft-sand hover:bg-white/5 rounded-lg"
    >
      {children}
    </a>
  )
}

// Token Budget Display
export function TokenBudget({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth()

  if (!user) return null

  const percentage = (user.tokensUsed / user.tokenBudget) * 100
  const isLow = percentage > 80
  const isCritical = percentage > 95

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          isCritical ? 'bg-red-500' : isLow ? 'bg-sacred-gold' : 'bg-jungle-emerald'
        }`} />
        <span className="text-xs text-ancient-stone">
          {user.tokensUsed.toLocaleString()} / {user.tokenBudget.toLocaleString()}
        </span>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-soft-sand">Budget Tokens</span>
        <span className={`text-xs ${
          isCritical ? 'text-red-400' : isLow ? 'text-sacred-gold' : 'text-jungle-emerald'
        }`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isCritical ? 'bg-red-500' : isLow ? 'bg-sacred-gold' : 'bg-jungle-emerald'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-ancient-stone mt-2">
        {user.tokensUsed.toLocaleString()} / {user.tokenBudget.toLocaleString()} tokens utilisés
      </p>
    </div>
  )
}

/**
 * CHE·NU™ — Protected Route Component
 * Ensures user is authenticated before rendering children
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import LoadingScreen from '@/components/ui/LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen message="Vérification de l'authentification..." />
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

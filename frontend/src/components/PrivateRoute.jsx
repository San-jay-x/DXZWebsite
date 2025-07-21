import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

/**
 * PrivateRoute Component
 * 
 * Protects routes that require authentication. Redirects unauthenticated 
 * users to the login page while preserving the intended destination.
 */
const PrivateRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Verifying authentication..." />
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login with the current location as state
    // This allows redirecting back after successful login
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname + location.search }}
        replace 
      />
    )
  }

  // Check if user email is verified (optional additional security)
  if (user && !user.isEmailVerified) {
    // You might want to redirect to email verification page
    // For now, we'll allow access but could add additional logic here
    console.warn('User email not verified:', user.email)
  }

  // User is authenticated, render the protected route
  return <Outlet />
}

export default PrivateRoute
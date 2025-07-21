import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

/**
 * PublicRoute Component
 * 
 * Protects public routes (login, register, etc.) that should only be
 * accessible to unauthenticated users. Redirects authenticated users
 * to the dashboard or their intended destination.
 */
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />
  }

  // If user is authenticated, redirect to dashboard or intended destination
  if (isAuthenticated) {
    // Check if there's a redirect destination from login state
    const from = location.state?.from || '/dashboard'
    
    return <Navigate to={from} replace />
  }

  // User is not authenticated, render the public route
  return <Outlet />
}

export default PublicRoute
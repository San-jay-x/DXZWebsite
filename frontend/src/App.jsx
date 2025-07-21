import React, { useEffect, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import { checkApiHealth } from './utils/api'

// Import components
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const VerifyEmailPage = React.lazy(() => import('./pages/VerifyEmailPage'))
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const DataManagerPage = React.lazy(() => import('./pages/DataManagerPage'))
const NameGeneratorPage = React.lazy(() => import('./pages/NameGeneratorPage'))
const JoinChannelsPage = React.lazy(() => import('./pages/JoinChannelsPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: 20,
    scale: 0.98
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

// Main App component
function App() {
  const { isAuthenticated, isLoading, loadUser } = useAuth()
  const { animationsEnabled, particlesEnabled } = useTheme()
  const location = useLocation()

  // Check API health and load user on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if API is running
        const health = await checkApiHealth()
        if (!health.success) {
          console.warn('API health check failed:', health.error)
        }
        
        // Load user if token exists
        const token = localStorage.getItem('token')
        if (token && !isAuthenticated && !isLoading) {
          await loadUser()
        }
        
        // Hide loading screen
        setTimeout(() => {
          document.body.classList.add('loaded')
        }, 1500)
        
      } catch (error) {
        console.error('App initialization error:', error)
        document.body.classList.add('loaded')
      }
    }

    initializeApp()
  }, [isAuthenticated, isLoading, loadUser])

  // Show loading spinner during initial load
  if (isLoading && !isAuthenticated) {
    return <LoadingSpinner fullScreen message="Loading your workspace..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 text-white overflow-x-hidden">
      {/* Background particles */}
      {particlesEnabled && (
        <div id="particles-bg" className="fixed inset-0 pointer-events-none opacity-20 z-0" />
      )}
      
      {/* Header - only show on authenticated routes */}
      {isAuthenticated && <Header />}
      
      {/* Main content area */}
      <main className={`relative z-10 ${isAuthenticated ? 'pt-20' : 'pt-0'}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={animationsEnabled ? 'initial' : 'in'}
            animate="in"
            exit={animationsEnabled ? 'out' : 'in'}
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes location={location}>
                {/* Public routes (only accessible when not authenticated) */}
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                </Route>

                {/* Private routes (only accessible when authenticated) */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/data-manager" element={<DataManagerPage />} />
                  <Route path="/name-generator" element={<NameGeneratorPage />} />
                  <Route path="/join-channels" element={<JoinChannelsPage />} />
                </Route>

                {/* Root redirect */}
                <Route 
                  path="/" 
                  element={
                    <Navigate 
                      to={isAuthenticated ? "/data-manager" : "/login"} 
                      replace 
                    />
                  } 
                />

                {/* 404 page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Background overlay for glassmorphism effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-secondary-900/10 pointer-events-none z-0" />
      
      {/* Background grid pattern */}
      <div className="fixed inset-0 bg-grid opacity-[0.02] pointer-events-none z-0" />
      
      {/* Floating orbs for visual interest */}
      {animationsEnabled && (
        <>
          <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full filter blur-3xl animate-float-slow pointer-events-none z-0" />
          <div className="fixed bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500/10 rounded-full filter blur-3xl animate-float pointer-events-none z-0" />
          <div className="fixed top-3/4 left-3/4 w-32 h-32 bg-accent-500/10 rounded-full filter blur-2xl animate-bounce-gentle pointer-events-none z-0" />
        </>
      )}
    </div>
  )
}

export default App
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Mail, Loader2, ArrowRight, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'

/**
 * VerifyEmailPage Component
 * 
 * Handles email verification process with token validation
 * and provides appropriate feedback based on verification status.
 */
const VerifyEmailPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { verifyEmail, resendVerification } = useAuth()
  const { animationsEnabled } = useTheme()

  const [verificationStatus, setVerificationStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [isResending, setIsResending] = useState(false)

  // Verify email token on component mount
  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setVerificationStatus('error')
        setErrorMessage('Invalid verification link. No token provided.')
        return
      }

      try {
        await verifyEmail(token)
        setVerificationStatus('success')
        toast.success('Email verified successfully!')
      } catch (error) {
        console.error('Email verification error:', error)
        setVerificationStatus('error')
        setErrorMessage(error.message || 'Email verification failed. The link may be expired or invalid.')
      }
    }

    handleVerification()
  }, [token, verifyEmail])

  // Handle resend verification
  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      await resendVerification()
      toast.success('Verification email sent! Please check your inbox.')
    } catch (error) {
      console.error('Resend verification error:', error)
      toast.error(error.message || 'Failed to resend verification email.')
    } finally {
      setIsResending(false)
    }
  }

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  }

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.3
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  // Render content based on verification status
  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <motion.div
              className="flex justify-center mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Verifying Email
            </h1>
            <p className="text-gray-400 mb-6">
              Please wait while we verify your email address...
            </p>

            <LoadingSpinner variant="dots" color="primary" />
          </motion.div>
        )

      case 'success':
        return (
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <motion.div
              className="flex justify-center mb-6"
              variants={iconVariants}
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-400 mb-8">
              Your email has been successfully verified. You can now access all features of DXZ Data Manager.
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Continue to Login
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        )

      case 'error':
        return (
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <motion.div
              className="flex justify-center mb-6"
              variants={iconVariants}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-400 mb-8">
              {errorMessage}
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isResending}
                onClick={handleResendVerification}
                leftIcon={<RotateCcw className="w-5 h-5" />}
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>

              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate('/register')}
              >
                Create New Account
              </Button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700" />
      
      {/* Floating particles */}
      {animationsEnabled && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-24 h-24 bg-accent-500/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
          />
        </>
      )}

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Card variant="default" size="lg" className="backdrop-blur-xl">
          {renderContent()}

          {/* Email info section */}
          {verificationStatus !== 'verifying' && (
            <motion.div 
              className="mt-8 pt-6 border-t border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>Check your email for more information</span>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-500">
            © 2024 DXZ Data Manager. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default VerifyEmailPage
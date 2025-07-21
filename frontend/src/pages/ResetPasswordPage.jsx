import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Lock, Shield, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { InlineMessage } from '../components/Message'
import LoadingSpinner from '../components/LoadingSpinner'

// Validation schema
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
})

/**
 * ResetPasswordPage Component
 * 
 * Handles password reset with token validation and provides
 * a secure form for setting a new password.
 */
const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const { animationsEnabled } = useTheme()

  const [resetStatus, setResetStatus] = useState('validating') // 'validating' | 'valid' | 'invalid' | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange'
  })

  // Watch password for strength indicator
  const watchedPassword = watch('password', '')

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' }
    
    let score = 0
    const checks = [
      { regex: /.{8,}/, label: 'At least 8 characters' },
      { regex: /[a-z]/, label: 'Lowercase letter' },
      { regex: /[A-Z]/, label: 'Uppercase letter' },
      { regex: /\d/, label: 'Number' },
      { regex: /[^A-Za-z0-9]/, label: 'Special character' }
    ]
    
    checks.forEach(check => {
      if (check.regex.test(password)) score++
    })

    if (score <= 2) return { score, label: 'Weak', color: 'text-red-400' }
    if (score <= 3) return { score, label: 'Fair', color: 'text-yellow-400' }
    if (score <= 4) return { score, label: 'Good', color: 'text-blue-400' }
    return { score, label: 'Strong', color: 'text-green-400' }
  }

  const passwordStrength = getPasswordStrength(watchedPassword)

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setResetStatus('invalid')
        setErrorMessage('Invalid reset link. No token provided.')
        return
      }

      try {
        // In a real implementation, you would validate the token with the backend
        // For now, we'll assume the token is valid if it exists
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        setResetStatus('valid')
      } catch (error) {
        console.error('Token validation error:', error)
        setResetStatus('invalid')
        setErrorMessage(error.message || 'Invalid or expired reset link.')
      }
    }

    validateToken()
  }, [token])

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await resetPassword(token, data.password)
      setResetStatus('success')
      toast.success('Password reset successfully!')
    } catch (error) {
      console.error('Reset password error:', error)
      setResetStatus('error')
      setErrorMessage(error.message || 'Password reset failed. Please try again.')
      toast.error(error.message || 'Password reset failed. Please try again.')
    } finally {
      setIsSubmitting(false)
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
        staggerChildren: 0.1
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

  // Render content based on reset status
  const renderContent = () => {
    switch (resetStatus) {
      case 'validating':
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
                <Shield className="w-8 h-8 text-primary-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Validating Reset Link
            </h1>
            <p className="text-gray-400 mb-6">
              Please wait while we verify your reset token...
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Password Reset Complete
            </h1>
            <p className="text-gray-400 mb-8">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/login')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Continue to Login
            </Button>
          </motion.div>
        )

      case 'invalid':
      case 'error':
        return (
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Reset Link Invalid
            </h1>
            <p className="text-gray-400 mb-8">
              {errorMessage}
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/forgot-password')}
              >
                Request New Reset Link
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </div>
          </motion.div>
        )

      case 'valid':
        return (
          <>
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Lock className="w-12 h-12 text-primary-400" />
                  <motion.div
                    className="absolute inset-0 bg-primary-400/20 rounded-full blur-md"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white font-orbitron mb-2">
                Reset Password
              </h1>
              <p className="text-gray-400">
                Enter your new password below
              </p>
            </motion.div>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              variants={itemVariants}
            >
              {/* Password field */}
              <div>
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  leftIcon={<Lock className="w-5 h-5" />}
                  showToggle={true}
                  error={errors.password?.message}
                  disabled={isSubmitting}
                  {...register('password')}
                />
                
                {/* Password strength indicator */}
                {watchedPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={passwordStrength.color}>{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <motion.div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          passwordStrength.score <= 2 ? 'bg-red-400' :
                          passwordStrength.score <= 3 ? 'bg-yellow-400' :
                          passwordStrength.score <= 4 ? 'bg-blue-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        layoutId="passwordStrength"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm password field */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your new password"
                leftIcon={<Shield className="w-5 h-5" />}
                showToggle={true}
                error={errors.confirmPassword?.message}
                disabled={isSubmitting}
                {...register('confirmPassword')}
              />

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </motion.form>
          </>
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

export default ResetPasswordPage
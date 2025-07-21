import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { InlineMessage } from '../components/Message'

// Validation schema
const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
})

/**
 * ForgotPasswordPage Component
 * 
 * Allows users to request a password reset link via email.
 * Features a clean, professional design with success feedback.
 */
const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()
  const { animationsEnabled } = useTheme()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange'
  })

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await forgotPassword(data.email)
      setEmailAddress(data.email)
      setEmailSent(true)
      toast.success('Password reset email sent!')
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error(error.message || 'Failed to send reset email. Please try again.')
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

  // Success view
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700" />
        
        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="default" size="lg" className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Check Your Email
            </h1>
            <p className="text-gray-400 mb-2">
              We've sent a password reset link to:
            </p>
            <p className="text-primary-400 font-medium mb-6">
              {emailAddress}
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Click the link in the email to reset your password. If you don't see it, check your spam folder.
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setEmailSent(false)}
                leftIcon={<Mail className="w-5 h-5" />}
              >
                Send Another Email
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={() => window.location.href = '/login'}
                leftIcon={<ArrowLeft className="w-5 h-5" />}
              >
                Back to Login
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
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
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Mail className="w-12 h-12 text-primary-400" />
                <motion.div
                  className="absolute inset-0 bg-primary-400/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white font-orbitron mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-400">
              Enter your email address and we'll send you a reset link
            </p>
          </motion.div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Email field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register('email')}
            />

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              rightIcon={<Send className="w-5 h-5" />}
            >
              {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>
          </motion.form>

          {/* Helper text */}
          <motion.div 
            className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            variants={itemVariants}
          >
            <p className="text-sm text-blue-400 text-center">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </motion.div>

          {/* Security note */}
          <motion.div 
            className="mt-6 text-center"
            variants={itemVariants}
          >
            <p className="text-xs text-gray-500">
              For security reasons, we'll only send reset links to registered email addresses.
            </p>
          </motion.div>
        </Card>

        {/* Back to login link */}
        <motion.div 
          className="text-center mt-6"
          variants={itemVariants}
        >
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </motion.div>

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

export default ForgotPasswordPage
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { InlineMessage } from '../components/Message'

// Validation schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
})

/**
 * LoginPage Component
 * 
 * Professional login page with glassmorphism design, form validation,
 * and smooth animations. Includes forgot password functionality.
 */
const LoginPage = () => {
  const { login, isLoading, error: authError } = useAuth()
  const { animationsEnabled } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange'
  })

  // Get redirect destination from location state
  const redirectTo = location.state?.from || '/dashboard'

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please try again.')
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
                <Sparkles className="w-12 h-12 text-primary-400" />
                <motion.div
                  className="absolute inset-0 bg-primary-400/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white font-orbitron mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your DXZ Data Manager account
            </p>
          </motion.div>

          {/* Error message */}
          {authError && (
            <motion.div variants={itemVariants} className="mb-6">
              <InlineMessage type="error">
                {authError}
              </InlineMessage>
            </motion.div>
          )}

          {/* Login form */}
          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Email field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register('email')}
            />

            {/* Password field */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              showToggle={true}
              error={errors.password?.message}
              disabled={isSubmitting}
              {...register('password')}
            />

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

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
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </motion.form>

          {/* Divider */}
          <motion.div 
            className="my-8 flex items-center"
            variants={itemVariants}
          >
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </motion.div>

          {/* Register link */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Create one now
              </Link>
            </p>
          </motion.div>

          {/* Features preview */}
          <motion.div 
            className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-white/10"
            variants={itemVariants}
          >
            <div className="text-center">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4 text-primary-400" />
              </div>
              <p className="text-xs text-gray-400">Secure Data</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-secondary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ArrowRight className="w-4 h-4 text-secondary-400" />
              </div>
              <p className="text-xs text-gray-400">Fast Access</p>
            </div>
          </motion.div>
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

export default LoginPage
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Mail, Lock, User, UserPlus, Sparkles, ArrowRight, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { InlineMessage } from '../components/Message'

// Validation schema
const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions')
})

/**
 * RegisterPage Component
 * 
 * Professional registration page with comprehensive validation, 
 * email verification flow, and futuristic design.
 */
const RegisterPage = () => {
  const { register: authRegister, isLoading, error: authError } = useAuth()
  const { animationsEnabled } = useTheme()
  const navigate = useNavigate()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationStep, setRegistrationStep] = useState('form') // 'form' | 'success'

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm({
    resolver: yupResolver(registerSchema),
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

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await authRegister(data.username, data.email, data.password)
      setRegistrationStep('success')
      toast.success('Registration successful! Please check your email for verification.')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
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
  if (registrationStep === 'success') {
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
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white font-orbitron mb-4">
              Check Your Email
            </h1>
            <p className="text-gray-400 mb-6">
              We've sent a verification link to your email address. Please click the link to activate your account.
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Continue to Login
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setRegistrationStep('form')}
              >
                Back to Registration
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
                <UserPlus className="w-12 h-12 text-primary-400" />
                <motion.div
                  className="absolute inset-0 bg-primary-400/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white font-orbitron mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">
              Join DXZ Data Manager and secure your data
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

          {/* Registration form */}
          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Username field */}
            <Input
              label="Username"
              type="text"
              placeholder="Choose a username"
              leftIcon={<User className="w-5 h-5" />}
              error={errors.username?.message}
              disabled={isSubmitting}
              {...register('username')}
            />

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
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
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
              placeholder="Confirm your password"
              leftIcon={<Shield className="w-5 h-5" />}
              showToggle={true}
              error={errors.confirmPassword?.message}
              disabled={isSubmitting}
              {...register('confirmPassword')}
            />

            {/* Terms and conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                className="mt-1 w-4 h-4 text-primary-600 bg-transparent border border-gray-500 rounded focus:ring-primary-500 focus:ring-2"
                {...register('agreeToTerms')}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm">{errors.agreeToTerms.message}</p>
            )}

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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
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

          {/* Login link */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in instead
              </Link>
            </p>
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

export default RegisterPage
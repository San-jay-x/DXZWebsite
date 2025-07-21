import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, Sparkles, AlertTriangle } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Button from '../components/Button'

/**
 * NotFoundPage Component
 * 
 * A futuristic 404 error page with navigation options and animations.
 * Provides different navigation options based on authentication status.
 */
const NotFoundPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { animationsEnabled } = useTheme()

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

  const glitchVariants = {
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      skew: [0, 1, -1, 1, -1, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: 'easeInOut'
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
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
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-500/10 rounded-full blur-xl"
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

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl text-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* 404 Number with glitch effect */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-primary-400 to-accent-400 font-orbitron select-none"
            variants={animationsEnabled ? glitchVariants : {}}
            animate={animationsEnabled ? "animate" : {}}
          >
            404
          </motion.h1>
          
          {/* Glitch overlay effects */}
          {animationsEnabled && (
            <>
              <motion.div
                className="absolute inset-0 text-8xl md:text-9xl font-bold text-red-400 font-orbitron select-none opacity-20"
                animate={{
                  x: [0, 3, -3, 0],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                  times: [0, 0.3, 0.7, 1]
                }}
              >
                404
              </motion.div>
              
              <motion.div
                className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-400 font-orbitron select-none opacity-20"
                animate={{
                  x: [0, -2, 2, 0],
                  opacity: [0, 0.2, 0],
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: 0.1,
                  times: [0, 0.3, 0.7, 1]
                }}
              >
                404
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Error message */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center"
              variants={pulseVariants}
              animate={animationsEnabled ? "animate" : {}}
            >
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </motion.div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white font-orbitron mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-400 mb-2">
            The page you're looking for doesn't exist in this dimension.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Navigation options */}
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
              leftIcon={<Home className="w-5 h-5" />}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Go Back
            </Button>
          </div>

          {/* Additional navigation for authenticated users */}
          {isAuthenticated && (
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/data-manager')}
              >
                Data Manager
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/name-generator')}
              >
                Name Generator
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/join-channels')}
              >
                Join Channels
              </Button>
            </div>
          )}
        </motion.div>

        {/* Fun facts card */}
        <motion.div 
          className="mt-12"
          variants={itemVariants}
        >
          <Card variant="transparent" size="md" className="max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="w-5 h-5 text-accent-400" />
              <h3 className="text-lg font-semibold text-white">Did you know?</h3>
            </div>
            <p className="text-gray-400 text-sm">
              HTTP 404 errors were named after room 404 at CERN, where the original web servers were located. 
              When the servers couldn't find a page, they'd say it was "not found" in room 404!
            </p>
          </Card>
        </motion.div>

        {/* Search suggestion */}
        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm">
            Looking for something specific? Try using the navigation menu or contact support.
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      {animationsEnabled && (
        <>
          {/* Floating error icons */}
          <motion.div
            className="absolute top-20 left-10 text-red-400/20"
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <AlertTriangle className="w-8 h-8" />
          </motion.div>

          <motion.div
            className="absolute bottom-20 right-10 text-primary-400/20"
            animate={{
              y: [20, -20, 20],
              rotate: [0, -10, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
          >
            <Search className="w-6 h-6" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-20 text-accent-400/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </>
      )}
    </div>
  )
}

export default NotFoundPage
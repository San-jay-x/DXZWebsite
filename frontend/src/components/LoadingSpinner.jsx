import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

/**
 * LoadingSpinner Component
 * 
 * A versatile loading spinner with multiple variants:
 * - default: Regular spinner for inline use
 * - fullscreen: Full screen overlay spinner
 * - button: Small spinner for buttons
 * - dots: Animated dots for subtle loading
 */
const LoadingSpinner = ({ 
  variant = 'default', 
  size = 'md', 
  message, 
  fullScreen = false,
  color = 'primary'
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  // Color configurations
  const colorClasses = {
    primary: 'text-primary-400',
    secondary: 'text-secondary-400',
    accent: 'text-accent-400',
    white: 'text-white',
    gray: 'text-gray-400'
  }

  // Animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity
      }
    }
  }

  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  }

  // Fullscreen overlay spinner
  if (fullScreen || variant === 'fullscreen') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="text-center">
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className="inline-block"
          >
            <Sparkles className={`${sizeClasses.xl} ${colorClasses[color]} mb-4`} />
          </motion.div>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg font-medium"
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.div>
    )
  }

  // Button spinner
  if (variant === 'button') {
    return (
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="inline-block"
      >
        <Loader2 className={`${sizeClasses.sm} ${colorClasses[color]}`} />
      </motion.div>
    )
  }

  // Dots spinner
  if (variant === 'dots') {
    return (
      <motion.div
        variants={dotsVariants}
        animate="animate"
        className="flex space-x-1"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={dotVariants}
            className={`w-2 h-2 rounded-full ${colorClasses[color] === 'text-primary-400' ? 'bg-primary-400' : 
              colorClasses[color] === 'text-secondary-400' ? 'bg-secondary-400' : 
              colorClasses[color] === 'text-accent-400' ? 'bg-accent-400' : 'bg-gray-400'}`}
          />
        ))}
      </motion.div>
    )
  }

  // Pulse spinner
  if (variant === 'pulse') {
    return (
      <motion.div
        variants={pulseVariants}
        animate="animate"
        className={`rounded-full border-2 border-current ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    )
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="inline-block"
      >
        <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]}`} />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-sm"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner
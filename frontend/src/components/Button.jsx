import React from 'react'
import { motion } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Includes smooth animations and loading states.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  ...props
}) => {
  // Base button classes
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-800
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    transform-gpu hover:scale-[1.02] active:scale-[0.98]
    ${fullWidth ? 'w-full' : ''}
  `

  // Variant styles
  const variants = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-500
      hover:from-primary-500 hover:to-primary-400
      text-white shadow-lg shadow-primary-500/25
      hover:shadow-primary-500/40 hover:shadow-xl
      focus:ring-primary-500
      border border-primary-500/50 hover:border-primary-400/50
    `,
    secondary: `
      bg-gradient-to-r from-secondary-600 to-secondary-500
      hover:from-secondary-500 hover:to-secondary-400
      text-white shadow-lg shadow-secondary-500/25
      hover:shadow-secondary-500/40 hover:shadow-xl
      focus:ring-secondary-500
      border border-secondary-500/50 hover:border-secondary-400/50
    `,
    outline: `
      bg-transparent border-2 border-primary-500/50
      hover:border-primary-400 hover:bg-primary-500/10
      text-primary-400 hover:text-primary-300
      focus:ring-primary-500
      backdrop-blur-sm
    `,
    ghost: `
      bg-transparent hover:bg-white/5
      text-gray-300 hover:text-white
      focus:ring-gray-500
      border border-transparent hover:border-white/10
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-500
      hover:from-red-500 hover:to-red-400
      text-white shadow-lg shadow-red-500/25
      hover:shadow-red-500/40 hover:shadow-xl
      focus:ring-red-500
      border border-red-500/50 hover:border-red-400/50
    `,
    glass: `
      bg-glass backdrop-blur-md border border-white/10
      hover:bg-white/10 hover:border-white/20
      text-white shadow-lg
      focus:ring-white/50
    `
  }

  // Size styles
  const sizes = {
    xs: 'px-3 py-1.5 text-xs min-h-[32px]',
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
    xl: 'px-10 py-5 text-xl min-h-[60px]'
  }

  // Icon sizes based on button size
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  // Handle click with loading state
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : "initial"}
      whileTap={!disabled && !loading ? "tap" : "initial"}
      {...props}
    >
      <motion.div
        className="flex items-center justify-center space-x-2"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left icon */}
        {leftIcon && !loading && (
          <span className={`${iconSizes[size]} flex-shrink-0`}>
            {leftIcon}
          </span>
        )}

        {/* Loading spinner */}
        {loading && (
          <LoadingSpinner 
            variant="button" 
            size="sm" 
            color={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'} 
          />
        )}

        {/* Button text */}
        {children && (
          <span className={loading && !leftIcon && !rightIcon ? 'ml-2' : ''}>
            {children}
          </span>
        )}

        {/* Right icon */}
        {rightIcon && !loading && (
          <span className={`${iconSizes[size]} flex-shrink-0`}>
            {rightIcon}
          </span>
        )}
      </motion.div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-white/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={false}
        whileTap={{
          background: [
            'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
            'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)'
          ]
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  )
}

export default Button
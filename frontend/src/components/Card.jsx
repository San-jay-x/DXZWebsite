import React from 'react'
import { motion } from 'framer-motion'

/**
 * Card Component
 * 
 * A versatile card component with glassmorphism effects, hover animations,
 * and multiple variants for different use cases throughout the application.
 */
const Card = ({
  children,
  variant = 'default',
  size = 'md',
  hover = true,
  clickable = false,
  elevated = false,
  bordered = true,
  rounded = 'xl',
  className = '',
  onClick,
  ...props
}) => {
  // Base card classes
  const baseClasses = `
    relative overflow-hidden transition-all duration-300 ease-out
    ${clickable ? 'cursor-pointer' : ''}
    ${bordered ? 'border' : ''}
  `

  // Variant styles
  const variants = {
    default: `
      bg-glass backdrop-blur-md border-white/10
      hover:border-white/20 hover:bg-white/5
    `,
    solid: `
      bg-dark-800/90 border-dark-600
      hover:border-dark-500 hover:bg-dark-700/90
    `,
    gradient: `
      bg-gradient-to-br from-primary-900/20 to-secondary-900/20
      border-primary-500/20 hover:border-primary-400/30
      hover:from-primary-900/30 hover:to-secondary-900/30
    `,
    transparent: `
      bg-transparent border-white/5
      hover:border-white/10 hover:bg-white/5
    `,
    highlight: `
      bg-gradient-to-br from-accent-900/30 to-primary-900/30
      border-accent-500/30 hover:border-accent-400/50
      hover:from-accent-900/40 hover:to-primary-900/40
    `,
    dark: `
      bg-dark-900/50 border-dark-700
      hover:border-dark-600 hover:bg-dark-800/50
    `
  }

  // Size configurations
  const sizes = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  // Rounded configurations
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  }

  // Animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    hover: hover ? {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    } : {},
    tap: clickable ? {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    } : {}
  }

  const shadowVariants = {
    initial: {
      boxShadow: elevated 
        ? '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    hover: hover ? {
      boxShadow: elevated
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 20px -5px rgba(0, 0, 0, 0.2)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
    } : {}
  }

  // Handle click events
  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.div
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${roundedClasses[rounded]}
        ${className}
      `}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={hover ? "hover" : undefined}
      whileTap={clickable ? "tap" : undefined}
      onClick={handleClick}
      {...props}
    >
      {/* Shadow animation layer */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={shadowVariants}
        initial="initial"
        whileHover={hover ? "hover" : undefined}
      />

      {/* Glow effect for highlight variant */}
      {variant === 'highlight' && (
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-inherit"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover overlay effect */}
      {hover && (
        <motion.div
          className="absolute inset-0 bg-white/5 rounded-inherit"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Border gradient effect */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 rounded-inherit bg-gradient-to-br from-primary-500/20 to-secondary-500/20 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

/**
 * CardHeader Component
 * Header section for cards with consistent styling
 */
export const CardHeader = ({ 
  children, 
  className = '', 
  divided = false,
  ...props 
}) => {
  return (
    <div 
      className={`
        ${divided ? 'border-b border-white/10 pb-4 mb-6' : 'mb-4'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardTitle Component
 * Title for card headers with consistent typography
 */
export const CardTitle = ({ 
  children, 
  size = 'lg',
  className = '', 
  ...props 
}) => {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  }

  return (
    <h3 
      className={`
        text-white font-orbitron
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * CardContent Component
 * Main content area for cards
 */
export const CardContent = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardFooter Component
 * Footer section for cards with actions or additional info
 */
export const CardFooter = ({ 
  children, 
  className = '',
  divided = false,
  ...props 
}) => {
  return (
    <div 
      className={`
        ${divided ? 'border-t border-white/10 pt-4 mt-6' : 'mt-4'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
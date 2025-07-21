import React, { useState, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, Check, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Input Component
 * 
 * A versatile input component with glassmorphism styling, validation states,
 * and support for various input types including password toggle and copy functionality.
 */
const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  showCopy = false,
  showToggle = false,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Size configurations
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-5 py-4 text-lg min-h-[52px]'
  }

  // Variant styles
  const variants = {
    default: `
      bg-glass backdrop-blur-md border border-white/10
      hover:border-white/20 focus:border-primary-400/50
      text-white placeholder-gray-400
    `,
    filled: `
      bg-dark-700/50 border border-dark-600
      hover:border-dark-500 focus:border-primary-400
      text-white placeholder-gray-400
    `,
    outline: `
      bg-transparent border-2 border-gray-600
      hover:border-gray-500 focus:border-primary-400
      text-white placeholder-gray-400
    `
  }

  // Input type handling
  const inputType = type === 'password' && showPassword ? 'text' : type

  // Handle focus events
  const handleFocus = (e) => {
    setIsFocused(true)
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  // Copy to clipboard functionality
  const handleCopy = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value)
        toast.success('Copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy')
      }
    }
  }

  // Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const labelVariants = {
    default: { 
      scale: 1, 
      y: 0,
      color: error ? '#ef4444' : success ? '#10b981' : '#9ca3af'
    },
    focused: { 
      scale: 0.85, 
      y: -20,
      color: error ? '#ef4444' : success ? '#10b981' : '#3b82f6'
    }
  }

  const inputVariants = {
    initial: { 
      boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
      scale: 1
    },
    focused: { 
      boxShadow: error ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 
                 success ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 
                 '0 0 0 2px rgba(59, 130, 246, 0.2)',
      scale: 1.01
    }
  }

  return (
    <motion.div
      className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Label */}
      {label && (
        <motion.label
          className={`
            absolute left-4 pointer-events-none origin-left
            transition-all duration-200 ease-out font-medium
            ${isFocused || value ? 'transform -translate-y-5 scale-85' : ''}
            ${error ? 'text-red-400' : success ? 'text-green-400' : isFocused ? 'text-primary-400' : 'text-gray-400'}
          `}
          variants={labelVariants}
          animate={isFocused || value ? 'focused' : 'default'}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input field */}
        <motion.input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? '' : placeholder}
          disabled={disabled}
          className={`
            w-full rounded-xl transition-all duration-300 ease-out
            focus:outline-none focus:ring-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variants[variant]}
            ${sizes[size]}
            ${label ? 'pt-6 pb-2' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || showCopy || (type === 'password' && showToggle) ? 'pr-12' : ''}
            ${error ? 'border-red-400/50 focus:border-red-400' : ''}
            ${success ? 'border-green-400/50 focus:border-green-400' : ''}
          `}
          variants={inputVariants}
          animate={isFocused ? 'focused' : 'initial'}
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Success/Error icons */}
          {success && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-green-400"
            >
              <Check className="w-5 h-5" />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
            </motion.div>
          )}

          {/* Copy button */}
          {showCopy && value && (
            <motion.button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Copy className="w-5 h-5" />
            </motion.button>
          )}

          {/* Password toggle */}
          {type === 'password' && showToggle && (
            <motion.button
              type="button"
              onClick={togglePassword}
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          )}

          {/* Custom right icon */}
          {rightIcon && !success && !error && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Helper text or error message */}
      {(helperText || error) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-2 text-sm ${error ? 'text-red-400' : 'text-gray-400'}`}
        >
          {error || helperText}
        </motion.div>
      )}
    </motion.div>
  )
})

Input.displayName = 'Input'

export default Input
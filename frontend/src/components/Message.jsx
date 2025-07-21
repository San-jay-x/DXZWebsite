import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Sparkles
} from 'lucide-react'

/**
 * Message Component
 * 
 * A versatile message component for displaying alerts, notifications, and status updates.
 * Supports different types (success, error, warning, info) with appropriate styling and icons.
 */
const Message = ({
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
  icon: CustomIcon,
  className = '',
  showAnimation = true,
  ...props
}) => {
  // Type configurations
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      iconColor: 'text-green-400',
      glowColor: 'shadow-green-500/20'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      iconColor: 'text-red-400',
      glowColor: 'shadow-red-500/20'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-400',
      glowColor: 'shadow-yellow-500/20'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-400',
      glowColor: 'shadow-blue-500/20'
    },
    custom: {
      icon: Sparkles,
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/30',
      textColor: 'text-primary-400',
      iconColor: 'text-primary-400',
      glowColor: 'shadow-primary-500/20'
    }
  }

  const config = typeConfig[type] || typeConfig.info
  const IconComponent = CustomIcon || config.icon

  // Animation variants
  const messageVariants = {
    initial: {
      opacity: 0,
      x: 300,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      x: 300,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  }

  const iconVariants = {
    initial: { 
      scale: 0,
      rotate: -180
    },
    animate: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
        delay: 0.1
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <motion.div
      className={`
        relative flex items-start space-x-4 p-4 rounded-xl border backdrop-blur-sm
        ${config.bgColor} ${config.borderColor} ${config.glowColor} shadow-lg
        ${className}
      `}
      variants={showAnimation ? messageVariants : {}}
      initial={showAnimation ? 'initial' : false}
      animate={showAnimation ? 'animate' : false}
      exit={showAnimation ? 'exit' : false}
      {...props}
    >
      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl ${config.bgColor} opacity-50`}
        variants={pulseVariants}
        animate="animate"
      />

      {/* Icon */}
      <motion.div
        className="flex-shrink-0 relative z-10"
        variants={showAnimation ? iconVariants : {}}
        initial={showAnimation ? 'initial' : false}
        animate={showAnimation ? 'animate' : false}
      >
        <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        
        {/* Icon glow effect */}
        <motion.div
          className={`absolute inset-0 ${config.iconColor} opacity-20 blur-sm`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative z-10">
        {title && (
          <motion.h4
            className={`text-sm font-semibold ${config.textColor} mb-1`}
            initial={showAnimation ? { opacity: 0, y: 10 } : false}
            animate={showAnimation ? { opacity: 1, y: 0 } : false}
            transition={showAnimation ? { delay: 0.2 } : {}}
          >
            {title}
          </motion.h4>
        )}
        
        {message && (
          <motion.p
            className="text-sm text-gray-300 leading-relaxed"
            initial={showAnimation ? { opacity: 0, y: 10 } : false}
            animate={showAnimation ? { opacity: 1, y: 0 } : false}
            transition={showAnimation ? { delay: 0.3 } : {}}
          >
            {message}
          </motion.p>
        )}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <motion.button
          onClick={onDismiss}
          className={`
            flex-shrink-0 p-1 rounded-lg transition-all duration-200
            ${config.textColor} hover:bg-white/10 hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-white/20
            relative z-10
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={showAnimation ? { opacity: 0, scale: 0 } : false}
          animate={showAnimation ? { opacity: 1, scale: 1 } : false}
          transition={showAnimation ? { delay: 0.4 } : {}}
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      {/* Border glow animation */}
      <motion.div
        className={`absolute inset-0 rounded-xl border ${config.borderColor} opacity-0`}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

/**
 * MessageContainer Component
 * 
 * Container for managing multiple messages with stacking and animations
 */
export const MessageContainer = ({ 
  messages = [], 
  position = 'top-right',
  className = '' 
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <div className={`fixed z-50 max-w-sm w-full ${positionClasses[position]} ${className}`}>
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {messages.map((message) => (
            <Message
              key={message.id}
              {...message}
              showAnimation={true}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}

/**
 * Inline Message Component
 * 
 * For inline messages within forms or content areas
 */
export const InlineMessage = ({ 
  type = 'info', 
  children, 
  className = '',
  ...props 
}) => {
  const config = {
    success: 'text-green-400 bg-green-500/10 border-green-500/30',
    error: 'text-red-400 bg-red-500/10 border-red-500/30',
    warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  }

  return (
    <motion.div
      className={`
        flex items-center space-x-2 p-3 rounded-lg border text-sm
        ${config[type]} ${className}
      `}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Message
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  Shuffle, 
  BarChart3, 
  MessageCircle, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  Moon,
  Sun,
  Palette,
  Volume2,
  VolumeX
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Button from './Button'
import Card from './Card'

/**
 * Header Component
 * 
 * Navigation header with user menu, theme controls, and responsive design.
 * Features glassmorphism styling and smooth animations.
 */
const Header = () => {
  const { user, logout } = useAuth()
  const { 
    currentTheme, 
    animationsEnabled, 
    particlesEnabled, 
    setTheme, 
    toggleAnimations, 
    setParticles 
  } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)

  // Navigation items
  const navigationItems = [
    {
      name: 'Data Manager',
      path: '/data-manager',
      icon: Database,
      description: 'Manage your data'
    },
    {
      name: 'Name Generator',
      path: '/name-generator',
      icon: Shuffle,
      description: 'Generate random names'
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: BarChart3,
      description: 'View analytics'
    },
    {
      name: 'Join Channels',
      path: '/join-channels',
      icon: MessageCircle,
      description: 'Social media links'
    }
  ]

  // Theme options
  const themes = [
    { name: 'Default', value: 'default', colors: ['#3b82f6', '#8b5cf6', '#06b6d4'] },
    { name: 'Neon', value: 'neon', colors: ['#00ff88', '#ff0080', '#0080ff'] },
    { name: 'Sunset', value: 'sunset', colors: ['#ff6b35', '#f7931e', '#ffcb05'] },
    { name: 'Ocean', value: 'ocean', colors: ['#0066cc', '#004499', '#002266'] }
  ]

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check if current path is active
  const isActivePath = (path) => location.pathname === path

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-primary-400" />
                <motion.div
                  className="absolute inset-0 bg-primary-400/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold font-orbitron text-white">
                DXZ Data Manager
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.path)
              
              return (
                <motion.div key={item.path} whileHover={{ scale: 1.05 }}>
                  <Link
                    to={item.path}
                    className={`
                      relative px-4 py-2 rounded-xl transition-all duration-300
                      flex items-center space-x-2 group
                      ${isActive 
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-primary-500/10 rounded-xl border border-primary-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Controls */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                leftIcon={<Palette className="w-4 h-4" />}
                className="hidden sm:flex"
              />
              
              <AnimatePresence>
                {isThemeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-64 z-50"
                    onMouseLeave={() => setIsThemeMenuOpen(false)}
                  >
                    <Card variant="default" size="sm" className="p-4">
                      <div className="space-y-4">
                        {/* Theme Selection */}
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Theme</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {themes.map((theme) => (
                              <button
                                key={theme.value}
                                onClick={() => setTheme(theme.value)}
                                className={`
                                  p-2 rounded-lg border transition-all text-left
                                  ${currentTheme === theme.value 
                                    ? 'border-primary-400 bg-primary-500/20' 
                                    : 'border-white/10 hover:border-white/20'
                                  }
                                `}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="flex space-x-1">
                                    {theme.colors.map((color, index) => (
                                      <div
                                        key={index}
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-300">{theme.name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-2">
                          <button
                            onClick={toggleAnimations}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                          >
                            <span className="text-sm text-gray-300">Animations</span>
                            <div className="text-gray-400">
                              {animationsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </div>
                          </button>
                          
                          <button
                            onClick={() => setParticles(!particlesEnabled)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                          >
                            <span className="text-sm text-gray-300">Particles</span>
                            <div className="text-gray-400">
                              {particlesEnabled ? <Sparkles className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </div>
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                leftIcon={<User className="w-4 h-4" />}
                className="hidden sm:flex"
              >
                {user?.username || 'User'}
              </Button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-64 z-50"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <Card variant="default" size="sm" className="p-4">
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="border-b border-white/10 pb-3">
                          <p className="font-medium text-white">{user?.username}</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 text-left">
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">Settings</span>
                          </button>
                          
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-red-500/10 text-left text-red-400"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              leftIcon={isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              className="md:hidden"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 py-4"
            >
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePath(item.path)
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-3 p-3 rounded-xl transition-all
                        ${isActive 
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
                
                {/* Mobile User Section */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <p className="font-medium text-white">{user?.username}</p>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      leftIcon={<LogOut className="w-4 h-4" />}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
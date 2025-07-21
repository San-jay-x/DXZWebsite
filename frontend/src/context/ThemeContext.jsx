import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Theme context
const ThemeContext = createContext()

// Theme actions
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_ANIMATIONS: 'TOGGLE_ANIMATIONS',
  SET_PARTICLES: 'SET_PARTICLES',
  SET_GLASS_INTENSITY: 'SET_GLASS_INTENSITY',
  RESET_PREFERENCES: 'RESET_PREFERENCES'
}

// Available themes
const THEMES = {
  DARK: 'dark',
  DARKER: 'darker',
  CYBERPUNK: 'cyberpunk'
}

// Initial state
const initialState = {
  currentTheme: THEMES.DARK,
  animationsEnabled: true,
  particlesEnabled: true,
  glassIntensity: 'medium', // low, medium, high
  reducedMotion: false
}

// Load preferences from localStorage
const loadPreferences = () => {
  try {
    const saved = localStorage.getItem('dxz-theme-preferences')
    if (saved) {
      const preferences = JSON.parse(saved)
      return { ...initialState, ...preferences }
    }
  } catch (error) {
    console.error('Error loading theme preferences:', error)
  }
  return initialState
}

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        currentTheme: action.payload
      }

    case THEME_ACTIONS.TOGGLE_ANIMATIONS:
      return {
        ...state,
        animationsEnabled: !state.animationsEnabled
      }

    case THEME_ACTIONS.SET_PARTICLES:
      return {
        ...state,
        particlesEnabled: action.payload
      }

    case THEME_ACTIONS.SET_GLASS_INTENSITY:
      return {
        ...state,
        glassIntensity: action.payload
      }

    case THEME_ACTIONS.RESET_PREFERENCES:
      return initialState

    default:
      return state
  }
}

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, loadPreferences())

  // Save preferences to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('dxz-theme-preferences', JSON.stringify(state))
    } catch (error) {
      console.error('Error saving theme preferences:', error)
    }
  }, [state])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('theme-dark', 'theme-darker', 'theme-cyberpunk')
    
    // Add current theme class
    root.classList.add(`theme-${state.currentTheme}`)
    
    // Apply animation preferences
    if (!state.animationsEnabled) {
      root.classList.add('reduce-animations')
    } else {
      root.classList.remove('reduce-animations')
    }
    
    // Apply glass intensity
    root.classList.remove('glass-low', 'glass-medium', 'glass-high')
    root.classList.add(`glass-${state.glassIntensity}`)
    
  }, [state.currentTheme, state.animationsEnabled, state.glassIntensity])

  // Check for system reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = (e) => {
      if (e.matches && state.animationsEnabled) {
        // User prefers reduced motion, but animations are enabled
        // We could auto-disable animations here or show a notification
        console.log('User prefers reduced motion')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    handleChange(mediaQuery) // Check initial state
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [state.animationsEnabled])

  // Generate particle background
  useEffect(() => {
    if (!state.particlesEnabled) return

    const createParticles = () => {
      const particlesContainer = document.getElementById('particles-bg')
      if (!particlesContainer) return

      // Clear existing particles
      particlesContainer.innerHTML = ''

      // Create new particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        
        // Random positioning and size
        const size = Math.random() * 4 + 2 + 'px'
        const left = Math.random() * 100 + '%'
        const top = Math.random() * 100 + '%'
        const delay = Math.random() * 6 + 's'
        
        particle.style.cssText = `
          width: ${size};
          height: ${size};
          left: ${left};
          top: ${top};
          animation-delay: ${delay};
        `
        
        particlesContainer.appendChild(particle)
      }
    }

    createParticles()
    
    // Recreate particles periodically for variety
    const interval = setInterval(createParticles, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [state.particlesEnabled])

  // Theme functions
  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme })
    }
  }

  const toggleAnimations = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_ANIMATIONS })
  }

  const setParticles = (enabled) => {
    dispatch({ type: THEME_ACTIONS.SET_PARTICLES, payload: enabled })
    
    // Clear particles immediately if disabled
    if (!enabled) {
      const particlesContainer = document.getElementById('particles-bg')
      if (particlesContainer) {
        particlesContainer.innerHTML = ''
      }
    }
  }

  const setGlassIntensity = (intensity) => {
    if (['low', 'medium', 'high'].includes(intensity)) {
      dispatch({ type: THEME_ACTIONS.SET_GLASS_INTENSITY, payload: intensity })
    }
  }

  const resetPreferences = () => {
    dispatch({ type: THEME_ACTIONS.RESET_PREFERENCES })
  }

  // Get theme-specific colors and styles
  const getThemeConfig = () => {
    const configs = {
      [THEMES.DARK]: {
        name: 'Professional Dark',
        description: 'Clean and professional dark theme',
        colors: {
          primary: '#6366f1',
          secondary: '#d946ef',
          accent: '#10b981',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        }
      },
      [THEMES.DARKER]: {
        name: 'Deep Space',
        description: 'Ultra-dark theme for low-light environments',
        colors: {
          primary: '#8b5cf6',
          secondary: '#ec4899',
          accent: '#06d6a0',
          background: 'linear-gradient(135deg, #000000 0%, #0f172a 50%, #1e293b 100%)'
        }
      },
      [THEMES.CYBERPUNK]: {
        name: 'Cyberpunk',
        description: 'Vibrant neon theme inspired by cyberpunk aesthetics',
        colors: {
          primary: '#00ffff',
          secondary: '#ff00ff',
          accent: '#ffff00',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a1a1a 100%)'
        }
      }
    }
    
    return configs[state.currentTheme] || configs[THEMES.DARK]
  }

  // Context value
  const value = {
    // State
    currentTheme: state.currentTheme,
    animationsEnabled: state.animationsEnabled,
    particlesEnabled: state.particlesEnabled,
    glassIntensity: state.glassIntensity,
    
    // Constants
    THEMES,
    
    // Functions
    setTheme,
    toggleAnimations,
    setParticles,
    setGlassIntensity,
    resetPreferences,
    getThemeConfig,
    
    // Computed values
    themeConfig: getThemeConfig()
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

export default ThemeContext
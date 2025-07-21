import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

// Auth context
const AuthContext = createContext()

// Auth state types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null
}

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }

    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start if token exists
  useEffect(() => {
    if (state.token) {
      loadUser()
    }
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START })
      
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: response.data.data
        })
        
        toast.success('Login successful! Welcome back!')
        return { success: true }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      })
      
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START })
      
      const response = await api.post('/auth/register', userData)
      
      if (response.data.success) {
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS })
        
        toast.success('Registration successful! Please check your email to verify your account.')
        return { success: true }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      })
      
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Load user function
  const loadUser = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_START })
      
      const response = await api.get('/auth/me')
      
      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
          payload: response.data.data
        })
      }
      
    } catch (error) {
      console.error('Load user error:', error)
      
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_FAILURE,
        payload: error.response?.data?.message || 'Failed to load user'
      })
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if user is authenticated
      if (state.isAuthenticated) {
        await api.post('/auth/logout')
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.success('Logged out successfully')
    }
  }

  // Verify email function
  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`)
      
      if (response.data.success) {
        toast.success('Email verified successfully! You can now log in.')
        return { success: true }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Resend verification email
  const resendVerification = async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email })
      
      if (response.data.success) {
        toast.success('Verification email sent successfully!')
        return { success: true }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification email'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      
      if (response.data.success) {
        toast.success('Password reset email sent! Check your inbox.')
        return { success: true }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Reset password function
  const resetPassword = async (token, passwords) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, passwords)
      
      if (response.data.success) {
        toast.success('Password reset successful! You can now log in.')
        return { success: true }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Change password function
  const changePassword = async (passwords) => {
    try {
      const response = await api.post('/auth/change-password', passwords)
      
      if (response.data.success) {
        toast.success('Password changed successfully!')
        return { success: true }
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    loadUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext
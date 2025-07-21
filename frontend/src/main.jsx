import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './styles/index.css'

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <div className="glass max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold gradient-text mb-4">
              Something went wrong
            </h1>
            <p className="text-dark-300 mb-6">
              An unexpected error occurred. Please refresh the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Toast configuration
const toastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: 'rgba(31, 41, 55, 0.9)',
    color: '#fff',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    fontSize: '14px',
    fontWeight: '500'
  },
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff'
    }
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff'
    }
  },
  loading: {
    iconTheme: {
      primary: '#6366f1',
      secondary: '#fff'
    }
  }
}

// Main app with providers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
            <Toaster toastOptions={toastOptions} />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
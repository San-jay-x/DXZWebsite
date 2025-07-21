import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api', // Will be proxied to backend in development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle common responses and errors
api.interceptors.response.use(
  (response) => {
    // Calculate request duration for debugging
    const duration = new Date() - response.config.metadata.startTime
    console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
    
    return response
  },
  (error) => {
    // Calculate request duration for debugging
    if (error.config?.metadata) {
      const duration = new Date() - error.config.metadata.startTime
      console.error(`API ${error.config.method?.toUpperCase()} ${error.config.url} - ${duration}ms - Error: ${error.response?.status}`)
    }
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - token might be expired
          if (data?.message !== 'Invalid email/username or password') {
            // Don't remove token for login failures, only for expired/invalid tokens
            localStorage.removeItem('token')
            
            // Only show toast if it's not a login page error
            if (!window.location.pathname.includes('/login')) {
              toast.error('Session expired. Please log in again.')
              // Redirect to login after a delay
              setTimeout(() => {
                window.location.href = '/login'
              }, 2000)
            }
          }
          break
          
        case 403:
          toast.error('Access denied. You don\'t have permission to perform this action.')
          break
          
        case 404:
          // Don't show toast for 404s as they might be intentional
          console.warn('Resource not found:', error.config.url)
          break
          
        case 429:
          toast.error('Too many requests. Please slow down and try again.')
          break
          
        case 500:
          toast.error('Server error. Please try again later.')
          break
          
        case 503:
          toast.error('Service temporarily unavailable. Please try again later.')
          break
          
        default:
          // For other errors, show the message from the server if available
          if (data?.message && !data.message.includes('validation')) {
            toast.error(data.message)
          }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.request)
      toast.error('Network error. Please check your internet connection.')
    } else {
      // Something else happened
      console.error('Request setup error:', error.message)
      toast.error('An unexpected error occurred.')
    }
    
    return Promise.reject(error)
  }
)

// API helper functions
export const apiHelpers = {
  // Generic GET request with error handling
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Generic POST request with error handling
  post: async (url, data, config = {}) => {
    try {
      const response = await api.post(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Generic PUT request with error handling
  put: async (url, data, config = {}) => {
    try {
      const response = await api.put(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Generic PATCH request with error handling
  patch: async (url, data, config = {}) => {
    try {
      const response = await api.patch(url, data, config)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Generic DELETE request with error handling
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // File download helper
  downloadFile: async (url, filename, config = {}) => {
    try {
      const response = await api.get(url, {
        ...config,
        responseType: 'blob'
      })
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
      
      return { success: true }
    } catch (error) {
      throw error
    }
  },
  
  // Upload file helper
  uploadFile: async (url, file, onProgress) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      }
      
      const response = await api.post(url, formData, config)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Health check function
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('API health check failed:', error)
    return { success: false, error: error.message }
  }
}

// Auth-specific API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, passwords) => api.post(`/auth/reset-password/${token}`, passwords),
  changePassword: (passwords) => api.post('/auth/change-password', passwords)
}

// Data management API functions
export const dataAPI = {
  saveData: (data) => api.post('/data', data),
  getData: () => api.get('/data'),
  getDataByDate: (date) => api.get(`/data/${date}`),
  deleteEntry: (id) => api.delete(`/data/${id}`),
  deleteByDate: (date) => api.delete(`/data/date/${date}`),
  exportTxt: (date) => apiHelpers.downloadFile(`/data/export/txt${date ? `?date=${date}` : ''}`, `dxz-data${date ? `-${date}` : ''}.txt`),
  exportXlsx: (date) => apiHelpers.downloadFile(`/data/export/xlsx${date ? `?date=${date}` : ''}`, `dxz-data${date ? `-${date}` : ''}.xlsx`),
  extractUID: (input) => api.post('/data/extract-uid', { input }),
  getStats: () => api.get('/data/stats/overview')
}

// Names API functions
export const namesAPI = {
  getRandomNames: (gender, count = 5) => api.get(`/names/${gender}?count=${count}`),
  searchNames: (gender, query, page = 1, limit = 20) => api.get(`/names/search/${gender}?q=${query}&page=${page}&limit=${limit}`),
  getStats: (gender) => api.get(`/names/stats/${gender}`),
  getOverview: () => api.get('/names/stats/overview'),
  seedDatabase: () => api.post('/names/seed'),
  clearDatabase: () => api.delete('/names/clear'),
  validateDatabase: () => api.post('/names/validate')
}

export default api
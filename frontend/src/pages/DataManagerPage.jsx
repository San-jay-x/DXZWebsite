import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { 
  Plus, 
  Database, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  Download, 
  Calendar, 
  Search,
  Filter,
  Key,
  Mail,
  Shield,
  ExternalLink,
  RefreshCw,
  Clock,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Link as LinkIcon
} from 'lucide-react'
import { TOTP } from 'otpauth'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { dataAPI } from '../utils/api'

// Validation schema for data entry
const dataEntrySchema = yup.object().shape({
  date: yup
    .string()
    .required('Date is required'),
  uid: yup
    .string()
    .optional(),
  password: yup
    .string()
    .optional(),
  twoFaKey: yup
    .string()
    .optional(),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .optional()
})

/**
 * DataManagerPage Component
 * 
 * Comprehensive data management interface with entry forms, viewing,
 * filtering, export, 2FA code generation, and UID extraction.
 */
const DataManagerPage = () => {
  const { user } = useAuth()
  const { animationsEnabled } = useTheme()

  // State management
  const [userData, setUserData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('add') // 'add' | 'view'
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [showPasswords, setShowPasswords] = useState({})
  const [twoFaCodes, setTwoFaCodes] = useState({})
  const [codeTimers, setCodeTimers] = useState({})
  const [facebookUrl, setFacebookUrl] = useState('')
  const [extractedUid, setExtractedUid] = useState('')

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(dataEntrySchema),
    mode: 'onChange',
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd')
    }
  })

  const watchedTwoFaKey = watch('twoFaKey', '')

  // Load user data
  useEffect(() => {
    loadUserData()
  }, [])

  // Filter data when search term or date filter changes
  useEffect(() => {
    filterData()
  }, [userData, searchTerm, dateFilter])

  // Generate 2FA codes for entries with keys
  useEffect(() => {
    const generateCodes = () => {
      const newCodes = {}
      const newTimers = {}
      
      userData.forEach(entry => {
        if (entry.twoFaKey) {
          try {
            const totp = new TOTP({
              issuer: 'DXZ Data Manager',
              label: `Entry-${entry._id}`,
              algorithm: 'SHA1',
              digits: 6,
              period: 30,
              secret: entry.twoFaKey
            })
            
            const code = totp.generate()
            const remainingTime = 30 - (Math.floor(Date.now() / 1000) % 30)
            
            newCodes[entry._id] = code
            newTimers[entry._id] = remainingTime
          } catch (error) {
            console.error('Error generating TOTP for entry:', entry._id, error)
          }
        }
      })
      
      setTwoFaCodes(newCodes)
      setCodeTimers(newTimers)
    }

    generateCodes()
    const interval = setInterval(generateCodes, 1000)
    return () => clearInterval(interval)
  }, [userData])

  // Load user data from API
  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const response = await dataAPI.getAllData()
      setUserData(response.data || [])
    } catch (error) {
      console.error('Failed to load user data:', error)
      toast.error('Failed to load your data')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter data based on search and date
  const filterData = () => {
    let filtered = userData

    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.uid && entry.uid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.email && entry.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (dateFilter) {
      filtered = filtered.filter(entry => entry.date === dateFilter)
    }

    setFilteredData(filtered)
  }

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== '')
      )

      if (Object.keys(cleanData).length <= 1) { // Only date field
        toast.error('Please enter at least one data field')
        return
      }

      await dataAPI.saveData(cleanData)
      toast.success('Data saved successfully!')
      reset({ date: format(new Date(), 'yyyy-MM-dd') })
      loadUserData()
      setActiveTab('view')
    } catch (error) {
      console.error('Failed to save data:', error)
      toast.error(error.response?.data?.message || 'Failed to save data')
    }
  }

  // Extract Facebook UID from URL
  const extractFacebookUid = async () => {
    try {
      if (!facebookUrl.trim()) {
        toast.error('Please enter a Facebook URL')
        return
      }

      const response = await dataAPI.extractUid({ url: facebookUrl })
      const uid = response.data.uid
      
      if (uid) {
        setExtractedUid(uid)
        setValue('uid', uid)
        toast.success('UID extracted successfully!')
      } else {
        toast.error('Could not extract UID from this URL')
      }
    } catch (error) {
      console.error('Failed to extract UID:', error)
      toast.error('Failed to extract UID from URL')
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = (entryId) => {
    setShowPasswords(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }))
  }

  // Delete entry
  const deleteEntry = async (entryId) => {
    try {
      await dataAPI.deleteEntry(entryId)
      toast.success('Entry deleted successfully!')
      loadUserData()
    } catch (error) {
      console.error('Failed to delete entry:', error)
      toast.error('Failed to delete entry')
    }
  }

  // Delete all entries for a date
  const deleteByDate = async (date) => {
    try {
      await dataAPI.deleteByDate(date)
      toast.success(`All entries for ${date} deleted successfully!`)
      loadUserData()
    } catch (error) {
      console.error('Failed to delete entries:', error)
      toast.error('Failed to delete entries')
    }
  }

  // Export data
  const exportData = async (format) => {
    try {
      const response = await dataAPI.exportData(format)
      
      // Create download link
      const blob = new Blob([response.data], {
        type: format === 'xlsx' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/plain'
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dxz-data-export-${format(new Date(), 'yyyy-MM-dd')}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success(`Data exported as ${format.toUpperCase()}!`)
    } catch (error) {
      console.error('Failed to export data:', error)
      toast.error('Failed to export data')
    }
  }

  // Generate live 2FA code for form input
  const generateLive2FA = (key) => {
    if (!key) return null
    
    try {
      const totp = new TOTP({
        issuer: 'DXZ Data Manager',
        label: 'Live Preview',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: key
      })
      
      return totp.generate()
    } catch (error) {
      return null
    }
  }

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  }

  // Get unique dates for filter
  const uniqueDates = [...new Set(userData.map(entry => entry.date))].sort().reverse()

  // Group data by date
  const groupedData = filteredData.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = []
    acc[entry.date].push(entry)
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen message="Loading your data..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 p-6">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white font-orbitron mb-2">
                Data Manager
              </h1>
              <p className="text-gray-400 text-lg">
                Securely manage your passwords, UIDs, 2FA keys, and emails
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-gray-400 text-sm">Total Entries</p>
                <p className="text-2xl font-bold text-white">
                  {userData.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants}>
          <div className="flex space-x-1 bg-glass backdrop-blur-md rounded-xl p-1 mb-8 w-fit">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'add'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Data
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'view'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-5 h-5 inline mr-2" />
              View Data ({userData.length})
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'add' ? (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add Data Form */}
              <Card variant="default" size="lg">
                <CardHeader divided>
                  <CardTitle>Add New Data Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Date field */}
                    <Input
                      label="Date"
                      type="date"
                      leftIcon={<Calendar className="w-5 h-5" />}
                      error={errors.date?.message}
                      {...register('date')}
                    />

                    {/* Facebook UID Extraction */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="w-5 h-5 text-blue-400" />
                        <label className="text-white font-medium">Facebook UID Extraction</label>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Paste Facebook profile URL here..."
                          value={facebookUrl}
                          onChange={(e) => setFacebookUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={extractFacebookUid}
                          disabled={!facebookUrl.trim()}
                        >
                          Extract UID
                        </Button>
                      </div>
                      
                      {extractedUid && (
                        <div className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400">UID extracted: {extractedUid}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(extractedUid, 'UID')}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* UID field */}
                    <Input
                      label="Facebook UID"
                      placeholder="Enter Facebook UID"
                      leftIcon={<ExternalLink className="w-5 h-5" />}
                      showCopy={true}
                      error={errors.uid?.message}
                      {...register('uid')}
                    />

                    {/* Password field */}
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Enter password"
                      leftIcon={<Key className="w-5 h-5" />}
                      showToggle={true}
                      showCopy={true}
                      error={errors.password?.message}
                      {...register('password')}
                    />

                    {/* 2FA Key field with live preview */}
                    <div className="space-y-2">
                      <Input
                        label="2FA Secret Key"
                        placeholder="Enter 2FA secret key"
                        leftIcon={<Shield className="w-5 h-5" />}
                        showCopy={true}
                        error={errors.twoFaKey?.message}
                        {...register('twoFaKey')}
                      />
                      
                      {watchedTwoFaKey && (
                        <div className="flex items-center space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400">Live 2FA Code:</span>
                          <span className="font-mono text-white text-lg">
                            {generateLive2FA(watchedTwoFaKey) || 'Invalid key'}
                          </span>
                          {generateLive2FA(watchedTwoFaKey) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(generateLive2FA(watchedTwoFaKey), '2FA Code')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Email field */}
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter email address"
                      leftIcon={<Mail className="w-5 h-5" />}
                      showCopy={true}
                      error={errors.email?.message}
                      {...register('email')}
                    />

                    {/* Submit button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={!isValid}
                      leftIcon={<Plus className="w-5 h-5" />}
                    >
                      Save Data Entry
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Filters and Actions */}
              <Card variant="default">
                <CardContent>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Search and filters */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search data..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-glass border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none"
                        />
                      </div>
                      
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-4 py-2 bg-glass border border-white/10 rounded-lg text-white focus:border-primary-400 focus:outline-none"
                      >
                        <option value="">All Dates</option>
                        {uniqueDates.map(date => (
                          <option key={date} value={date}>{date}</option>
                        ))}
                      </select>
                    </div>

                    {/* Export buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData('txt')}
                        leftIcon={<FileText className="w-4 h-4" />}
                      >
                        Export TXT
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportData('xlsx')}
                        leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                      >
                        Export Excel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Display */}
              {Object.keys(groupedData).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedData)
                    .sort(([a], [b]) => new Date(b) - new Date(a))
                    .map(([date, entries]) => (
                      <Card key={date} variant="default" size="lg">
                        <CardHeader divided>
                          <div className="flex items-center justify-between">
                            <CardTitle>{date} ({entries.length} entries)</CardTitle>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteByDate(date)}
                              leftIcon={<Trash2 className="w-4 h-4" />}
                            >
                              Delete All
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {entries.map((entry, index) => (
                              <motion.div
                                key={entry._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-glass border border-white/10 rounded-lg p-6"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {/* UID */}
                                  {entry.uid && (
                                    <div>
                                      <label className="text-gray-400 text-sm">Facebook UID</label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-white font-mono text-sm break-all">
                                          {entry.uid}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(entry.uid, 'UID')}
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Password */}
                                  {entry.password && (
                                    <div>
                                      <label className="text-gray-400 text-sm">Password</label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-white font-mono text-sm">
                                          {showPasswords[entry._id] ? entry.password : '••••••••'}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => togglePasswordVisibility(entry._id)}
                                        >
                                          {showPasswords[entry._id] ? 
                                            <EyeOff className="w-4 h-4" /> : 
                                            <Eye className="w-4 h-4" />
                                          }
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(entry.password, 'Password')}
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* 2FA */}
                                  {entry.twoFaKey && (
                                    <div>
                                      <label className="text-gray-400 text-sm">2FA Code</label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-green-400 font-mono text-lg font-bold">
                                          {twoFaCodes[entry._id] || '------'}
                                        </span>
                                        <div className="w-8 h-8 relative">
                                          <svg className="w-8 h-8 transform -rotate-90">
                                            <circle
                                              cx="16"
                                              cy="16"
                                              r="14"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              fill="transparent"
                                              className="text-gray-600"
                                            />
                                            <circle
                                              cx="16"
                                              cy="16"
                                              r="14"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              fill="transparent"
                                              strokeDasharray="87.96"
                                              strokeDashoffset={87.96 * (1 - (codeTimers[entry._id] || 0) / 30)}
                                              className="text-green-400 transition-all duration-1000"
                                            />
                                          </svg>
                                          <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                                            {codeTimers[entry._id] || 0}
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(twoFaCodes[entry._id], '2FA Code')}
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Email */}
                                  {entry.email && (
                                    <div>
                                      <label className="text-gray-400 text-sm">Email</label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-white text-sm break-all">
                                          {entry.email}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(entry.email, 'Email')}
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Entry actions */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                  <span className="text-gray-500 text-xs">
                                    Added: {new Date(entry.createdAt).toLocaleString()}
                                  </span>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => deleteEntry(entry._id)}
                                    leftIcon={<Trash2 className="w-4 h-4" />}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card variant="default" size="lg">
                  <CardContent>
                    <div className="text-center py-12">
                      <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Data Found</h3>
                      <p className="text-gray-400 mb-6">
                        {searchTerm || dateFilter ? 
                          'No data matches your current filters.' : 
                          'You haven\'t added any data yet. Start by adding your first entry.'
                        }
                      </p>
                      {!searchTerm && !dateFilter && (
                        <Button
                          variant="primary"
                          onClick={() => setActiveTab('add')}
                          leftIcon={<Plus className="w-5 h-5" />}
                        >
                          Add Your First Entry
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default DataManagerPage
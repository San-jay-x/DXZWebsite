import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shuffle, 
  Copy, 
  User, 
  Users, 
  RefreshCw, 
  Download,
  Sparkles,
  Target,
  Clock,
  CheckCircle,
  Key,
  Calendar,
  BarChart3
} from 'lucide-react'
import { format, addDays } from 'date-fns'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { namesAPI } from '../utils/api'

/**
 * NameGeneratorPage Component
 * 
 * Random Indian name generator with password generation,
 * copy functionality, and statistics display.
 */
const NameGeneratorPage = () => {
  const { user } = useAuth()
  const { animationsEnabled } = useTheme()

  // State management
  const [selectedGender, setSelectedGender] = useState('male')
  const [generatedNames, setGeneratedNames] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [nameStats, setNameStats] = useState({
    male: 0,
    female: 0,
    total: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [copiedItems, setCopiedItems] = useState({})
  const [generationHistory, setGenerationHistory] = useState([])

  // Load name statistics
  useEffect(() => {
    loadNameStats()
  }, [])

  // Load statistics
  const loadNameStats = async () => {
    try {
      setIsLoadingStats(true)
      const [maleResponse, femaleResponse] = await Promise.all([
        namesAPI.getStatistics('male'),
        namesAPI.getStatistics('female')
      ])

      const maleCount = maleResponse.data.count || 0
      const femaleCount = femaleResponse.data.count || 0

      setNameStats({
        male: maleCount,
        female: femaleCount,
        total: maleCount + femaleCount
      })
    } catch (error) {
      console.error('Failed to load name statistics:', error)
      toast.error('Failed to load name statistics')
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Generate random names
  const generateNames = async () => {
    try {
      setIsGenerating(true)
      const response = await namesAPI.getRandomNames(selectedGender)
      const names = response.data.names || []

      // Generate passwords for each name
      const namesWithPasswords = names.map(name => ({
        ...name,
        id: Math.random().toString(36).substr(2, 9),
        generatedPassword: generatePassword(name.firstName),
        timestamp: new Date()
      }))

      setGeneratedNames(namesWithPasswords)
      
      // Add to history
      setGenerationHistory(prev => [
        {
          id: Date.now(),
          gender: selectedGender,
          count: names.length,
          timestamp: new Date()
        },
        ...prev.slice(0, 9) // Keep last 10 generations
      ])

      toast.success(`Generated ${names.length} ${selectedGender} names!`)
    } catch (error) {
      console.error('Failed to generate names:', error)
      toast.error('Failed to generate names. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate password in the specified format: Username+FirstName+@+TomorrowDate
  const generatePassword = (firstName) => {
    const tomorrow = addDays(new Date(), 1)
    const tomorrowDate = format(tomorrow, 'ddMMyyyy') // Format: DDMMYYYY
    return `${user?.username || 'user'}${firstName}@${tomorrowDate}`
  }

  // Copy to clipboard with visual feedback
  const copyToClipboard = async (text, type, itemId) => {
    try {
      await navigator.clipboard.writeText(text)
      
      // Set copied state for visual feedback
      setCopiedItems(prev => ({
        ...prev,
        [`${itemId}-${type}`]: true
      }))

      // Remove copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => ({
          ...prev,
          [`${itemId}-${type}`]: false
        }))
      }, 2000)

      toast.success(`${type} copied to clipboard!`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  // Export names as text file
  const exportNames = () => {
    if (generatedNames.length === 0) {
      toast.error('No names to export')
      return
    }

    const content = generatedNames.map(name => 
      `Name: ${name.firstName} ${name.surname}\nPassword: ${name.generatedPassword}\n---`
    ).join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `indian-names-${selectedGender}-${format(new Date(), 'yyyy-MM-dd')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('Names exported successfully!')
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

  const nameCardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    }
  }

  if (isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen message="Loading name generator..." />
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
                Random Name Generator
              </h1>
              <p className="text-gray-400 text-lg">
                Generate authentic Indian names with custom passwords
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-gray-400 text-sm">Available Names</p>
                <p className="text-2xl font-bold text-white">
                  {nameStats.total.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Shuffle className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="default" hover={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Male Names</p>
                  <p className="text-3xl font-bold text-blue-400 mb-2">
                    {nameStats.male.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Unique Indian male names</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card variant="default" hover={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Female Names</p>
                  <p className="text-3xl font-bold text-pink-400 mb-2">
                    {nameStats.female.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Unique Indian female names</p>
                </div>
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-400" />
                </div>
              </div>
            </Card>

            <Card variant="default" hover={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Total Names</p>
                  <p className="text-3xl font-bold text-accent-400 mb-2">
                    {nameStats.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Combined database</p>
                </div>
                <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent-400" />
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Generator Controls */}
        <motion.div variants={itemVariants}>
          <Card variant="default" size="lg">
            <CardHeader divided>
              <CardTitle>Generate Names</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                {/* Gender Selection */}
                <div className="space-y-4">
                  <label className="text-white font-medium">Select Gender</label>
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={() => setSelectedGender('male')}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedGender === 'male'
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <User className="w-5 h-5 inline mr-2" />
                      Male ({nameStats.male})
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setSelectedGender('female')}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedGender === 'female'
                          ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                          : 'bg-glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Users className="w-5 h-5 inline mr-2" />
                      Female ({nameStats.female})
                    </motion.button>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex space-x-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={generateNames}
                    loading={isGenerating}
                    disabled={isGenerating}
                    leftIcon={<Shuffle className="w-5 h-5" />}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Names'}
                  </Button>

                  {generatedNames.length > 0 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={exportNames}
                      leftIcon={<Download className="w-5 h-5" />}
                    >
                      Export
                    </Button>
                  )}
                </div>
              </div>

              {/* Password Format Info */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Key className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Password Format</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Generated passwords follow the format: <span className="font-mono text-white">
                    {user?.username || 'username'}FirstName@{format(addDays(new Date(), 1), 'ddMMyyyy')}
                  </span>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Example: {user?.username || 'user'}Arjun@{format(addDays(new Date(), 1), 'ddMMyyyy')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Names */}
        <AnimatePresence>
          {generatedNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card variant="default" size="lg">
                <CardHeader divided>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Generated {selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1)} Names
                    </CardTitle>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {format(generatedNames[0]?.timestamp || new Date(), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedNames.map((name, index) => (
                      <motion.div
                        key={name.id}
                        variants={nameCardVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card variant="glass" hover={true} className="relative overflow-hidden">
                          <div className="space-y-4">
                            {/* Name Display */}
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl font-bold text-white">
                                  {name.firstName.charAt(0)}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-white font-orbitron">
                                {name.firstName}
                              </h3>
                              <p className="text-gray-400">
                                {name.surname}
                              </p>
                            </div>

                            {/* Copy Actions */}
                            <div className="space-y-3">
                              {/* Copy First Name */}
                              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                                <div>
                                  <p className="text-gray-400 text-xs">First Name</p>
                                  <p className="text-white font-medium">{name.firstName}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(name.firstName, 'First Name', name.id)}
                                  className={copiedItems[`${name.id}-First Name`] ? 'text-green-400' : ''}
                                >
                                  {copiedItems[`${name.id}-First Name`] ? 
                                    <CheckCircle className="w-4 h-4" /> : 
                                    <Copy className="w-4 h-4" />
                                  }
                                </Button>
                              </div>

                              {/* Copy Surname */}
                              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                                <div>
                                  <p className="text-gray-400 text-xs">Surname</p>
                                  <p className="text-white font-medium">{name.surname}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(name.surname, 'Surname', name.id)}
                                  className={copiedItems[`${name.id}-Surname`] ? 'text-green-400' : ''}
                                >
                                  {copiedItems[`${name.id}-Surname`] ? 
                                    <CheckCircle className="w-4 h-4" /> : 
                                    <Copy className="w-4 h-4" />
                                  }
                                </Button>
                              </div>

                              {/* Copy Full Name */}
                              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                                <div>
                                  <p className="text-gray-400 text-xs">Full Name</p>
                                  <p className="text-white font-medium">{name.firstName} {name.surname}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(`${name.firstName} ${name.surname}`, 'Full Name', name.id)}
                                  className={copiedItems[`${name.id}-Full Name`] ? 'text-green-400' : ''}
                                >
                                  {copiedItems[`${name.id}-Full Name`] ? 
                                    <CheckCircle className="w-4 h-4" /> : 
                                    <Copy className="w-4 h-4" />
                                  }
                                </Button>
                              </div>

                              {/* Copy Generated Password */}
                              <div className="flex items-center justify-between p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <p className="text-primary-400 text-xs font-medium">Generated Password</p>
                                  <p className="text-white font-mono text-sm truncate">
                                    {name.generatedPassword}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(name.generatedPassword, 'Password', name.id)}
                                  className={copiedItems[`${name.id}-Password`] ? 'text-green-400' : 'text-primary-400'}
                                >
                                  {copiedItems[`${name.id}-Password`] ? 
                                    <CheckCircle className="w-4 h-4" /> : 
                                    <Copy className="w-4 h-4" />
                                  }
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Background decoration */}
                          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-xl" />
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generation History */}
        {generationHistory.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card variant="default">
              <CardHeader divided>
                <CardTitle>Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generationHistory.slice(0, 5).map((generation) => (
                    <div key={generation.id} className="flex items-center justify-between p-3 bg-glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          generation.gender === 'male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                        }`}>
                          {generation.gender === 'male' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            Generated {generation.count} {generation.gender} names
                          </p>
                          <p className="text-gray-400 text-sm">
                            {format(generation.timestamp, 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {generatedNames.length === 0 && !isGenerating && (
          <motion.div variants={itemVariants}>
            <Card variant="default" size="lg">
              <CardContent>
                <div className="text-center py-12">
                  <Shuffle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Names</h3>
                  <p className="text-gray-400 mb-6">
                    Select a gender and click "Generate Names" to get 5 random Indian names with custom passwords.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Each generation provides 5 unique names</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default NameGeneratorPage
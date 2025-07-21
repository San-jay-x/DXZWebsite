import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Database, 
  Shuffle, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Shield, 
  Calendar,
  Activity,
  BarChart3,
  Plus,
  Eye,
  Download,
  Sparkles,
  Clock,
  CheckCircle
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { dataAPI, namesAPI } from '../utils/api'

/**
 * DashboardPage Component
 * 
 * Main dashboard with analytics, recent activity, quick actions,
 * and overview of user data with futuristic design.
 */
const DashboardPage = () => {
  const { user } = useAuth()
  const { animationsEnabled } = useTheme()
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState({
    totalEntries: 0,
    recentEntries: [],
    dataByDate: {},
    statistics: {
      thisWeek: 0,
      thisMonth: 0,
      totalDates: 0
    }
  })
  const [nameStats, setNameStats] = useState({
    maleNames: 0,
    femaleNames: 0,
    totalNames: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Load user data statistics
        const dataResponse = await dataAPI.getAllData()
        const userData = dataResponse.data

        // Load name statistics
        const [maleStatsResponse, femaleStatsResponse] = await Promise.all([
          namesAPI.getStatistics('male'),
          namesAPI.getStatistics('female')
        ])

        // Process user data
        const totalEntries = userData.length
        const recentEntries = userData.slice(0, 5) // Get 5 most recent
        
        // Group data by date
        const dataByDate = userData.reduce((acc, entry) => {
          const date = entry.date
          if (!acc[date]) acc[date] = []
          acc[date].push(entry)
          return acc
        }, {})

        // Calculate statistics
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        const thisWeek = userData.filter(entry => 
          new Date(entry.createdAt) >= oneWeekAgo
        ).length

        const thisMonth = userData.filter(entry => 
          new Date(entry.createdAt) >= oneMonthAgo
        ).length

        setDashboardData({
          totalEntries,
          recentEntries,
          dataByDate,
          statistics: {
            thisWeek,
            thisMonth,
            totalDates: Object.keys(dataByDate).length
          }
        })

        setNameStats({
          maleNames: maleStatsResponse.data.count || 0,
          femaleNames: femaleStatsResponse.data.count || 0,
          totalNames: (maleStatsResponse.data.count || 0) + (femaleStatsResponse.data.count || 0)
        })

        // Generate recent activity
        generateRecentActivity(userData)

      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Generate recent activity based on user data
  const generateRecentActivity = (userData) => {
    const activities = []
    
    if (userData.length > 0) {
      const latestEntry = userData[0]
      activities.push({
        id: 1,
        type: 'data_added',
        message: 'Added new data entry',
        time: new Date(latestEntry.createdAt),
        icon: Database,
        color: 'text-green-400'
      })
    }

    activities.push({
      id: 2,
      type: 'login',
      message: 'Logged into DXZ Data Manager',
      time: new Date(),
      icon: Shield,
      color: 'text-blue-400'
    })

    if (userData.length >= 5) {
      activities.push({
        id: 3,
        type: 'milestone',
        message: 'Reached 5+ data entries',
        time: new Date(userData[4].createdAt),
        icon: TrendingUp,
        color: 'text-purple-400'
      })
    }

    setRecentActivity(activities.slice(0, 3))
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

  // Quick action cards
  const quickActions = [
    {
      title: 'Add Data',
      description: 'Add new passwords, UIDs, or 2FA keys',
      icon: Plus,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      onClick: () => navigate('/data-manager')
    },
    {
      title: 'Generate Names',
      description: 'Create random Indian names with passwords',
      icon: Shuffle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      onClick: () => navigate('/name-generator')
    },
    {
      title: 'View Data',
      description: 'Browse and manage your stored data',
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      onClick: () => navigate('/data-manager')
    },
    {
      title: 'Join Channels',
      description: 'Connect with our community',
      icon: MessageCircle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      onClick: () => navigate('/join-channels')
    }
  ]

  // Statistics cards
  const statsCards = [
    {
      title: 'Total Entries',
      value: dashboardData.totalEntries,
      icon: Database,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      change: dashboardData.statistics.thisWeek > 0 ? `+${dashboardData.statistics.thisWeek} this week` : 'No new entries this week'
    },
    {
      title: 'Active Dates',
      value: dashboardData.statistics.totalDates,
      icon: Calendar,
      color: 'text-secondary-400',
      bgColor: 'bg-secondary-500/10',
      change: 'Unique dates with data'
    },
    {
      title: 'Available Names',
      value: nameStats.totalNames,
      icon: Users,
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/10',
      change: `${nameStats.maleNames} male, ${nameStats.femaleNames} female`
    },
    {
      title: 'This Month',
      value: dashboardData.statistics.thisMonth,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: 'Entries added this month'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen message="Loading your dashboard..." />
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
        {/* Welcome Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white font-orbitron mb-2">
                Welcome back, {user?.username}! 👋
              </h1>
              <p className="text-gray-400 text-lg">
                Here's what's happening with your data today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-gray-400 text-sm">Last login</p>
                <p className="text-white font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={index}
                  variant="default"
                  hover={true}
                  className="relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-white mb-2">
                        {stat.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  
                  {/* Background decoration */}
                  <div className={`absolute -top-2 -right-2 w-20 h-20 ${stat.bgColor} rounded-full opacity-50 blur-xl`} />
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card variant="default" size="lg">
              <CardHeader divided>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          variant="transparent"
                          hover={true}
                          clickable={true}
                          onClick={action.onClick}
                          className={`border ${action.borderColor} ${action.bgColor} cursor-pointer`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center`}>
                              <Icon className={`w-6 h-6 ${action.color}`} />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold mb-1">
                                {action.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card variant="default" size="lg">
              <CardHeader divided>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center">
                            <Icon className={`w-4 h-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {activity.message}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {activity.time.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Entries */}
        <motion.div variants={itemVariants}>
          <Card variant="default" size="lg">
            <CardHeader divided>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Data Entries</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/data-manager')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData.recentEntries.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentEntries.map((entry, index) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-glass rounded-lg border border-white/10"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-primary-400 rounded-full" />
                        <div>
                          <p className="text-white font-medium">
                            {entry.date}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {entry.uid ? 'UID' : ''}
                            {entry.password ? (entry.uid ? ', Password' : 'Password') : ''}
                            {entry.twoFaKey ? (entry.uid || entry.password ? ', 2FA' : '2FA') : ''}
                            {entry.email ? (entry.uid || entry.password || entry.twoFaKey ? ', Email' : 'Email') : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No data entries yet</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/data-manager')}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Your First Entry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div variants={itemVariants}>
          <Card variant="gradient" size="lg">
            <CardContent>
              <div className="text-center py-8">
                <Sparkles className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white font-orbitron mb-4">
                  DXZ Data Manager Features
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Securely manage your passwords, UIDs, 2FA keys, and emails with our advanced data management system. 
                  Generate random Indian names with custom passwords and connect with our community.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-primary-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Secure Storage</h3>
                    <p className="text-gray-400 text-sm">End-to-end encrypted data storage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-secondary-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Name Generator</h3>
                    <p className="text-gray-400 text-sm">1000+ unique Indian names</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-6 h-6 text-accent-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Analytics</h3>
                    <p className="text-gray-400 text-sm">Track your data usage patterns</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
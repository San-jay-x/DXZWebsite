import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Users, 
  Star,
  ExternalLink,
  Sparkles,
  Heart,
  Share,
  Bell,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Copy
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'

/**
 * JoinChannelsPage Component
 * 
 * Social media integration page with WhatsApp and Telegram channels,
 * community features, and engagement elements.
 */
const JoinChannelsPage = () => {
  const { user } = useAuth()
  const { animationsEnabled } = useTheme()

  const [hoveredChannel, setHoveredChannel] = useState(null)
  const [joinedChannels, setJoinedChannels] = useState({})

  // Social media channels configuration
  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Channel',
      description: 'Join our WhatsApp community for instant updates, tips, and support',
      url: 'https://chat.whatsapp.com/IECS5uR40MNHEBcAEJGMVN?mode=r_t',
      icon: MessageCircle,
      color: 'green',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-400',
      shadowColor: 'shadow-green-500/25',
      members: '1.2K+',
      activity: 'Very Active',
      features: [
        'Instant notifications',
        'Direct support',
        'Community discussions',
        'Exclusive tips'
      ]
    },
    {
      id: 'telegram',
      name: 'Telegram Channel',
      description: 'Stay updated with our Telegram channel for news and announcements',
      url: 'https://t.me/DXZWorkzone',
      icon: Send,
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-400',
      shadowColor: 'shadow-blue-500/25',
      members: '856',
      activity: 'Active',
      features: [
        'Latest updates',
        'Feature announcements',
        'Technical discussions',
        'File sharing'
      ]
    }
  ]

  // Community stats
  const communityStats = [
    {
      label: 'Total Members',
      value: '2K+',
      icon: Users,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10'
    },
    {
      label: 'Active Users',
      value: '1.5K',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Daily Messages',
      value: '250+',
      icon: MessageCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Community Rating',
      value: '4.9',
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ]

  // Benefits of joining
  const benefits = [
    {
      icon: Bell,
      title: 'Instant Updates',
      description: 'Get notified about new features and updates as soon as they\'re released'
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: 'Receive faster support and assistance from our community moderators'
    },
    {
      icon: Users,
      title: 'Community Access',
      description: 'Connect with other users, share tips, and learn from the community'
    },
    {
      icon: Sparkles,
      title: 'Exclusive Content',
      description: 'Access to exclusive tutorials, tips, and behind-the-scenes content'
    }
  ]

  // Handle channel join
  const handleJoinChannel = (channel) => {
    // Mark as joined for UI feedback
    setJoinedChannels(prev => ({
      ...prev,
      [channel.id]: true
    }))

    // Open channel in new tab
    window.open(channel.url, '_blank', 'noopener,noreferrer')
    
    toast.success(`Opening ${channel.name}...`)
  }

  // Copy link to clipboard
  const copyChannelLink = async (channel) => {
    try {
      await navigator.clipboard.writeText(channel.url)
      toast.success(`${channel.name} link copied!`)
    } catch (error) {
      toast.error('Failed to copy link')
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

  const channelCardVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  }

  const benefitVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
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
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-primary-400" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-4">
              Join Our Community
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with thousands of users, get instant support, and stay updated with the latest features
            </p>
          </div>
        </motion.div>

        {/* Community Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {communityStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} variant="default" hover={true}>
                  <div className="text-center">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {stat.label}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Channel Cards */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {channels.map((channel, index) => {
              const Icon = channel.icon
              const isJoined = joinedChannels[channel.id]
              
              return (
                <motion.div
                  key={channel.id}
                  variants={channelCardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredChannel(channel.id)}
                  onHoverEnd={() => setHoveredChannel(null)}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    variant="default" 
                    size="lg" 
                    className={`relative overflow-hidden border ${channel.borderColor} ${channel.bgColor}`}
                  >
                    <div className="relative z-10">
                      {/* Channel Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 ${channel.bgColor} rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-8 h-8 ${channel.textColor}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white font-orbitron">
                              {channel.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{channel.members} members</span>
                              <span className={`${channel.textColor} font-medium`}>
                                {channel.activity}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {isJoined && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center space-x-1 text-green-400"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Joined</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 mb-6">
                        {channel.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-white font-semibold mb-3">Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {channel.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <CheckCircle className={`w-4 h-4 ${channel.textColor}`} />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button
                          variant={isJoined ? "outline" : "primary"}
                          size="lg"
                          onClick={() => handleJoinChannel(channel)}
                          className={`flex-1 ${
                            channel.color === 'green' 
                              ? 'hover:shadow-green-500/25' 
                              : 'hover:shadow-blue-500/25'
                          }`}
                          rightIcon={<ExternalLink className="w-5 h-5" />}
                        >
                          {isJoined ? 'Visit Channel' : 'Join Channel'}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => copyChannelLink(channel)}
                          className="w-auto"
                        >
                          <Copy className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Background decoration */}
                    <motion.div
                      className={`absolute -top-4 -right-4 w-32 h-32 ${channel.bgColor} rounded-full blur-2xl opacity-50`}
                      animate={{
                        scale: hoveredChannel === channel.id ? 1.2 : 1,
                        opacity: hoveredChannel === channel.id ? 0.7 : 0.5
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div variants={itemVariants}>
          <Card variant="gradient" size="lg">
            <CardHeader divided>
              <div className="text-center">
                <CardTitle size="xl" className="mb-4">
                  Why Join Our Community?
                </CardTitle>
                <p className="text-gray-300">
                  Discover the benefits of being part of our growing community
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div
                      key={index}
                      variants={benefitVariants}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants}>
          <Card variant="highlight" size="lg">
            <CardContent>
              <div className="text-center py-8">
                <Sparkles className="w-16 h-16 text-accent-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white font-orbitron mb-4">
                  Ready to Join?
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already part of our amazing community. 
                  Get instant access to support, updates, and exclusive content.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleJoinChannel(channels[0])}
                    leftIcon={<MessageCircle className="w-5 h-5" />}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Join WhatsApp Channel
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleJoinChannel(channels[1])}
                    leftIcon={<Send className="w-5 h-5" />}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Join Telegram Channel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Message */}
        <motion.div variants={itemVariants}>
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Heart className="w-5 h-5 text-red-400" />
              <span>Built with love for the DXZ community</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Connect, share, and grow together
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default JoinChannelsPage
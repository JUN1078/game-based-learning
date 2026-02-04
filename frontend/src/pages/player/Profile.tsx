import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Trophy, Clock, Target } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { useAuthStore } from '@store/authStore'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Mock stats - will be fetched from API
  const stats = {
    gamesCompleted: 12,
    totalPoints: 8450,
    averageAccuracy: 87,
    totalPlayTime: 345, // minutes
    badges: ['Gold Master', 'Silver Star', 'Bronze Badge', 'Fast Learner'],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* User Profile Header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.displayName?.[0] || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user?.displayName || 'User'}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{stats.gamesCompleted}</div>
                <div className="text-sm text-muted-foreground">Games Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{stats.averageAccuracy}%</div>
                <div className="text-sm text-muted-foreground">Avg Accuracy</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{Math.floor(stats.totalPlayTime / 60)}h</div>
                <div className="text-sm text-muted-foreground">Play Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Earned Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <Trophy className="h-12 w-12 text-primary mx-auto mb-2" />
                    <div className="text-sm font-semibold">{badge}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

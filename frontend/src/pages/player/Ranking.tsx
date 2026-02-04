import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Medal } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { LeaderboardEntry } from '@/types'

export default function Ranking() {
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    // TODO: Fetch from API
    // Mock data for now
    const mockData: LeaderboardEntry[] = [
      { rank: 1, userId: '1', userName: 'Alex Chen', score: 950, completionTime: 1200, accuracy: 95, badge: 'Gold Master' },
      { rank: 2, userId: '2', userName: 'Sarah Johnson', score: 890, completionTime: 1350, accuracy: 92, badge: 'Gold Master' },
      { rank: 3, userId: '3', userName: 'Mike Smith', score: 820, completionTime: 1450, accuracy: 88, badge: 'Silver Star' },
      { rank: 4, userId: '4', userName: 'Emma Wilson', score: 750, completionTime: 1600, accuracy: 85 },
      { rank: 5, userId: '5', userName: 'John Doe', score: 680, completionTime: 1800, accuracy: 82 },
    ]

    setTimeout(() => {
      setLeaderboard(mockData)
      setIsLoading(false)
    }, 500)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-orange-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
    }
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
          <div className="text-center mb-8">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
            <p className="text-lg text-muted-foreground">
              See how you rank against other learners
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Players</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className="w-12 flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>

                        {/* User Info */}
                        <div>
                          <div className="font-semibold text-lg">{entry.userName}</div>
                          {entry.badge && (
                            <div className="text-xs text-muted-foreground">{entry.badge}</div>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-primary">{entry.score}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                        <div className="text-center hidden md:block">
                          <div className="font-bold">{entry.accuracy}%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                        <div className="text-center hidden md:block">
                          <div className="font-bold">{Math.floor(entry.completionTime / 60)}m</div>
                          <div className="text-xs text-muted-foreground">Time</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

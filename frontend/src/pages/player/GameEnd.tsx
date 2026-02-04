import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Home, RotateCcw, Star } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { useGameStore } from '@store/gameStore'

export default function GameEnd() {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const { currentGame, score, currentAttempt, resetGame } = useGameStore()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handlePlayAgain = () => {
    resetGame()
    navigate(`/game/${gameId}/intro`)
  }

  const handleGoHome = () => {
    resetGame()
    navigate('/')
  }

  const accuracy = currentAttempt
    ? Math.round((currentAttempt.completedLevels / currentAttempt.totalLevels) * 100)
    : 100

  const getBadge = (score: number) => {
    if (score >= 800) return { name: 'Gold Master', color: 'text-yellow-500' }
    if (score >= 600) return { name: 'Silver Star', color: 'text-gray-400' }
    if (score >= 400) return { name: 'Bronze Badge', color: 'text-orange-600' }
    return { name: 'Participant', color: 'text-blue-500' }
  }

  const badge = getBadge(score)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
              }}
              initial={{ y: -20, opacity: 1 }}
              animate={{
                y: window.innerHeight + 20,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          {/* Trophy Section */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-center mb-8"
          >
            <Trophy className="h-24 w-24 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Congratulations!</h1>
            <p className="text-lg text-muted-foreground">
              You've completed {currentGame?.title || 'the game'}!
            </p>
          </motion.div>

          {/* Stats Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Your Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-1">{score}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </motion.div>

                {/* Accuracy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-1">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Completion</div>
                </motion.div>

                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <Star className={`h-10 w-10 mx-auto mb-2 ${badge.color}`} />
                  <div className={`text-lg font-bold ${badge.color}`}>{badge.name}</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Button variant="outline" size="lg" onClick={handlePlayAgain}>
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            <Button variant="primary" size="lg" onClick={handleGoHome}>
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </motion.div>

          {/* View Ranking */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <Button variant="ghost" onClick={() => navigate('/ranking')}>
              View Leaderboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

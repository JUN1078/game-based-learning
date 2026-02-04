import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, ArrowLeft, Target } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { gameApi, attemptApi } from '@services/api'
import { Game } from '@/types'
import { useGameStore } from '@store/gameStore'
import toast from 'react-hot-toast'

export default function GameIntro() {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const [game, setGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const { setCurrentGame, setCurrentAttempt } = useGameStore()

  useEffect(() => {
    if (gameId) {
      loadGame(gameId)
    }
  }, [gameId])

  const loadGame = async (id: string) => {
    try {
      const response = await gameApi.getById(id)
      setGame(response.data)
      setCurrentGame(response.data)
    } catch (error) {
      toast.error('Failed to load game')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartGame = async () => {
    if (!gameId) return

    setIsStarting(true)
    try {
      const response = await attemptApi.start(gameId)
      setCurrentAttempt(response.data)
      navigate(`/game/${gameId}/play`)
    } catch (error) {
      toast.error('Failed to start game')
      setIsStarting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    )
  }

  if (!game) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Game Banner */}
          <Card className="overflow-hidden mb-8">
            <div className="h-64 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center relative">
              {game.thumbnail ? (
                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
              ) : (
                <Play className="h-24 w-24 text-white opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
                <p className="text-lg opacity-90">{game.description}</p>
              </div>
            </div>
          </Card>

          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{game.totalLevels}</div>
                <div className="text-sm text-muted-foreground">Levels</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{game.estimatedDuration}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1 uppercase">{game.difficulty}</div>
                <div className="text-sm text-muted-foreground">Difficulty</div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Objectives */}
          {game.learningObjectives && game.learningObjectives.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {game.learningObjectives.map((objective, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{objective}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="primary"
              size="lg"
              className="w-full text-xl py-6"
              onClick={handleStartGame}
              isLoading={isStarting}
            >
              <Play className="mr-2 h-6 w-6" />
              Start Learning Journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

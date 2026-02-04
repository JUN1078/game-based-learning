import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Trophy, User, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { gameApi } from '@services/api'
import { Game } from '@/types'
import toast from 'react-hot-toast'

export default function PlayerHome() {
  const navigate = useNavigate()
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      const response = await gameApi.getAll()
      setGames(response.data.filter(g => g.status === 'published'))
    } catch (error) {
      toast.error('Failed to load games')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartGame = (gameId: string) => {
    navigate(`/game/${gameId}/intro`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500'
      case 'medium':
        return 'text-yellow-500'
      case 'hard':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500" />
              <h1 className="text-2xl font-bold">LearnQuest Studio</h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/ranking')}>
                <Trophy className="mr-2 h-4 w-4" />
                Ranking
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Start Your Learning Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore interactive games designed to make learning fun and engaging. Choose a game below to begin!
          </p>
        </motion.div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No games available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-400 rounded-t-xl flex items-center justify-center">
                    {game.thumbnail ? (
                      <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                    ) : (
                      <Play className="h-16 w-16 text-white opacity-80" />
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{game.title}</CardTitle>
                      <span className={`text-xs font-semibold uppercase ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {game.estimatedDuration} min
                      </div>
                      <div>
                        {game.totalLevels} Level{game.totalLevels !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => handleStartGame(game.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Game
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

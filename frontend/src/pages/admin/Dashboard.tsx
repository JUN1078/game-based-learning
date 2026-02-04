import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Copy, Eye, BarChart3 } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { gameApi } from '@services/api'
import { Game } from '@types/index'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      const response = await gameApi.getAll()
      setGames(response.data)
    } catch (error) {
      toast.error('Failed to load games')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGame = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return

    try {
      await gameApi.delete(id)
      setGames(games.filter((g) => g.id !== id))
      toast.success('Game deleted')
    } catch (error) {
      toast.error('Failed to delete game')
    }
  }

  const handleDuplicateGame = async (id: string) => {
    try {
      const response = await gameApi.duplicate(id)
      setGames([...games, response.data])
      toast.success('Game duplicated')
    } catch (error) {
      toast.error('Failed to duplicate game')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/admin/analytics')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="primary" onClick={() => navigate('/admin/games/new')}>
                <Plus className="mr-2 h-4 w-4" />
                New Game
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Games</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : games.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No games created yet</p>
                <Button variant="primary" onClick={() => navigate('/admin/games/new')}>
                  Create Your First Game
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{game.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{game.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span className={`px-2 py-1 rounded ${
                            game.status === 'published' ? 'bg-green-100 text-green-700' :
                            game.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {game.status}
                          </span>
                          <span>{game.totalLevels} levels</span>
                          <span>{game.difficulty}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/games/${game.id}/edit`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicateGame(game.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/game/${game.id}/intro`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteGame(game.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

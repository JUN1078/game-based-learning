import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { gameApi } from '@services/api'
import { Game } from '@types/index'
import toast from 'react-hot-toast'

export default function GameBuilder() {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId?: string }>()
  const [game, setGame] = useState<Partial<Game>>({
    title: '',
    description: '',
    difficulty: 'medium',
    status: 'draft',
    learningObjectives: [],
    estimatedDuration: 30,
    totalLevels: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (gameId) {
      loadGame(gameId)
    }
  }, [gameId])

  const loadGame = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await gameApi.getById(id)
      setGame(response.data)
    } catch (error) {
      toast.error('Failed to load game')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (gameId) {
        await gameApi.update(gameId, game)
        toast.success('Game updated')
      } else {
        const response = await gameApi.create(game)
        toast.success('Game created')
        navigate(`/admin/games/${response.data.id}/levels`)
      }
    } catch (error) {
      toast.error('Failed to save game')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {gameId ? 'Update Game' : 'Create Game'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{gameId ? 'Edit Game' : 'Create New Game'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={game.title}
                onChange={(e) => setGame({ ...game, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                placeholder="Game title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={game.description}
                onChange={(e) => setGame({ ...game, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                rows={4}
                placeholder="Game description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={game.difficulty}
                  onChange={(e) => setGame({ ...game, difficulty: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Duration (minutes)</label>
                <input
                  type="number"
                  value={game.estimatedDuration}
                  onChange={(e) => setGame({ ...game, estimatedDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Save, Trash2, GripVertical, FileText, Image as ImageIcon, Video, Gamepad2 } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import QuestionEditor from '@components/admin/QuestionEditor'
import { levelApi, challengeApi } from '@services/api'
import { Level, Challenge } from '@/types'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function LevelBuilder() {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [_showLevelEditor, _setShowLevelEditor] = useState(false)
  const [showChallengeEditor, setShowChallengeEditor] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Partial<Challenge> | null>(null)

  useEffect(() => {
    if (gameId) {
      loadLevels(gameId)
    }
  }, [gameId])

  const loadLevels = async (id: string) => {
    try {
      const response = await levelApi.getByGameId(id)
      setLevels(response.data)
    } catch (error) {
      toast.error('Failed to load levels')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLevel = async () => {
    if (!gameId) return

    try {
      const newLevel = await levelApi.create(gameId, {
        title: `Level ${levels.length + 1}`,
        description: '',
        order: levels.length,
        difficulty: 'medium',
        passingScore: 70,
      })
      setLevels([...levels, newLevel.data])
      toast.success('Level created')
    } catch (error) {
      toast.error('Failed to create level')
    }
  }

  const handleDeleteLevel = async (levelId: string) => {
    if (!confirm('Delete this level?')) return

    try {
      await levelApi.delete(levelId)
      setLevels(levels.filter((l) => l.id !== levelId))
      toast.success('Level deleted')
    } catch (error) {
      toast.error('Failed to delete level')
    }
  }

  const handleEditLevel = (level: Level) => {
    setSelectedLevel(level)
    _setShowLevelEditor(true)
  }

  const handleAddChallenge = (level: Level) => {
    setSelectedLevel(level)
    setEditingChallenge({
      levelId: level.id,
      type: 'quiz',
      order: level.challenges?.length || 0,
      points: 100,
      config: {},
    })
    setShowChallengeEditor(true)
  }

  const handleSaveChallenge = async (challengeData: Partial<Challenge>) => {
    if (!selectedLevel) return

    try {
      await challengeApi.create(selectedLevel.id, challengeData)
      await loadLevels(gameId!)
      setShowChallengeEditor(false)
      toast.success('Challenge saved')
    } catch (error) {
      toast.error('Failed to save challenge')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button variant="primary" onClick={handleAddLevel}>
              <Plus className="mr-2 h-4 w-4" />
              Add Level
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">Loading levels...</div>
        ) : levels.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground mb-4">No levels created yet</p>
              <Button variant="primary" onClick={handleAddLevel}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Level
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {levels.map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                        <div>
                          <CardTitle>{level.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {level.challenges?.length || 0} challenges • {level.difficulty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleAddChallenge(level)}>
                          <Plus className="mr-1 h-4 w-4" />
                          Add Challenge
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditLevel(level)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteLevel(level.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {level.challenges && level.challenges.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {level.challenges.map((challenge, cIndex) => (
                          <div
                            key={challenge.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {challenge.type === 'text' && <FileText className="h-4 w-4" />}
                              {challenge.type === 'image' && <ImageIcon className="h-4 w-4" />}
                              {challenge.type === 'video' && <Video className="h-4 w-4" />}
                              {challenge.type === 'mini-game' && <Gamepad2 className="h-4 w-4" />}
                              <div>
                                <p className="text-sm font-medium">
                                  Challenge {cIndex + 1}: {challenge.type}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {challenge.points} points
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Challenge Editor Modal */}
      <AnimatePresence>
        {showChallengeEditor && editingChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowChallengeEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add Challenge</h2>
                <Button variant="ghost" onClick={() => setShowChallengeEditor(false)}>
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Challenge Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Challenge Type</label>
                  <select
                    value={editingChallenge.type}
                    onChange={(e) =>
                      setEditingChallenge({ ...editingChallenge, type: e.target.value as any })
                    }
                    className="w-full px-4 py-2 rounded-lg border"
                  >
                    <option value="text">Text Content</option>
                    <option value="image">Image Content</option>
                    <option value="video">Video Content</option>
                    <option value="quiz">Quiz (Multiple Choice)</option>
                    <option value="true-false">True/False</option>
                    <option value="mini-game">Mini-Game</option>
                  </select>
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-medium mb-2">Points</label>
                  <input
                    type="number"
                    value={editingChallenge.points}
                    onChange={(e) =>
                      setEditingChallenge({
                        ...editingChallenge,
                        points: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border"
                  />
                </div>

                {/* Question Editor for Quiz/True-False */}
                {(editingChallenge.type === 'quiz' || editingChallenge.type === 'true-false') && (
                  <QuestionEditor
                    onSave={(questions) => {
                      if (questions.length > 0) {
                        const q = questions[0]
                        setEditingChallenge({
                          ...editingChallenge,
                          config: {
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                            explanation: q.explanation,
                          },
                        })
                      }
                    }}
                  />
                )}

                {/* Text/Image/Video Editor */}
                {(editingChallenge.type === 'text' ||
                  editingChallenge.type === 'image' ||
                  editingChallenge.type === 'video') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {editingChallenge.type === 'text' && 'Text Content'}
                      {editingChallenge.type === 'image' && 'Image URL'}
                      {editingChallenge.type === 'video' && 'Video URL'}
                    </label>
                    {editingChallenge.type === 'text' ? (
                      <textarea
                        value={editingChallenge.config?.content || ''}
                        onChange={(e) =>
                          setEditingChallenge({
                            ...editingChallenge,
                            config: { ...editingChallenge.config, content: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border"
                        rows={6}
                      />
                    ) : (
                      <input
                        type="url"
                        value={
                          editingChallenge.config?.[
                            editingChallenge.type === 'image' ? 'imageUrl' : 'videoUrl'
                          ] || ''
                        }
                        onChange={(e) =>
                          setEditingChallenge({
                            ...editingChallenge,
                            config: {
                              ...editingChallenge.config,
                              [editingChallenge.type === 'image' ? 'imageUrl' : 'videoUrl']:
                                e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border"
                      />
                    )}
                  </div>
                )}

                {/* Mini-Game Config */}
                {editingChallenge.type === 'mini-game' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Game Type</label>
                    <select
                      value={editingChallenge.config?.gameType || 'endless-run'}
                      onChange={(e) =>
                        setEditingChallenge({
                          ...editingChallenge,
                          config: { ...editingChallenge.config, gameType: e.target.value as 'endless-run' | 'match3' | 'memory-flip' | 'toon' | 'puzzle-grid' },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border"
                    >
                      <option value="endless-run">Endless Run</option>
                      <option value="match3">Match 3</option>
                      <option value="memory-flip">Memory Flip</option>
                    </select>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowChallengeEditor(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => handleSaveChallenge(editingChallenge)}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Challenge
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

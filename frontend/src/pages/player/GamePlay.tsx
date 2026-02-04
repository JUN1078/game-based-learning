import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
// import { ArrowRight } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Progress } from '@components/ui/Progress'
import { levelApi, attemptApi } from '@services/api'
import { Level, Challenge } from '@/types'
import { useGameStore } from '@store/gameStore'
import toast from 'react-hot-toast'

// Challenge renderers
import QuizChallenge from '@components/player/challenges/QuizChallenge'
import TextChallenge from '@components/player/challenges/TextChallenge'
import MiniGameChallenge from '@components/player/challenges/MiniGameChallenge'

export default function GamePlay() {
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()
  const [levels, setLevels] = useState<Level[]>([])
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { currentGame, score, addScore, currentAttempt } = useGameStore()

  useEffect(() => {
    if (gameId) {
      loadLevels(gameId)
    }
  }, [gameId])

  const loadLevels = async (id: string) => {
    try {
      const response = await levelApi.getByGameId(id)
      setLevels(response.data.sort((a, b) => a.order - b.order))
    } catch (error) {
      toast.error('Failed to load levels')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChallengeComplete = (isCorrect: boolean, points: number) => {
    if (isCorrect) {
      addScore(points)
      toast.success(`+${points} points!`)
    }

    // Move to next challenge
    const currentLevel = levels[currentLevelIndex]
    if (currentChallengeIndex < currentLevel.challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1)
    } else {
      // Level complete, move to next level
      if (currentLevelIndex < levels.length - 1) {
        setCurrentLevelIndex(currentLevelIndex + 1)
        setCurrentChallengeIndex(0)
        toast.success('Level Complete!')
      } else {
        // Game complete
        handleGameComplete()
      }
    }
  }

  const handleGameComplete = async () => {
    if (currentAttempt) {
      try {
        await attemptApi.complete(currentAttempt.id, score)
        navigate(`/game/${gameId}/end`)
      } catch (error) {
        toast.error('Failed to save progress')
      }
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

  if (levels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Levels Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">This game doesn't have any levels yet.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentLevel = levels[currentLevelIndex]
  const currentChallenge = currentLevel.challenges[currentChallengeIndex]
  const overallProgress = ((currentLevelIndex * 100 + ((currentChallengeIndex / currentLevel.challenges.length) * 100)) / levels.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">{currentGame?.title}</h2>
              <p className="text-sm text-muted-foreground">
                Level {currentLevelIndex + 1} of {levels.length} - {currentLevel.title}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </header>

      {/* Challenge Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          key={`${currentLevelIndex}-${currentChallengeIndex}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.25 }}
          className="max-w-3xl mx-auto"
        >
          <ChallengeRenderer
            challenge={currentChallenge}
            onComplete={handleChallengeComplete}
          />
        </motion.div>
      </div>
    </div>
  )
}

// Challenge Renderer Component
function ChallengeRenderer({
  challenge,
  onComplete,
}: {
  challenge: Challenge
  onComplete: (isCorrect: boolean, points: number) => void
}) {
  switch (challenge.type) {
    case 'text':
    case 'image':
    case 'video':
      return <TextChallenge challenge={challenge} onComplete={onComplete} />
    case 'quiz':
    case 'true-false':
      return <QuizChallenge challenge={challenge} onComplete={onComplete} />
    case 'mini-game':
      return <MiniGameChallenge challenge={challenge} onComplete={onComplete} />
    default:
      return (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Challenge type "{challenge.type}" not implemented yet
            </p>
            <Button className="mt-4 mx-auto block" onClick={() => onComplete(true, challenge.points)}>
              Continue
            </Button>
          </CardContent>
        </Card>
      )
  }
}

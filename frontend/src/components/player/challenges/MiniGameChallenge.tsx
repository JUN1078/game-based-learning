import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Challenge } from '@/types'
import PhaserGame, { PhaserGameRef } from '@games/PhaserGame'
import { EndlessRunScene, EndlessRunConfig } from '@games/endless-run/EndlessRunScene'

interface MiniGameChallengeProps {
  challenge: Challenge
  onComplete: (isCorrect: boolean, points: number) => void
}

export default function MiniGameChallenge({ challenge, onComplete }: MiniGameChallengeProps) {
  const { config } = challenge
  const phaserRef = useRef<PhaserGameRef>(null)
  const [gameScore, setGameScore] = useState(0)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Sample questions for the mini-game
  const gameQuestions = config.gameConfig?.questions || [
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: '2 + 2 equals 4',
    },
    {
      question: 'Which color is the sky?',
      options: ['Red', 'Green', 'Blue', 'Yellow'],
      correctAnswer: 2,
      explanation: 'The sky is blue during the day',
    },
  ]

  const handleGameReady = (game: Phaser.Game) => {
    console.log('Phaser game ready:', game)
  }

  const handleScoreChange = (score: number) => {
    setGameScore(score)
  }

  const handleGameOver = (finalScore: number) => {
    setGameScore(finalScore)
    setIsGameOver(true)

    // Auto-complete after 3 seconds
    setTimeout(() => {
      handleFinishGame(finalScore)
    }, 3000)
  }

  const handleQuestionTrigger = (question: any) => {
    setCurrentQuestion(question)
    setShowQuestion(true)
    setSelectedAnswer(null)
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      // Bonus points for correct answer
      setGameScore((prev) => prev + 100)
    }

    // Resume game
    setShowQuestion(false)
    if (phaserRef.current?.scene) {
      const scene = phaserRef.current.scene as EndlessRunScene
      scene.resumeGame()
    }
  }

  const handleFinishGame = (finalScore?: number) => {
    const score = finalScore ?? gameScore
    // Convert game score to challenge points (proportionally)
    const maxGameScore = 1000
    const earnedPoints = Math.min(
      challenge.points,
      Math.floor((score / maxGameScore) * challenge.points)
    )

    onComplete(score > 0, earnedPoints)
  }

  const handleStartGame = () => {
    setIsGameStarted(true)
  }

  // Phaser game config
  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    backgroundColor: '#87CEEB',
    scene: new EndlessRunScene({
      onScoreChange: handleScoreChange,
      onGameOver: handleGameOver,
      onQuestionTrigger: handleQuestionTrigger,
      questions: gameQuestions,
    } as EndlessRunConfig),
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  }

  if (!isGameStarted) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Endless Run Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-full aspect-video bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
              <Play className="h-24 w-24 text-white opacity-80" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">How to Play</h3>
              <ul className="text-left max-w-md mx-auto space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">🎮</span>
                  <span>Use <kbd className="px-2 py-1 bg-gray-200 rounded text-sm">↑</kbd> and <kbd className="px-2 py-1 bg-gray-200 rounded text-sm">↓</kbd> arrows to move between lanes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🚫</span>
                  <span>Avoid red obstacles</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🪙</span>
                  <span>Collect gold coins for bonus points</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">❓</span>
                  <span>Answer questions to earn extra points</span>
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartGame}
              className="text-xl py-6 px-12"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Endless Run</CardTitle>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{gameScore}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Container */}
        <div className="w-full rounded-lg overflow-hidden border-4 border-primary/20 relative">
          <PhaserGame ref={phaserRef} config={gameConfig} onGameReady={handleGameReady} />

          {/* Question Overlay */}
          <AnimatePresence>
            {showQuestion && currentQuestion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center p-8"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 max-w-lg w-full"
                >
                  <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>

                  <div className="space-y-2 mb-6">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <span className="font-semibold mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                  >
                    Submit Answer
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        {isGameOver && (
          <div className="text-center space-y-4">
            <p className="text-lg">
              Game complete! Earned <span className="font-bold text-primary">{Math.floor((gameScore / 1000) * challenge.points)}</span> points
            </p>
            <p className="text-sm text-muted-foreground">Continuing to next challenge...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

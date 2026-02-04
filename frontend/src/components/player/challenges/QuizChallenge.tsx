import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Challenge } from '@types/index'
import { cn } from '@utils/cn'

interface QuizChallengeProps {
  challenge: Challenge
  onComplete: (isCorrect: boolean, points: number) => void
}

export default function QuizChallenge({ challenge, onComplete }: QuizChallengeProps) {
  const { config } = challenge
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === config.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)

    // Auto-continue after 2 seconds
    setTimeout(() => {
      onComplete(correct, correct ? challenge.points : 0)
    }, 2000)
  }

  // For True/False questions
  const isTrueFalse = challenge.type === 'true-false'
  const options = isTrueFalse
    ? ['True', 'False']
    : config.options || []

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{config.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const showResult = isAnswered && isSelected
            const optionIsCorrect = index === config.correctAnswer

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleSelectAnswer(index)}
                  disabled={isAnswered}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all',
                    'hover:border-primary hover:bg-primary/5',
                    isSelected && !isAnswered && 'border-primary bg-primary/10',
                    showResult && isCorrect && 'border-green-500 bg-green-50',
                    showResult && !isCorrect && 'border-red-500 bg-red-50',
                    isAnswered && !isSelected && optionIsCorrect && 'border-green-500 bg-green-50',
                    isAnswered && 'cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-lg">{option}</span>
                    </div>

                    {/* Result Icon */}
                    <AnimatePresence>
                      {showResult && isCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-500"
                        >
                          <CheckCircle2 className="h-6 w-6" />
                        </motion.div>
                      )}
                      {showResult && !isCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-red-500"
                        >
                          <XCircle className="h-6 w-6" />
                        </motion.div>
                      )}
                      {isAnswered && !isSelected && optionIsCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-500"
                        >
                          <CheckCircle2 className="h-6 w-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {isAnswered && config.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-lg bg-blue-50 border border-blue-200"
            >
              <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
              <p className="text-sm text-blue-800">{config.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        {!isAnswered && (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        )}

        {/* Auto-continuing message */}
        {isAnswered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground"
          >
            Continuing to next challenge...
          </motion.p>
        )}
      </CardContent>
    </Card>
  )
}

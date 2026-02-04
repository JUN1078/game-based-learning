import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { Challenge } from '@/types'

interface TextChallengeProps {
  challenge: Challenge
  onComplete: (isCorrect: boolean, points: number) => void
}

export default function TextChallenge({ challenge, onComplete }: TextChallengeProps) {
  const { config } = challenge

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {challenge.type === 'text' && 'Read & Learn'}
          {challenge.type === 'image' && 'Observe & Learn'}
          {challenge.type === 'video' && 'Watch & Learn'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Content */}
        {config.content && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg leading-relaxed">{config.content}</p>
          </motion.div>
        )}

        {/* Image Content */}
        {config.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg overflow-hidden"
          >
            <img
              src={config.imageUrl}
              alt="Challenge content"
              className="w-full h-auto max-h-96 object-contain bg-gray-50"
            />
          </motion.div>
        )}

        {/* Video Content */}
        {config.videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg overflow-hidden aspect-video"
          >
            <video
              src={config.videoUrl}
              controls
              className="w-full h-full"
            />
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onComplete(true, challenge.points)}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}

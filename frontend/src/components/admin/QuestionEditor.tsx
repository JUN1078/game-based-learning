import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Plus, Trash2, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card'
import { aiApi } from '@services/api'
import toast from 'react-hot-toast'

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  type: 'mcq' | 'true-false'
  aiGenerated?: boolean
}

interface QuestionEditorProps {
  onSave: (questions: Question[]) => void
  initialQuestions?: Question[]
}

export default function QuestionEditor({ onSave, initialQuestions = [] }: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [aiCount, setAiCount] = useState(3)
  const [aiImageUrl, setAiImageUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        type: 'mcq',
      },
    ])
  }

  const handleUpdateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleGenerateWithAI = async () => {
    if (!aiTopic && !aiImageUrl) {
      toast.error('Please provide a topic or image URL')
      return
    }

    setIsGenerating(true)
    try {
      const response = await aiApi.generateQuestions({
        type: 'question',
        topic: aiTopic,
        difficulty: aiDifficulty,
        imageUrl: aiImageUrl || undefined,
        count: aiCount,
      })

      const generated = response.data.questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        type: 'mcq' as const,
        aiGenerated: true,
      }))

      setGeneratedQuestions(generated)
      toast.success(`Generated ${generated.length} questions!`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate questions')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAcceptGenerated = (question: Question) => {
    setQuestions([...questions, question])
    setGeneratedQuestions(generatedQuestions.filter((q) => q !== question))
    toast.success('Question added!')
  }

  const handleAcceptAllGenerated = () => {
    setQuestions([...questions, ...generatedQuestions])
    setGeneratedQuestions([])
    setShowAIGenerator(false)
    toast.success(`Added ${generatedQuestions.length} questions!`)
  }

  const handleSave = () => {
    // Validate questions
    const invalid = questions.filter(
      (q) => !q.question || q.options.some((o) => !o) || !q.explanation
    )

    if (invalid.length > 0) {
      toast.error(`${invalid.length} question(s) have incomplete fields`)
      return
    }

    onSave(questions)
    toast.success('Questions saved!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Question Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAIGenerator(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Generate
          </Button>
          <Button variant="outline" onClick={handleAddQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Save All
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground mb-4">No questions yet</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={handleAddQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Manually
                </Button>
                <Button variant="primary" onClick={() => setShowAIGenerator(true)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Question {qIndex + 1}
                      {question.aiGenerated && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          AI Generated
                        </span>
                      )}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(qIndex)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Question Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={question.type}
                      onChange={(e) =>
                        handleUpdateQuestion(qIndex, 'type', e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                    </select>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <textarea
                      value={question.question}
                      onChange={(e) =>
                        handleUpdateQuestion(qIndex, 'question', e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border"
                      rows={2}
                      placeholder="Enter your question..."
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    <div className="space-y-2">
                      {question.type === 'true-false' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={question.correctAnswer === 0}
                              onChange={() =>
                                handleUpdateQuestion(qIndex, 'correctAnswer', 0)
                              }
                            />
                            <span>True</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={question.correctAnswer === 1}
                              onChange={() =>
                                handleUpdateQuestion(qIndex, 'correctAnswer', 1)
                              }
                            />
                            <span>False</span>
                          </div>
                        </div>
                      ) : (
                        question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={question.correctAnswer === optIndex}
                              onChange={() =>
                                handleUpdateQuestion(qIndex, 'correctAnswer', optIndex)
                              }
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleUpdateOption(qIndex, optIndex, e.target.value)
                              }
                              className="flex-1 px-4 py-2 rounded-lg border"
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Explanation</label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) =>
                        handleUpdateQuestion(qIndex, 'explanation', e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border"
                      rows={2}
                      placeholder="Explain the correct answer..."
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* AI Generator Modal */}
      <AnimatePresence>
        {showAIGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAIGenerator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-white border-b p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Sparkles className="mr-2 h-6 w-6 text-purple-500" />
                  AI Question Generator
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FileText className="inline mr-1 h-4 w-4" />
                      Topic
                    </label>
                    <textarea
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border"
                      rows={3}
                      placeholder="Enter topic or learning objective..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <ImageIcon className="inline mr-1 h-4 w-4" />
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={aiImageUrl}
                      onChange={(e) => setAiImageUrl(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border"
                      placeholder="https://example.com/image.jpg"
                    />
                    {aiImageUrl && (
                      <img
                        src={aiImageUrl}
                        alt="Preview"
                        className="mt-2 w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={aiDifficulty}
                      onChange={(e) => setAiDifficulty(e.target.value as any)}
                      className="w-full px-4 py-2 rounded-lg border"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      value={aiCount}
                      onChange={(e) => setAiCount(parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerateWithAI}
                  isLoading={isGenerating}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Questions
                </Button>

                {/* Generated Questions */}
                {generatedQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Generated Questions ({generatedQuestions.length})
                      </h3>
                      <Button variant="primary" onClick={handleAcceptAllGenerated}>
                        Accept All
                      </Button>
                    </div>

                    {generatedQuestions.map((q, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <p className="font-semibold">{q.question}</p>
                            <div className="space-y-1">
                              {q.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className={`p-2 rounded ${
                                    i === q.correctAnswer
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <span className="font-semibold mr-2">
                                    {String.fromCharCode(65 + i)}.
                                  </span>
                                  {opt}
                                  {i === q.correctAnswer && (
                                    <CheckCircle2 className="inline ml-2 h-4 w-4 text-green-600" />
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground italic">
                              {q.explanation}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAcceptGenerated(q)}
                            >
                              <Plus className="mr-1 h-4 w-4" />
                              Add This Question
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

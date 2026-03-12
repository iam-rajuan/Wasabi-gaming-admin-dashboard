// ============================================================================
// Components - QuestionEditor (components/QuestionEditor.tsx)
// ============================================================================
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save, X, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DIFFICULTY_LEVELS } from '../constants'
import { QuestionOption } from './QuestionOption'
import { PsychometricTest, Question } from '@/types/psychometric'

interface QuestionEditorProps {
  test: PsychometricTest
  question: Question
  index: number
  onSave: (data: Partial<Question>) => void
  onCancel: () => void
  saving: boolean
}

export function QuestionEditor({
  test,
  question,
  index,
  onSave,
  onCancel,
  saving,
}: QuestionEditorProps) {
  const [formData, setFormData] = useState({
    question: question.question,
    options: [...question.options],
    answer: question.answer,
    difficulty: question.difficulty,
  })

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...formData.options]
    const oldOption = newOptions[idx]
    newOptions[idx] = value
    setFormData({
      ...formData,
      options: newOptions,
      answer: formData.answer === oldOption ? value : formData.answer,
    })
  }

  return (
    <Card className="mb-4 border border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-lg">
            Edit Practice Questions: {index + 1}
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onSave(formData)}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Question Text</Label>
            <Input
              value={formData.question}
              onChange={e =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="mt-2 focus-visible:ring-slate-400"
              placeholder="Enter your question here..."
            />
          </div>

          <div>
            <Label>Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                setFormData({ ...formData, difficulty: value })
              }
            >
              <SelectTrigger className="mt-2 focus:ring-slate-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {formData.options.map((option, idx) => (
                <QuestionOption
                  key={idx}
                  option={option}
                  index={idx}
                  isCorrect={formData.answer === option}
                  isEditing={true}
                  onSelect={() => setFormData({ ...formData, answer: option })}
                  onChange={value => handleOptionChange(idx, value)}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click the circle to mark correct answer
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

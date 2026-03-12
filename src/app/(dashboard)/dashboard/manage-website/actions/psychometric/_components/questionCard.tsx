// ============================================================================
// Components - QuestionCard (components/QuestionCard.tsx)
// ============================================================================
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'
import { PsychometricTest, Question } from '@/types/psychometric'
import { QuestionOption } from './QuestionOption'

interface QuestionCardProps {
  test: PsychometricTest
  question: Question
  index: number
  onEdit: () => void
  onDelete: () => void
  disabled?: boolean
}

export function QuestionCard({
  test,
  question,
  index,
  onEdit,
  onDelete,
  disabled,
}: QuestionCardProps) {
  return (
    <Card className="mb-6 border-none shadow-none bg-transparent hover:border-slate-300 transition-colors">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground tracking-tight">Practice Questions: {index + 1}</h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              disabled={disabled}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 bg-[#F5F5F5] rounded-xl mb-4 min-h-[100px] flex items-center">
          <p className="text-lg font-medium text-foreground leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <QuestionOption
              key={idx}
              option={option}
              index={idx}
              isCorrect={option === question.answer}
              isEditing={false}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

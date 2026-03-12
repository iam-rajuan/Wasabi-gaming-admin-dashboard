// ============================================================================
// Components - QuestionOption (components/QuestionOption.tsx)
// ============================================================================
import { CheckCircle2, Circle } from 'lucide-react'

interface QuestionOptionProps {
  option: string
  index: number
  isCorrect: boolean
  isEditing: boolean
  onSelect?: () => void
  onChange?: (value: string) => void
}

export function QuestionOption({
  option,
  index,
  isCorrect,
  isEditing,
  onSelect,
  onChange,
}: QuestionOptionProps) {
  const label = String.fromCharCode(65 + index)

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <div onClick={onSelect} className="cursor-pointer">
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <span className="w-8 text-center font-bold">{label}</span>
        <input
          type="text"
          value={option}
          onChange={e => onChange?.(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isCorrect ? 'border-[#FFFF00] bg-[#FFFF00]/10' : 'border-slate-100 bg-white'
        }`}
    >
      <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center border text-sm font-bold ${isCorrect ? 'bg-[#FFFF00] border-[#FFFF00] text-black' : 'border-slate-200 text-slate-500'
        }`}>
        {label}
      </div>
      <p className={`flex-1 font-medium ${isCorrect ? 'text-foreground' : 'text-muted-foreground'}`}>{option}</p>
    </div>
  )
}

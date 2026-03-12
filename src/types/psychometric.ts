// ============================================================================
// Types (types/psychometric.ts)
// ============================================================================
export interface Question {
  _id: string
  question: string
  options: string[]
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeTakenSec: number
}

export interface PsychometricTest {
  _id: string
  category: string
  score: number
  allQuestions: Question[]
  attamUser: string[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta?: {
    total: number
    page: number
    limit: number
  }
}

export interface Category {
  id: string
  label: string
  apiName: string
}

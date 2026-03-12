// ============================================================================
// Constants (constants/categories.ts)

import { Category } from '@/types/psychometric'

// ============================================================================
export const CATEGORIES: Category[] = [
  { id: 'verbal', label: 'Verbal Reasoning', apiName: 'Verbal Reasoning' },
  {
    id: 'numerical',
    label: 'Numerical Reasoning',
    apiName: 'Numerical Reasoning',
  },
  {
    id: 'abstract',
    label: 'Abstract Reasoning',
    apiName: 'Abstract Reasoning',
  },
  {
    id: 'sjt',
    label: 'Situational Judgement Test (SJT)',
    apiName: 'Situational Judgement Test',
  },
]

export const DIFFICULTY_LEVELS: Array<'easy' | 'medium' | 'hard'> = [
  'easy',
  'medium',
  'hard',
]

// ============================================================================
// React Query Hooks (hooks/usePsychometricQueries.ts)
// ============================================================================
import { psychometricApi } from '@/app/(dashboard)/dashboard/manage-website/services/psychometricApi'
import { Question } from '@/types/psychometric'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function usePsychometricTests() {
  const queryClient = useQueryClient()

  const { data: testsData, isLoading } = useQuery({
    queryKey: ['psychometric-tests'],
    queryFn: psychometricApi.getAllTests,
  })

  const tests = testsData?.data || []

  const createTestMutation = useMutation({
    mutationFn: psychometricApi.createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychometric-tests'] })
      toast.success('Test created successfully')
    },
    onError: () => {
      toast.error('Failed to create test')
    },
  })

  const updateTestMutation = useMutation({
    mutationFn: ({
      testId,
      data,
    }: {
      testId: string
      data: { category: string; allQuestions: Question[] }
    }) => psychometricApi.updateTest(testId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychometric-tests'] })
      toast.success('Question updated successfully')
    },
    onError: () => {
      toast.error('Failed to update question')
    },
  })

  const addQuestionMutation = useMutation({
    mutationFn: ({ testId }: { testId: string }) => {
      const newQuestion = {
        question: 'New Question - Click to edit',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A',
        difficulty: 'easy' as const,
      }
      return psychometricApi.addQuestion(testId, newQuestion)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychometric-tests'] })
      toast.success('Question added successfully')
    },
    onError: () => {
      toast.error('Failed to add question')
    },
  })

  const deleteQuestionMutation = useMutation({
    mutationFn: ({
      testId,
      questionId,
    }: {
      testId: string
      questionId: string
    }) => psychometricApi.deleteQuestion(testId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychometric-tests'] })
      toast.success('Question deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete question')
    },
  })


  return {
    tests,
    isLoading,
    isSaving:
      createTestMutation.isPending ||
      updateTestMutation.isPending ||
      addQuestionMutation.isPending ||
      deleteQuestionMutation.isPending,
    createTest: createTestMutation.mutate,
    updateQuestion: (
      testId: string,
      questionId: string,
      updatedQuestion: Partial<Question>,
    ) => {
      const test = tests.find(t => t._id === testId)
      if (!test) return

      const updatedQuestions = test.allQuestions.map(q =>
        q._id === questionId ? { ...q, ...updatedQuestion } : q,
      )
      updateTestMutation.mutate({
        testId,
        data: { category: test.category, allQuestions: updatedQuestions },
      })
    },
    addQuestion: (testId: string) => addQuestionMutation.mutate({ testId }),
    deleteQuestion: (testId: string, questionId: string) =>
      deleteQuestionMutation.mutate({ testId, questionId }),
  }
}

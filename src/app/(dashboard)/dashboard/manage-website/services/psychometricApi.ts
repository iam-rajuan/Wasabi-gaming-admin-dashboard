// services/psychometricApi.ts

import { ApiResponse, PsychometricTest, Question } from '@/types/psychometric'
import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Helper to get headers
const getAuthHeaders = async (isMultipart = false) => {
  const session = await getSession()
  const headers: Record<string, string> = {
    Authorization: `Bearer ${session?.user?.accessToken || ''}`,
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

export const psychometricApi = {
  async getAllTests(): Promise<ApiResponse<PsychometricTest[]>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/psychometric-test/`, {
      headers,
    })
    if (!response.ok) throw new Error('Failed to fetch tests')
    return await response.json()
  },

  async createTest(category: string): Promise<ApiResponse<PsychometricTest>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/psychometric-test/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ category, allQuestions: [] }),
    })
    if (!response.ok) throw new Error('Failed to create test')
    return await response.json()
  },

  async updateTest(
    testId: string,
    data: { category: string; allQuestions: Question[] },
  ): Promise<ApiResponse<PsychometricTest>> {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${API_BASE_URL}/psychometric-test/${testId}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      },
    )
    if (!response.ok) throw new Error('Failed to update test')
    return await response.json()
  },


  async addQuestion(
    testId: string,
    question: Omit<Question, '_id' | 'timeTakenSec'>,
  ): Promise<ApiResponse<PsychometricTest>> {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${API_BASE_URL}/psychometric-test/add/${testId}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(question),
      },
    )
    if (!response.ok) throw new Error('Failed to add question')
    return await response.json()
  },

  async deleteQuestion(
    testId: string,
    questionId: string,
  ): Promise<ApiResponse<PsychometricTest>> {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${API_BASE_URL}/psychometric-test/${testId}/remove/${questionId}`,
      {
        method: 'DELETE',
        headers,
      },
    )
    if (!response.ok) throw new Error('Failed to delete question')
    return await response.json()
  },
}

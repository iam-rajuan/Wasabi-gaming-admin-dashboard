// lib/api/planApi.ts
import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface PlanFeature {
  name: string
}

export interface Plan {
  _id: string
  name: 'pro' | 'free'
  price: number
  type: 'monthly' | 'yearly' | 'weekly'
  features: string[]
  subscriptionCategory?: string // Added subscriptionCategory
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreatePlanPayload {
  name: 'pro' | 'free'
  price: number
  type: 'monthly' | 'yearly' | 'weekly'
  features: string[]
  subscriptionCategory?: string // Added subscriptionCategory
}

export interface UpdatePlanPayload {
  name?: 'pro' | 'free'
  price?: number
  type?: 'monthly' | 'yearly' | 'weekly'
  features?: string[]
  subscriptionCategory?: string // Added subscriptionCategory
}

export interface PlansResponse {
  statusCode: number
  success: boolean
  message: string
  meta: {
    total: number
    page: number
    limit: number
  }
  data: Plan[]
}

export interface SinglePlanResponse {
  statusCode: number
  success: boolean
  message: string
  data: Plan
}

const getAuthHeaders = async () => {
  const session = await getSession()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.user?.accessToken || ''}`,
  }
}

export const planApi = {
  // Get all plans
  getAllPlans: async (): Promise<PlansResponse> => {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${API_BASE_URL}/premium?subscriptionCategory=students`,
      {
        method: 'GET',
        headers,
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch plans')
    }

    return response.json()
  },

  // Get single plan
  getSinglePlan: async (id: string): Promise<SinglePlanResponse> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/premium/${id}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error('Failed to fetch plan')
    }

    return response.json()
  },

  // Create plan
  createPlan: async (
    payload: CreatePlanPayload,
  ): Promise<SinglePlanResponse> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/premium/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Failed to create plan')
    }

    return response.json()
  },

  // Update plan
  updatePlan: async (
    id: string,
    payload: UpdatePlanPayload,
  ): Promise<SinglePlanResponse> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/premium/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Failed to update plan')
    }

    return response.json()
  },

  // Delete plan (if needed)
  deletePlan: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/premium/${id}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      throw new Error('Failed to delete plan')
    }
  },
}

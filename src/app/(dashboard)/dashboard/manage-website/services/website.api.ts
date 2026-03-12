import { getSession } from 'next-auth/react';
import { WebsiteSection } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper to get headers
const getAuthHeaders = async (isMultipart = false) => {
    const session = await getSession();
    const headers: Record<string, string> = {
        Authorization: `Bearer ${session?.user?.accessToken || ''}`,
    };
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const websiteApi = {
    // Get all sections
    getAllSections: async (): Promise<{ success: boolean; data: WebsiteSection[] }> => {
        const headers = await getAuthHeaders();
        try {
            const response = await fetch(`${API_BASE_URL}/website`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch website sections');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching sections:', error);
            throw error;
        }
    },

    // Update a section (generic)
    updateSection: async (id: string, data: Partial<WebsiteSection>): Promise<{ success: boolean; data: WebsiteSection }> => {
        const headers = await getAuthHeaders();
        try {
            const response = await fetch(`${API_BASE_URL}/website/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update website section');
            }

            return response.json();
        } catch (error) {
            console.error('Error updating section:', error);
            throw error;
        }
    },

    // --- Hero & CTA Sections (/website) ---
    getHeroSections: async (type?: string): Promise<{ success: boolean; data: any[] }> => {
        const headers = await getAuthHeaders();
        const url = type ? `${API_BASE_URL}/website?type=${type}` : `${API_BASE_URL}/website`;
        const res = await fetch(url, { headers });
        return res.json();
    },

    createHeroSection: async (formData: FormData): Promise<{ success: boolean; data: any }> => {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/website`, {
            method: 'POST',
            headers,
            body: formData,
        });
        return res.json();
    },

    updateHeroSection: async (id: string, formData: FormData): Promise<{ success: boolean; data: any }> => {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/website/${id}`, {
            method: 'PUT',
            headers,
            body: formData,
        });
        return res.json();
    },

    deleteHeroSection: async (id: string): Promise<{ success: boolean }> => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/website/${id}`, {
            method: 'DELETE',
            headers,
        });
        return res.json();
    },

    // --- Recent Achievement Cards (/card) ---
    getCards: async (): Promise<{ success: boolean; data: any[] }> => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/card`, { headers });
        return res.json();
    },

    createCard: async (formData: FormData): Promise<{ success: boolean; data: any }> => {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/card`, {
            method: 'POST',
            headers,
            body: formData,
        });
        return res.json();
    },

    updateCard: async (id: string, formData: FormData): Promise<{ success: boolean; data: any }> => {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/card/${id}`, {
            method: 'PUT',
            headers,
            body: formData,
        });
        return res.json();
    },

    deleteCard: async (id: string): Promise<{ success: boolean }> => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/card/${id}`, {
            method: 'DELETE',
            headers,
        });
        return res.json();
    },

    // --- Team Sections (/team) ---
    getTeam: async (): Promise<{ success: boolean; data: any[] }> => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/team`, { headers });
        return res.json();
    },

    createTeamMember: async (formData: FormData): Promise<{ success: boolean; data: any }> => {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/team`, {
            method: 'POST',
            headers,
            body: formData,
        });
        return res.json();
    },

    updateTeamMember: async (id: string, formData: FormData): Promise<{ success: boolean; data: any }> => {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/team/${id}`, {
            method: 'PUT',
            headers,
            body: formData,
        });
        return res.json();
    },

    deleteTeamMember: async (id: string): Promise<{ success: boolean }> => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/team/${id}`, {
            method: 'DELETE',
            headers,
        });
        return res.json();
    },

    // --- Launch Your Career Section (/dynamic-website) ---
    getLaunchCareerItems: async (category?: string): Promise<{ success: boolean; data: any[] }> => {
        const headers = await getAuthHeaders();
        const url = category ? `${API_BASE_URL}/dynamic-website?category=${category}` : `${API_BASE_URL}/dynamic-website`;
        const res = await fetch(url, { headers });
        return res.json();
    },

    createLaunchCareerItem: async (formData: FormData): Promise<{ success: boolean; data: any }> => {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/dynamic-website`, {
            method: 'POST',
            headers,
            body: formData,
        });
        return res.json();
    },

    deleteLaunchCareerItem: async (id: string): Promise<{ success: boolean }> => {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/dynamic-website/${id}`, {
            method: 'DELETE',
            headers,
        });
        return res.json();
    }
};

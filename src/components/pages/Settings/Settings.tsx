'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Headers from '../../Reusable/Headers'
import { toast } from 'sonner'

// Import modular components
import GeneralSettings from './components/GeneralSettings'
import AccountSettings from './components/AccountSettings'
import NotificationSettings from './components/NotificationSettings'
import SecuritySettings from './components/SecuritySettings'

// ============================================
// TYPES
// ============================================
type TabType = 'general' | 'account' | 'notifications' | 'security'

interface ProfileData {
    firstName: string
    lastName?: string
    email: string
    profileImage: string
    schoolName?: string
    address?: string
    phone?: string
}

const Settings = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const { data: sessionData } = useSession()
    const token = sessionData?.user?.accessToken || ''

    // Tab state
    const [activeTab, setActiveTab] = useState<TabType>('general')

    // Profile data state (centralized)
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        profileImage: '',
        schoolName: '',
        address: '',
        phone: '',
    })

    // Loading states
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingProfile, setIsFetchingProfile] = useState(true)

    // Account tab - Image upload state
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // General tab - Form state
    const [generalForm, setGeneralForm] = useState({
        schoolName: '',
        address: '',
        phone: '',
    })

    // Account tab - Form state
    const [accountForm, setAccountForm] = useState({
        firstName: '',
        lastName: '',
    })

    // Notifications tab - Toggle state (UI only)
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
    })

    // ============================================
    // API CALLS
    // ============================================

    // Fetch profile data on component mount
    useEffect(() => {
        if (token) {
            fetchProfile()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const fetchProfile = async () => {
        try {
            setIsFetchingProfile(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            const result = await response.json()

            if (response.ok && result.data) {
                const data = result.data.data || result.data

                // Update centralized profile state
                setProfileData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    profileImage: data.profileImage || '',
                    schoolName: data.schoolName || '',
                    address: data.address || '',
                    phone: data.phone || '',
                })

                // Prefill forms
                setGeneralForm({
                    schoolName: data.schoolName || '',
                    address: data.address || '',
                    phone: data.phone || '',
                })

                setAccountForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                })

                // Set image preview from API
                if (data.profileImage) {
                    setImagePreview(data.profileImage)
                }
            } else {
                toast.error(result.message || 'Failed to fetch profile')
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error('Error loading profile data')
        } finally {
            setIsFetchingProfile(false)
        }
    }

    // Update General Settings
    const handleSaveGeneral = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        schoolName: generalForm.schoolName,
                        address: generalForm.address,
                        phone: generalForm.phone,
                    }),
                },
            )

            const result = await response.json()

            if (response.ok) {
                toast.success('General settings updated successfully')
                // Refresh profile data
                await fetchProfile()
            } else {
                toast.error(result.message || 'Failed to update settings')
            }
        } catch (error) {
            console.error('Error updating general settings:', error)
            toast.error('Error updating settings')
        } finally {
            setIsLoading(false)
        }
    }

    // Update Account (with profile image)
    const handleUpdateAccount = async () => {
        try {
            setIsLoading(true)
            const formData = new FormData()

            // Add profile image if uploaded
            if (profileImage) {
                formData.append('profileImage', profileImage)
            }

            // Add account data as JSON string
            const accountData = {
                firstName: accountForm.firstName,
                lastName: accountForm.lastName,
            }
            formData.append('data', JSON.stringify(accountData))

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile/`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                },
            )

            const result = await response.json()

            if (response.ok) {
                toast.success('Account updated successfully')
                // Refresh profile data
                await fetchProfile()
                // Clear uploaded image state
                setProfileImage(null)
            } else {
                toast.error(result.message || 'Failed to update account')
            }
        } catch (error) {
            console.error('Error updating account:', error)
            toast.error('Error updating account')
        } finally {
            setIsLoading(false)
        }
    }

    // ============================================
    // TABS COMPONENT
    // ============================================
    const tabs: { id: TabType; label: string }[] = [
        { id: 'general', label: 'General' },
        { id: 'account', label: 'Account' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'security', label: 'Security' },
    ]

    // ============================================
    // MAIN RENDER
    // ============================================
    return (
        <div className="min-h-screen">
            <Headers
                title="Settings"
                subHeader="Manage your account and platform settings"
            />

            <div className="max-w-8xl mx-auto mt-1">
                {/* Tabs Navigation */}
                <div className="flex space-x-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium popmed transition-colors ${activeTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {isFetchingProfile ? (
                    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading profile...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'general' && (
                            <GeneralSettings
                                generalForm={generalForm}
                                setGeneralForm={setGeneralForm}
                                isLoading={isLoading}
                                onSave={handleSaveGeneral}
                            />
                        )}
                        {activeTab === 'account' && (
                            <AccountSettings
                                accountForm={accountForm}
                                setAccountForm={setAccountForm}
                                profileData={{
                                    email: profileData.email,
                                    profileImage: profileData.profileImage,
                                }}
                                profileImage={profileImage}
                                setProfileImage={setProfileImage}
                                imagePreview={imagePreview}
                                setImagePreview={setImagePreview}
                                isLoading={isLoading}
                                onUpdate={handleUpdateAccount}
                            />
                        )}
                        {activeTab === 'notifications' && (
                            <NotificationSettings
                                notificationSettings={notificationSettings}
                                setNotificationSettings={setNotificationSettings}
                            />
                        )}
                        {activeTab === 'security' && <SecuritySettings token={token} />}
                    </>
                )}
            </div>
        </div>
    )
}

export default Settings

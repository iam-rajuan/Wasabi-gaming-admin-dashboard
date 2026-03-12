'use client'
import React, { useRef } from 'react'
import Image from 'next/image'

interface AccountSettingsProps {
    accountForm: {
        firstName: string
        lastName: string
    }
    setAccountForm: React.Dispatch<
        React.SetStateAction<{
            firstName: string
            lastName: string
        }>
    >
    profileData: {
        email: string
        profileImage: string
    }
    profileImage: File | null
    setProfileImage: React.Dispatch<React.SetStateAction<File | null>>
    imagePreview: string | null
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
    isLoading: boolean
    onUpdate: () => void
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
    accountForm,
    setAccountForm,
    profileData,
    profileImage,
    setProfileImage,
    imagePreview,
    setImagePreview,
    isLoading,
    onUpdate,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setProfileImage(file)

            // Create preview URL
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)
        }
    }

    const handleRemoveImage = () => {
        setProfileImage(null)
        setImagePreview(profileData.profileImage || null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg popbold text-gray-900">Account Details</h3>
            <p className="text-sm text-gray-500 mt-1">
                Manage your account information
            </p>

            <div className="mt-6 space-y-5">
                {/* Profile Image Preview and Upload */}
                <div className="flex items-start space-x-4">
                    {/* Image Preview */}
                    <div className="relative">
                        {imagePreview ? (
                            <div className="relative">
                                <Image
                                    src={imagePreview}
                                    alt="Profile preview"
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                                {profileImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium popmed text-gray-700 mb-2">
                            Profile Picture
                        </label>

                        <div className="flex items-center space-x-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm popmed"
                            >
                                Upload Image
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            Supported formats: JPG, PNG, GIF. Max size: 5MB
                        </p>
                    </div>
                </div>

                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium popmed text-gray-700">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={accountForm.firstName}
                        onChange={e =>
                            setAccountForm({ ...accountForm, firstName: e.target.value })
                        }
                        className="mt-1 block w-full popreg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 border"
                        placeholder="Enter first name"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium popmed text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={accountForm.lastName}
                        onChange={e =>
                            setAccountForm({ ...accountForm, lastName: e.target.value })
                        }
                        className="mt-1 block w-full popreg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 border"
                        placeholder="Enter last name"
                    />
                </div>

                {/* Email (Read-only) */}
                <div>
                    <label className="block text-sm font-medium popmed text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="mt-1 block w-full popreg rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm h-10 px-3 border cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
            </div>

            <button
                onClick={onUpdate}
                disabled={isLoading}
                className="mt-6 bg-[#FFFF00] hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Updating...' : 'Update Account'}
            </button>
        </div>
    )
}

export default AccountSettings

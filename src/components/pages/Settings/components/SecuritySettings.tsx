'use client'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

interface SecuritySettingsProps {
  token: string
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ token }) => {
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChangePassword = async () => {
    if (
      !securityForm.currentPassword ||
      !securityForm.newPassword ||
      !securityForm.confirmPassword
    ) {
      toast.error('All fields are required')
      return
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    if (securityForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: securityForm.currentPassword,
            newPassword: securityForm.newPassword,
          }),
        },
      )

      const result = await response.json()

      if (response.ok) {
        toast.success('Password changed successfully')
        setSecurityForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        toast.error(result.message || 'Failed to change password')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error changing password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg popbold text-gray-900">Security Settings</h3>
      <p className="text-sm text-gray-500 mt-1">
        Manage your account security options
      </p>

      <div className="mt-6 space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium popmed text-gray-700">
            Current Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword.current ? 'text' : 'password'}
              value={securityForm.currentPassword}
              onChange={e =>
                setSecurityForm({
                  ...securityForm,
                  currentPassword: e.target.value,
                })
              }
              className="block w-full popreg rounded-md border border-gray-300 h-10 px-3 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword(prev => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium popmed text-gray-700">
            New Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword.new ? 'text' : 'password'}
              value={securityForm.newPassword}
              onChange={e =>
                setSecurityForm({
                  ...securityForm,
                  newPassword: e.target.value,
                })
              }
              className="block w-full popreg rounded-md border border-gray-300 h-10 px-3 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword(prev => ({
                  ...prev,
                  new: !prev.new,
                }))
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium popmed text-gray-700">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              value={securityForm.confirmPassword}
              onChange={e =>
                setSecurityForm({
                  ...securityForm,
                  confirmPassword: e.target.value,
                })
              }
              className="block w-full popreg rounded-md border border-gray-300 h-10 px-3 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword(prev => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800">
            <strong>Password Requirements:</strong> Minimum 6 characters
          </p>
        </div>
      </div>

      <button
        onClick={handleChangePassword}
        disabled={isLoading}
        className="mt-6 bg-[#FFFF00] hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Changing...' : 'Change Password'}
      </button>
    </div>
  )
}

export default SecuritySettings

'use client'
import React from 'react'
import { toast } from 'sonner'

interface NotificationSettingsProps {
  notificationSettings: {
    emailNotifications: boolean
    pushNotifications: boolean
    weeklyReports: boolean
  }
  setNotificationSettings: React.Dispatch<
    React.SetStateAction<{
      emailNotifications: boolean
      pushNotifications: boolean
      weeklyReports: boolean
    }>
  >
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationSettings,
  setNotificationSettings,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg popbold text-gray-900">
        Notification Preferences
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Choose how you receive notifications
      </p>

      <div className="mt-6 space-y-4">
        {/* Email Notifications */}
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="text-sm font-medium popmed text-gray-900">
              Email Notifications
            </p>
            <p className="text-xs text-gray-500">Receive updates via email</p>
          </div>
          <button
            onClick={() =>
              setNotificationSettings({
                ...notificationSettings,
                emailNotifications: !notificationSettings.emailNotifications,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.emailNotifications
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.emailNotifications
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="text-sm font-medium popmed text-gray-900">
              Push Notifications
            </p>
            <p className="text-xs text-gray-500">
              Receive push notifications on browser
            </p>
          </div>
          <button
            onClick={() =>
              setNotificationSettings({
                ...notificationSettings,
                pushNotifications: !notificationSettings.pushNotifications,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.pushNotifications
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.pushNotifications
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Weekly Reports */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium popmed text-gray-900">
              Weekly Reports
            </p>
            <p className="text-xs text-gray-500">Get weekly summary reports</p>
          </div>
          <button
            onClick={() =>
              setNotificationSettings({
                ...notificationSettings,
                weeklyReports: !notificationSettings.weeklyReports,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationSettings.weeklyReports ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.weeklyReports
                  ? 'translate-x-6'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={() => toast.info('Notification settings saved')}
        className="mt-6 bg-[#FFFF00] hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-full transition-colors"
      >
        Save Preferences
      </button>
    </div>
  )
}

export default NotificationSettings

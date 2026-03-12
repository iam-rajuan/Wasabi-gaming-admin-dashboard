'use client'
import React from 'react'

interface GeneralSettingsProps {
    generalForm: {
        schoolName: string
        address: string
        phone: string
    }
    setGeneralForm: React.Dispatch<
        React.SetStateAction<{
            schoolName: string
            address: string
            phone: string
        }>
    >
    isLoading: boolean
    onSave: () => void
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    generalForm,
    setGeneralForm,
    isLoading,
    onSave,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg popbold text-gray-900">General Settings</h3>
            <p className="text-sm text-gray-500 mt-1">
                Manage your school and contact settings
            </p>

            <div className="mt-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium popmed text-gray-700">
                        School Name
                    </label>
                    <input
                        type="text"
                        value={generalForm.schoolName}
                        onChange={e =>
                            setGeneralForm({ ...generalForm, schoolName: e.target.value })
                        }
                        className="mt-1 block w-full popreg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 border"
                        placeholder="Enter school name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium popmed text-gray-700">
                        Address
                    </label>
                    <input
                        type="text"
                        value={generalForm.address}
                        onChange={e =>
                            setGeneralForm({ ...generalForm, address: e.target.value })
                        }
                        className="mt-1 block w-full popreg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 border"
                        placeholder="Enter address"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium popmed text-gray-700">
                        Phone
                    </label>
                    <input
                        type="text"
                        value={generalForm.phone}
                        onChange={e =>
                            setGeneralForm({ ...generalForm, phone: e.target.value })
                        }
                        className="mt-1 block w-full popreg rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 border"
                        placeholder="Enter phone number"
                    />
                </div>
            </div>

            <button
                onClick={onSave}
                disabled={isLoading}
                className="mt-6 bg-[#FFFF00] hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    )
}

export default GeneralSettings

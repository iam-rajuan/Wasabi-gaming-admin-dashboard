// modalFeilds/UpdatePlansFeilds.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UpdatePlansFeildsProps {
  formData: any
  onChange: (field: string, value: any) => void
  edit?: boolean
  view?: boolean
  job?: any
  onClose?: () => void
  location?: string
}

const UpdatePlansFields: React.FC<UpdatePlansFeildsProps> = ({
  formData,
  onChange,
  onClose,
  edit = false,
  view = false,
  job,
  location,
}) => {
  const [featureInput, setFeatureInput] = useState('')
  const disabled = false

  // Set default values for required fields that have visual defaults
  useEffect(() => {
    if (!formData.type) {
      onChange('type', 'monthly')
    }
  }, []) // Run once on mount

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = Array.isArray(formData.features)
        ? formData.features
        : []
      onChange('features', [...currentFeatures, featureInput.trim()])
      setFeatureInput('')
    }
  }

  const removeFeature = (index: number) => {
    const currentFeatures = Array.isArray(formData.features)
      ? formData.features
      : []
    onChange(
      'features',
      currentFeatures.filter((_, i) => i !== index),
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature()
    }
  }

  const features = Array.isArray(formData.features) ? formData.features : []

  return (
    <div className="space-y-6 p-1">
      {location !== 'school-plans' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Plan Name
            </label>
            <span className="text-xs text-gray-400">Required</span>
          </div>
          <Select
            value={formData.name || ''}
            onValueChange={value => onChange('name', value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full h-[52px] rounded-xl border-gray-300 focus:ring-yellow-400">
              <SelectValue placeholder="Select plan name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Choose the plan tier</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <span className="text-xs text-gray-400">Required</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg font-medium">£</span>
          </div>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            disabled={disabled}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">POUNDS</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Enter the monthly subscription price
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Billing Cycle{' '}
          <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="w-full">
          <Select
            value={formData.type || 'monthly'}
            onValueChange={value => onChange('type', value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full h-[52px] rounded-xl border-gray-300 focus:ring-yellow-400">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">
                Monthly - Billed every month
              </SelectItem>
              <SelectItem value="yearly">
                Yearly - Save with annual billing
              </SelectItem>
              <SelectItem value="weekly">Weekly - Billed every week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {location !== 'school-plans' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Subscription Category
            <span className="text-gray-400 font-normal ml-2">(Optional)</span>
          </label>
          <div className="w-full">
            <Select
              value={formData.subscriptionCategory || ''}
              onValueChange={value => onChange('subscriptionCategory', value)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-[52px] rounded-xl border-gray-300 focus:ring-yellow-400">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="school">School</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              Select who this plan is designed for
            </p>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Features <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={featureInput}
            onChange={e => setFeatureInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a feature and press Add"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 hover:border-gray-400 placeholder:text-gray-400"
            disabled={disabled}
          />
          <button
            type="button"
            onClick={addFeature}
            disabled={!featureInput.trim() || disabled}
            className="px-6 py-3 bg-[#FFFF00] text-black font-medium rounded-[20px] hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {features.length > 0 && (
          <div className="mt-3 space-y-2">
            {features.map((feature: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-700">{feature}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {(formData.name || formData.price) && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">
            Plan Preview
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {formData.name || 'Untitled Plan'}
              </div>
              <div className="text-sm text-gray-600">
                {formData.type === 'year'
                  ? 'Yearly subscription'
                  : formData.type === 'weekly'
                    ? 'Weekly subscription'
                    : 'Monthly subscription'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                £{parseFloat(formData.price || 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {formData.type === 'year'
                  ? 'per year'
                  : formData.type === 'weekly'
                    ? 'per week'
                    : 'per month'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePlansFields

'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const StudentForm = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          type="text"
          placeholder="e.g., John Doe"
          value={formData.fullName || ''}
          onChange={e => onChange('fullName', e.target.value)}
        />
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <Label>Email Address</Label>
        <Input
          type="email"
          placeholder="student@email.com"
          value={formData.email || ''}
          onChange={e => onChange('email', e.target.value)}
        />
      </div>

      {/* Grade Level & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Year Group</Label>
          <Select
            value={formData.grade || ''}
            onValueChange={value => onChange('grade', value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Year Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Year 8">Year 8</SelectItem>
              <SelectItem value="Year 9">Year 9</SelectItem>
              <SelectItem value="Year 10">Year 10</SelectItem>
              <SelectItem value="Year 11">Year 11</SelectItem>
              <SelectItem value="Year 12">Year 12</SelectItem>
              <SelectItem value="Year 13">Year 13</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status || 'Active'}
            onValueChange={value => onChange('status', value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default StudentForm

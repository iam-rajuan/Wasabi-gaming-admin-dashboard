"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash'; // Make sure lodash is installed: npm install lodash
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa6";
import TextEditor from '../editor/EditSection';

interface ManageJobFeildsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  edit?: boolean;
  view?: boolean;
  job?: any;
  onClose?: () => void;
}

const ManageJobFeilds: React.FC<ManageJobFeildsProps> = ({
  formData,
  onChange,
  edit = false,
  view = false,
  job,
  onClose,
}) => {
  const [skillInput, setSkillInput] = useState("");

  const normalizeSkills = (value: any) => {
    if (Array.isArray(value)) {
      return value.map((item: any) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
      return value
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const requiredSkills = useMemo(() => {
    if (formData.requiredSkills !== undefined) {
      return normalizeSkills(formData.requiredSkills);
    }
    if (edit && job?.requiredSkills) {
      return normalizeSkills(job.requiredSkills);
    }
    return [];
  }, [formData.requiredSkills, edit, job?.requiredSkills]);

  const handleInputChange = (field: string, value: any) => {
    onChange(field, value);
  };

  const handleAddSkill = () => {
    const newSkill = skillInput.trim();
    if (!newSkill) return;

    const exists = requiredSkills.some(
      (skill) => skill.toLowerCase() === newSkill.toLowerCase()
    );
    if (exists) {
      setSkillInput("");
      return;
    }

    handleInputChange("requiredSkills", [...requiredSkills, newSkill]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = requiredSkills.filter((skill) => skill !== skillToRemove);
    handleInputChange("requiredSkills", updated);
  };

  // IMPORTANT FIX: Debounce TextEditor onChange to prevent infinite re-render loop
  // This is the ONLY change - everything else is exactly the same
  const debouncedContentChange = useMemo(
    () => debounce((value: string) => {
      onChange("description", value);
    }, 500), // Wait 500ms after typing stops before updating state
    [onChange]
  );

  useEffect(() => {
    return () => {
      debouncedContentChange.cancel();
    };
  }, [debouncedContentChange]);

  if (view) {
    const j = job || {}; // fallback if job is undefined

    return (
      <div className="space-y-6">
        {/* Job Header Info - was previously in the modal header */}
        <div className="pb-6 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {j.title || "No title available"}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                  j.jobStatus === "Open"
                    ? "text-green-700 bg-green-100"
                    : "text-gray-700 bg-gray-100"
                }`}
              >
                {j.jobStatus || "—"}
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {j.level || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="pb-6 border-b border-gray-200">
          <div className="grid grid-cols-1 border p-5 sm:grid-cols-3 gap-6 text-sm text-gray-700 rounded-md">
            <div>
              <p className="popmed text-[15px] font-medium">Salary:</p>
              <p className="popreg">{j.salaryRange || "—"}</p>
            </div>
            <div>
              <p className="popmed text-[15px] font-medium">Start date:</p>
              <p>
                {j.startDate
                  ? new Date(j.startDate).toLocaleDateString("en-GB")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="popmed text-[15px] font-medium">Application deadline:</p>
              <p>
                {j.applicationDeadline
                  ? new Date(j.applicationDeadline).toLocaleDateString("en-GB")
                  : "—"}
              </p>
            </div>

            <div>
              <p className="popmed text-[15px] font-medium">Job ID:</p>
              <p>{j.jobId || "—"}</p>
            </div>
            <div>
              <p className="popmed text-[15px] font-medium">Company</p>
              <p className="text-gray-600">{j.companyName || "—"}</p>
            </div>
            <div>
              <p className="popmed text-[15px] font-medium">Company Type</p>
              <p className="text-gray-600">{j.companyType || "—"}</p>
            </div>
            <div>
              <p className="popmed text-[15px] font-medium">Location</p>
              <p className="text-gray-600">{j.location || "—"}</p>
            </div>

            <div>
              <p className="popmed text-[15px] font-medium">Posted By</p>
              <p className="text-gray-600">{j.postedBy || "—"}</p>
            </div>
            <div>
              <p className="popmed text-[15px] font-medium">Status</p>
              <p className="text-gray-600">{j.status || "—"}</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-6 text-gray-800 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: j.description || "" }} />
          {!j.description && (
            <p className="text-gray-500 italic">No description provided.</p>
          )}
        </div>

        {/* Required Skills */}
        {Array.isArray(j.requiredSkills) && j.requiredSkills.length > 0 && (
          <div className="space-y-3 border-t border-gray-200 pt-6 text-gray-800">
            <h3 className="text-lg font-semibold">Required Skills</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {j.requiredSkills.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Information */}
        {j.additionalInfo && (
          <div className="space-y-3 border-t border-gray-200 pt-6 text-gray-800">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <p className="text-gray-700 whitespace-pre-line">{j.additionalInfo}</p>
          </div>
        )}
      </div>
    );
  }

  // Edit/Create mode (only TextEditor onChange is fixed - everything else unchanged)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Title */}
        <div className="space-y-2">
          <Label>Job Title *</Label>
          <Input
            className="h-[48px]"
            type="text"
            value={formData.title || (edit ? job?.title : "") || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter job title"
          />
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <Label>Company Name *</Label>
          <Input
            className="h-[48px]"
            type="text"
            value={formData.companyName || (edit ? job?.companyName : "") || ""}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        {/* Company Type */}
        <div className="space-y-2">
          <Label>Company Type *</Label>
          <Input
            className="h-[48px]"
            type="text"
            value={formData.companyType || (edit ? job?.companyType : "") || ""}
            onChange={(e) => handleInputChange("companyType", e.target.value)}
            placeholder="e.g., Software Development"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location *</Label>
          <Input
            className="h-[48px]"
            type="text"
            value={formData.location || (edit ? job?.location : "") || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location"
          />
        </div>

        {/* Posted By */}
        <div className="space-y-2">
          <Label>Posted By *</Label>
          <Input
            className="h-[48px]"
            type="text"
            value={formData.postedBy || (edit ? job?.postedBy : "") || ""}
            onChange={(e) => handleInputChange("postedBy", e.target.value)}
            placeholder="Enter poster name"
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label>Salary Range *</Label>
          <Input
            className="h-[48px]"
            type="text"
            value={formData.salaryRange || (edit ? job?.salaryRange : "") || ""}
            onChange={(e) => handleInputChange("salaryRange", e.target.value)}
            placeholder="Enter salary range"
          />
        </div>

        {/* Job Level */}
        <div className="space-y-2">
          <Label>Job Level</Label>
          <Select
            value={formData.level || (edit ? job?.level : "") || ""}
            onValueChange={(value) => handleInputChange("level", value)}
          >
            <SelectTrigger className="h-[48px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entry-Level">Entry-Level</SelectItem>
              <SelectItem value="Mid-Level">Mid-Level</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Input
            className="h-[48px]"
            type="date"
            value={formData.startDate || (edit ? job?.startDate?.split('T')[0] : "") || ""}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
          />
        </div>

        {/* Application Deadline */}
        <div className="space-y-2">
          <Label>Application Deadline *</Label>
          <Input
            className="h-[48px]"
            type="date"
            value={formData.applicationDeadline || (edit ? job?.applicationDeadline?.split('T')[0] : "") || ""}
            onChange={(e) => handleInputChange("applicationDeadline", e.target.value)}
          />
        </div>
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <TextEditor
            data={formData.description || (edit ? job?.description : "") || ""}
            onChange={debouncedContentChange} // ← Now debounced - no more loop!
          />
        </div>
      </div>

      {/* Required Skills */}
      <div className="space-y-2">
        <Label>Required Skills</Label>
        <div className="flex items-center gap-2">
          <Input
            className="h-[48px]"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Type one skill"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="h-[48px] w-[48px] rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="Add skill"
          >
            <FaPlus />
          </button>
        </div>
        {requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {requiredSkills.map((skill, index) => (
              <div
                key={`${skill}-${index}`}
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-gray-500 hover:text-red-600 leading-none"
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="space-y-2">
        <Label>Additional Info</Label>
        <Textarea
          value={formData.additionalInfo || (edit ? job?.additionalInfo : "") || ""}
          onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
          rows={3}
          placeholder="Portfolio required, on-site, remote, etc..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Status */}
        <div className="space-y-2">
          <Label>Job Status</Label>
          <Select
            value={formData.jobStatus || (edit ? job?.jobStatus : "Open") || "Open"}
            onValueChange={(value) => handleInputChange("jobStatus", value)}
          >
            <SelectTrigger className="h-[48px]">
              <SelectValue placeholder="Select job status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ManageJobFeilds;

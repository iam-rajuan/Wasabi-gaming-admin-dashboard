"use client";
import React from "react";

interface ManageApplicationFeildProps {
    formData: any;
    onChange: (field: string, value: any) => void;
    edit?: boolean;
    view?: boolean;
    job?: any;
    onClose?: () => void;
}

const ManageApplicationFeild: React.FC<ManageApplicationFeildProps> = ({
    formData,
    onChange,
    edit = false,
    view = false,
    job: firm,
    onClose,
}) => {
    const disabled = view;

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                </label>
                <select
                    value={formData.schoolName || ""}
                    disabled={disabled}
                    onChange={(e) => onChange("schoolName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
                >
                    <option value="">Select school</option>
                    <option value="Oxford University">Oxford University</option>
                    <option value="Harvard University">Harvard University</option>
                    <option value="Stanford University">Stanford University</option>
                </select>
            </div>

            {/* Application Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Type
                </label>
                <input
                    type="text"
                    placeholder="Enter application type"
                    value={formData.applicationType || ""}
                    disabled={disabled}
                    onChange={(e) =>
                        onChange("applicationType", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    rows={5}
                    placeholder="Enter description"
                    value={formData.description || ""}
                    disabled={disabled}
                    onChange={(e) => onChange("description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
                />
            </div>
        </div >
    );
};

export default ManageApplicationFeild;

"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TaskFields = ({ formData, onChange, edit = false }) => {
    return (
        <div className="space-y-4">
            {/* Task Title */}
            <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                    type="text"
                    placeholder="e.g., Physics Lab Report"
                    value={formData.title || ""}
                    onChange={(e) => onChange("title", e.target.value)}
                />
            </div>

            {/* Course */}
            <div className="space-y-2">
                <Label>Course</Label>
                <Select
                    value={formData.course || ""}
                    onValueChange={(value) => onChange("course", value)}
                >
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Physics Fundamentals">
                            Physics Fundamentals
                        </SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Due Date & Total Students */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                        type="date"
                        value={formData.dueDate || ""}
                        onChange={(e) => onChange("dueDate", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Total Students</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={formData.totalStudents || ""}
                        onChange={(e) => onChange("totalStudents", e.target.value)}
                        disabled={edit}
                        className={edit ? "bg-muted cursor-not-allowed" : ""}
                    />
                </div>
            </div>

            {/* Edit-only Fields */}
            {edit && (
                <>
                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={formData.status || "Pending"}
                            onValueChange={(value) => onChange("status", value)}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submissions */}
                    <div className="space-y-2">
                        <Label>Submissions</Label>
                        <Input
                            type="text"
                            value={formData.submissions || ""}
                            disabled
                            className="bg-muted cursor-not-allowed"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskFields;

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PortfollioView from "./PortfollioView";
import dynamic from "next/dynamic"; // for SSR safe import

// Dynamically import React Quill so it works with Next.js SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // import Quill CSS

interface PortfolioFieldsProps {
    formData: any;
    onChange: (field: string, value: any) => void;
    edit?: boolean;
    view?: boolean;
    job?: any;
    onClose?: () => void;
}

const PortfolioFields: React.FC<PortfolioFieldsProps> = ({
    formData = {},
    onChange,
    edit = false,
    view = false,
}) => {
    const handleImageChange = (file?: File) => {
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        onChange("image", file);
        onChange("imagePreview", previewUrl);
    };

    const removeImage = () => {
        onChange("image", null);
        onChange("imagePreview", null);
    };

    if (view) {
        return <PortfollioView data={formData} />;
    }

    return (
        <div className="space-y-6 py-2 pr-4 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Portfolio Title</Label>
                <Input
                    id="title"
                    placeholder="e.g. Digital Marketing Campaign 2025"
                    value={formData.title || ""}
                    onChange={(e) => onChange("title", e.target.value)}
                />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
                <Label htmlFor="eventType">Event Type </Label>
                <Input
                    id="eventType"
                    placeholder="Brief catchy description"
                    value={formData.eventType || ""}
                    onChange={(e) => onChange("eventType", e.target.value)}
                />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !formData.date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.date
                                    ? format(new Date(formData.date), "PPP")
                                    : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={formData.date ? new Date(formData.date) : undefined}
                                onSelect={(date) =>
                                    onChange("date", date ? date.toISOString().split("T")[0] : "")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                        id="time"
                        type="time"
                        value={formData.time || ""}
                        onChange={(e) => onChange("time", e.target.value)}
                    />
                </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
                <Label>Cover Image</Label>

                {formData.imagePreview ? (
                    <div className="relative group w-full max-w-md">
                        <div className="overflow-hidden rounded-lg border bg-muted/30">
                            <Image
                                width={500}
                                height={500}
                                src={formData.imagePreview}
                                alt="Portfolio cover preview"
                                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                            />
                        </div>

                        <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                        <label className="cursor-pointer">
                            <div className="space-y-2">
                                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                                <div className="text-sm font-medium">
                                    Click to upload or drag & drop
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, WEBP up to 5MB
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleImageChange(e.target.files?.[0])}
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Description using React Quill */}
            <div className="space-y-2">
                <Label>Description</Label>
                <div className="min-h-[280px] border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <ReactQuill
                        theme="snow"
                        value={formData.description || ""}
                        onChange={(value) => onChange("description", value)}
                        placeholder="Write your portfolio description here..."
                        className="h-[280px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default PortfolioFields;

"use client";
import React, { useState, useEffect } from "react";
import { Upload, Plus, Trash2, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

interface CourseEditModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData: any;
    courseId: string;
}

const CourseEditModal = ({
    open,
    setOpen,
    initialData,
    courseId,
}: CourseEditModalProps) => {
    const { data: session } = useSession();
    const token = session?.user?.accessToken;
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        courseName: initialData?.courseName || "",
        description: initialData?.description || "",
        grade: initialData?.grade || "",
        category: initialData?.category || "",
        coursePrice: initialData?.coursePrice || 0,
        videos: initialData?.videos || [],
        thumbnail: initialData?.thumbnail || null,
    });



    const updateCourseMutation = useMutation({
        mutationFn: async (payload: FormData) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/${courseId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,

                    },
                    body: payload,
                }
            );
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to update course");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Course updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            setOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong while updating");
        },
    });

    const addVideoMutation = useMutation({
        mutationFn: async (payload: FormData) => {
            console.log(payload)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/${courseId}/video`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: payload,
                }
            );
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to add videos");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Videos added successfully!");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong while adding videos");
        },
    });

    const removeVideoMutation = useMutation({
        mutationFn: async (videoId: string) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/${courseId}/video/${videoId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to remove video");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Video removed successfully!");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong while removing video");
        },
    });

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleVideoChange = (index: number, field: string, value: any) => {
        const updatedVideos = [...formData.videos];
        updatedVideos[index] = { ...updatedVideos[index], [field]: value };
        handleChange("videos", updatedVideos);
    };

    const addVideoField = () => {
        const newVideo = { file: null, title: "", existingUrl: "", time: "00:00" };
        handleChange("videos", [...formData.videos, newVideo]);
    };

    const removeVideo = (index: number) => {
        const video = formData.videos[index];
        console.log(video)
        if (video._id) {
            removeVideoMutation.mutate(video._id, {
                onSuccess: () => {
                    const updatedVideos = formData.videos.filter((_: any, i: number) => i !== index);
                    handleChange("videos", updatedVideos);
                },
                // onError: do nothing, keep in state
            });
        } else {
            const updatedVideos = formData.videos.filter((_: any, i: number) => i !== index);
            handleChange("videos", updatedVideos);
        }
    };

    const handleThumbnailChange = (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB");
            return;
        }

        setPreviewImage(URL.createObjectURL(file));
        handleChange("thumbnail", file);
    };

    // const handleSubmit = () => {
    //     const courseData = {
    //         name: formData.courseName.trim(),
    //         description: formData.description.trim(),
    //         gradeLevel: formData.grade,
    //         category: formData.category,
    //         coursePrice: Number(formData.coursePrice) || 0,
    //     };

    //     const newVideos = formData.videos.filter((video: any) => video.file instanceof File);

    //     const detailsPayload = new FormData();
    //     detailsPayload.append("data", JSON.stringify(courseData));

    //     if (newVideos.length > 0) {
    //         const addPayload = new FormData();
    //         const titlesArr: string[] = [];
    //         newVideos.forEach((video: any) => {
    //             addPayload.append("courseVideo", video.file);
    //             titlesArr.push(video.title.trim());
    //         });
    //         addPayload.append("titles", JSON.stringify(titlesArr));

    //         addVideoMutation.mutate(addPayload, {
    //             onSuccess: () => {
    //                 updateCourseMutation.mutate(detailsPayload);
    //             },
    //         });
    //     } else {
    //         updateCourseMutation.mutate(detailsPayload);
    //     }
    // };

    const handleSubmit = () => {
        const courseData = {
            name: formData.courseName.trim(),
            description: formData.description.trim(),
            gradeLevel: formData.grade,
            category: formData.category,
            coursePrice: Number(formData.coursePrice) || 0,
        };

        const newVideos = formData.videos.filter((v: any) => v.file instanceof File);

        const detailsPayload = new FormData();
        detailsPayload.append("data", JSON.stringify(courseData));


        if (formData.thumbnail instanceof File) {
            detailsPayload.append("thumbnail", formData.thumbnail);
        }
        if (newVideos.length > 0) {
            const addPayload = new FormData();
            const titlesArr: string[] = [];
            newVideos.forEach((video: any) => {
                addPayload.append("courseVideo", video.file);
                titlesArr.push(video.title.trim());
            });
            addPayload.append("titles", JSON.stringify(titlesArr));

            addVideoMutation.mutate(addPayload, {
                onSuccess: () => {
                    updateCourseMutation.mutate(detailsPayload);
                },
            });
        } else {
            updateCourseMutation.mutate(detailsPayload);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Thumbnail Upload with Preview */}
                    <div className="space-y-2">
                        <Label>Course Thumbnail</Label>

                        <label
                            className={`
                flex flex-col items-center justify-center 
                border-2 border-dashed rounded-lg p-6 cursor-pointer
                hover:border-yellow-400 transition
                ${previewImage || formData.thumbnail
                                    ? "border-yellow-400"
                                    : "border-gray-300"}
              `}
                        >
                            {previewImage || formData.thumbnail ? (
                                <div className="relative w-full max-w-xs mx-auto">
                                    <Image
                                        src={
                                            previewImage
                                                ? previewImage
                                                : formData.thumbnail
                                        }
                                        alt="Thumbnail preview"
                                        width={300}
                                        height={200}
                                        className="w-full h-auto object-cover rounded-md"
                                        unoptimized
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Click to replace
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-gray-400 mb-3" />
                                    <p className="text-sm font-medium text-gray-700">
                                        Click to upload thumbnail
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        JPG, PNG • Max 5MB
                                    </p>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) =>
                                    handleThumbnailChange(e.target.files?.[0] || null)
                                }
                            />
                        </label>
                    </div>

                    {/* Course Name */}
                    <div className="space-y-2">
                        <Label>Course Name *</Label>
                        <Input
                            value={formData.courseName}
                            onChange={(e) => handleChange("courseName", e.target.value)}
                            placeholder="e.g. Mathematics for Class 9"
                        />
                    </div>
                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Brief description of the course..."
                        />
                    </div>
                    {/* Grade, Category, Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Year Group *</Label>
                            <Select
                                value={formData.grade}
                                onValueChange={(value) => handleChange("grade", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectContent>
                                        <SelectContent>
                                            <SelectItem value="Year 9">Year 9</SelectItem>
                                            <SelectItem value="Year 10">Year 10</SelectItem>
                                            <SelectItem value="Year 11">Year 11</SelectItem>
                                        </SelectContent>
                                    </SelectContent>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                                    <SelectItem value="Science">Science</SelectItem>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                                    <SelectItem value="History">History</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Course Price (৳)</Label>
                            <Input
                                type="number"
                                value={formData.coursePrice}
                                onChange={(e) => handleChange("coursePrice", Number(e.target.value))}
                                placeholder="0 for free"
                            />
                        </div>
                    </div>
                    {/* Videos Section */}
                    <div className="space-y-4">
                        <Label className="block text-base font-medium">Course Videos</Label>
                        {formData.videos.map((video: any, index: number) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50 relative"
                            >
                                {/* Video Upload / Existing */}
                                <div className="space-y-2">
                                    {video.existingUrl && !video.file ? (
                                        <div className="text-sm text-gray-600">
                                            Current video: <span className="font-medium">{video.title}</span>
                                            <div className="text-xs text-gray-500 mt-1 truncate">
                                                {video.existingUrl}
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-yellow-400 transition">
                                            <Upload className="h-8 w-8 text-gray-400 mb-3" />
                                            <p className="text-sm font-medium text-gray-700">
                                                {video.file ? video.file.name : "Upload new/replace video"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">MP4 • Max 100MB</p>
                                            <input
                                                type="file"
                                                accept="video/mp4,video/quicktime"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleVideoChange(index, "file", e.target.files?.[0] || null)
                                                }
                                            />
                                        </label>
                                    )}
                                </div>
                                {/* Video Title */}
                                <div className="space-y-2">
                                    <Label>Video Title</Label>
                                    <Input
                                        value={video.title}
                                        onChange={(e) => handleVideoChange(index, "title", e.target.value)}
                                        placeholder="e.g. Introduction to Algebra"
                                    />
                                </div>
                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removeVideo(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                                    title="Remove this video"
                                    disabled={removeVideoMutation.isPending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addVideoField}
                            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
                        >
                            <Plus className="h-4 w-4" /> Add Another Video
                        </Button>
                    </div>
                </div>
                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="rounded-[20px]"
                        disabled={updateCourseMutation.isPending || addVideoMutation.isPending || removeVideoMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateCourseMutation.isPending || addVideoMutation.isPending || removeVideoMutation.isPending}
                        className="bg-[#FFFF00] text-black hover:bg-[#FFFF00]/90 rounded-[20px]"
                    >
                        {updateCourseMutation.isPending || addVideoMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CourseEditModal;
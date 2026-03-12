

"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import dynamic from "next/dynamic";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface EventFormData {
  title: string;
  eventType: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description: string;
  image: File | null;
  imagePreview: string | null;
}

interface EditEventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: {
    _id?: string;
    title?: string;
    eventType?: string;
    date?: string;
    time?: string;
    description?: string;
    thumbnail?: string;
    thamble?: string;
  } | null;
}

export default function EditEventModal({
  open,
  setOpen,
  initialData,
}: EditEventModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const isEditMode = !!initialData?._id;

  // Initialize form data directly — no useEffect needed
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    eventType: initialData?.eventType || "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : "",
    time: initialData?.time || "",
    description: initialData?.description || "",
    image: null,
    imagePreview:
      initialData?.thumbnail || initialData?.thamble || null,
  });

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      handleChange("image", file);
      handleChange("imagePreview", preview);
    }
  };

  const removeImage = () => {
    handleChange("image", null);
    handleChange("imagePreview", null);
  };

  // ── Mutations ───────────────────────────────────────────────
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createEvent = async (data: FormData) => {
    const res = await fetch(`${API_BASE}/event`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create event");
    }
    return res.json();
  };

  const updateEvent = async ({ id, data }: { id: string; data: FormData }) => {
    const res = await fetch(`${API_BASE}/event/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update event");
    }
    return res.json();
  };

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully!");
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create event");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated successfully!");
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update event");
    },
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    if (!formData.date) {
      toast.error("Event date is required");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("eventType", formData.eventType || "");
    payload.append("date", formData.date);
    payload.append("time", formData.time || "");
    payload.append("description", formData.description || "");

    if (formData.image) {
      payload.append("thumbnail", formData.image); // adjust field name if needed
    }

    if (isEditMode && initialData?._id) {
      updateMutation.mutate({
        id: initialData._id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of your event."
              : "Fill in the information to create a new event."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type</Label>
            <Input
              id="eventType"
              value={formData.eventType}
              onChange={(e) => handleChange("eventType", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
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
                      handleChange(
                        "date",
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    disabled={(date) => date < new Date("1900-01-01")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Event Cover Image</Label>

            {formData.imagePreview ? (
              <div className="relative group w-full max-w-md">
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={formData.imagePreview}
                    alt="Event cover preview"
                    width={500}
                    height={320}
                    className="w-full h-64 object-cover"
                    unoptimized
                  />
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-10 text-center">
                <label className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4 text-sm font-medium">
                    Click or drag & drop image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Event Description *</Label>
            <div className="border rounded-md min-h-[400px]">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
                className="h-[360px]"
                readOnly={isSubmitting}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Event"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
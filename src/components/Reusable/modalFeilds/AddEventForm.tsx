"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // or your preferred toast library
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

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { useSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL


interface AddEventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddEventModal({ open, setOpen }: AddEventModalProps) {
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const token = sessionData?.user?.accessToken;
  const [formData, setFormData] = useState<any>({
    title: "",
    eventType: "",
    date: "",
    time: "",
    description: "",
    image: null as File | null,
    imagePreview: null as string | null,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
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
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    handleChange("image", null);
    handleChange("imagePreview", null);
  };


  const createEventMutation = useMutation({
    mutationFn: async () => {

      const formPayload = new FormData();

      const jsonData = {
        title: formData.title.trim(),
        eventType: formData.eventType.trim(),
        date: formData.date,
        time: formData.time,
        description: formData.description?.trim() || "",
      };

      formPayload.append("data", JSON.stringify(jsonData));


      if (formData.image) {
        formPayload.append("thamble", formData.image);
      }

      const response = await fetch(`${API_BASE}/event`, {
        // ← Change endpoint if needed (e.g. /events, /admin/events, etc.)
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create event");
      }

      return response.json();
    },

    onSuccess: (data) => {
      toast.success("Event created successfully!");
      setOpen(false);

      // Reset form
      setFormData({
        title: "",
        eventType: "",
        date: "",
        time: "",
        description: "",
        image: null,
        imagePreview: null,
      });

      // Optional: invalidate events list / calendar query
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to create event");
      console.error("Event creation error:", err);
    },
  });

  const handleSubmit = () => {
    // Basic client-side validation
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }
    if (!formData.date) {
      toast.error("Event date is required");
      return;
    }
    if (!formData.time) {
      toast.error("Event time is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required");
      return;
    }

    createEventMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Fill in the details to create a new event.</DialogDescription>
        </DialogHeader>

        {/* Rest of your form remains almost same, just change button */}

        <div className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Digital Skills Bootcamp 2025"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type / Category</Label>
            <Input
              id="eventType"
              placeholder="Workshop • Webinar • Networking • Bootcamp"
              value={formData.eventType}
              onChange={(e) => handleChange("eventType", e.target.value)}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... date & time fields same as before ... */}
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
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(new Date(formData.date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={(date) =>
                      handleChange("date", date ? date.toISOString().split("T")[0] : "")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>
          </div>

          {/* Cover Image - same as before */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {formData.imagePreview ? (
              <div className="relative group w-full max-w-md">
                <div className="overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={formData.imagePreview}
                    alt="Event cover preview"
                    width={500}
                    height={320}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-10 text-center">
                <label className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4 text-sm font-medium">Click or drag & drop image here</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, WEBP (max 5MB)
                  </p>
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </label>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description *</Label>
            <div className="border rounded-md min-h-[320px]">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => handleChange("description", value)}
                placeholder="Describe your event in detail..."
                className="h-[280px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createEventMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
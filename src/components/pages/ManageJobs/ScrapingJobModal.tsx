"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ScrapingJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScrapingJobModal({
  open,
  onOpenChange,
}: ScrapingJobModalProps) {
  const labelClass = "block text-base font-medium text-[#1E1E1E] mb-1.5";
  const fieldClass =
    "w-full h-[48px] rounded-[4px] border border-[#0000001A] px-4 outline-none focus:border-black focus:ring-1 focus:ring-black";

  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [jobTitle, setJobTitle] = useState("");

  const mutation = useMutation({
    mutationFn: async (payload: { job_title: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed (${res.status})`);
      }

      return res.json();
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(response?.message || "Scraping job created successfully");
      setJobTitle("");
      onOpenChange(false);
    },

    onError: (err: Error) => {
      console.error("Failed to create scraping job:", err);
      toast.error(err.message || "Could not create scraping job");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = jobTitle.trim();
    if (!trimmed) return;
    mutation.mutate({ job_title: trimmed });
  };

  const handleClose = () => {
    if (mutation.isPending) return;
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white rounded-t-xl sm:rounded-t-2xl">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Scraping Jobs
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div>
            <label className={labelClass}>
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="job_title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className={fieldClass}
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="h-[48px] rounded-[8px] px-5 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-[#FFFF00] h-[48px] text-[#1E1E1E] hover:bg-[#FFFF00]/90 rounded-[8px] min-w-[140px] w-full sm:w-auto"
            >
              {mutation.isPending ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

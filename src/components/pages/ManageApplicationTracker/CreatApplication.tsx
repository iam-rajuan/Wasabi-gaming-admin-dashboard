"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function CreatApplication() {
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [description, setDescription] = useState("");

  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const { data: schoolsResponse, isLoading: isSchoolsLoading } = useQuery({
    queryKey: ["schoolsName"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user?role=school`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }
      return response.json();
    },
  });

  const schools = useMemo(() => {
    const rawList = Array.isArray(schoolsResponse?.data)
      ? schoolsResponse.data
      : Array.isArray(schoolsResponse)
        ? schoolsResponse
        : [];

    return rawList.map((school: any) => ({
      id: school?._id || school?.id || school?.schoolId || "",
      name: school?.schoolName || school?.name || "Unnamed School",
    }));
  }, [schoolsResponse]);

  const applicationTrackerMutation = useMutation({
    mutationFn: async (formData: {
      schoolName: string;
      applicationType: string;
      description: string;
      status: "approved";
    }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/application-tracker/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create application");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Application created successfully");
      setSelectedSchoolId("");
      setApplicationType("");
      setDescription("");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchoolId) {
      toast.error("Please select a school");
      return;
    }
    if (!applicationType.trim()) {
      toast.error("Please enter application type");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter description");
      return;
    }

    applicationTrackerMutation.mutate({
      schoolName: selectedSchoolId,
      applicationType: applicationType.trim(),
      description: description.trim(),
      status: "approved",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold leading-tight text-[#1f1f1f] md:text-4xl">
          Manage Application Tracker
        </h1>
        <p className="mt-1 text-sm text-[#6b6b6b] md:text-base">
          Manage all applications
        </p>
      </div>

      <div className="rounded-[24px] border border-[#dddddd] p-6 md:p-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-base font-medium text-[#1f1f1f]">
              School Name
            </label>
            <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
              <SelectTrigger className="h-12 w-full rounded-xl border border-[#d7d7d7] bg-[#f3f3f3] px-4 text-sm text-[#1f1f1f] outline-none focus:border-[#bdbdbd]">
                <SelectValue
                  placeholder={
                    isSchoolsLoading ? "Loading schools..." : "Select school"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[#1f1f1f]">
              Application Type
            </label>
            <input
              type="text"
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#d7d7d7] bg-[#f3f3f3] px-4 text-sm text-[#1f1f1f] outline-none focus:border-[#bdbdbd]"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[#1f1f1f]">
              Description
            </label>
            <textarea
              rows={7}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#d7d7d7] bg-[#f3f3f3] p-4 text-sm text-[#1f1f1f] outline-none focus:border-[#bdbdbd]"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={applicationTrackerMutation.isPending}
              className="rounded-xl bg-[#FFF300] px-7 py-2.5 text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f3e900]"
            >
              {applicationTrackerMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatApplication;

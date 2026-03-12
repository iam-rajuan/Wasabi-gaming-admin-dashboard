


"use client";
import React, { useState } from "react";
import Headers from "../../Reusable/Headers";
import {
  FaBuilding,
  FaCalendar,
  FaEdit,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import ReusableModal from "../../Reusable/ReusableModal";
import AddManualJobModal from "./AddManualJobModal";
import ScrapingJobModal from "./ScrapingJobModal";
import { FaPlus } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import LoderComponent from "@/components/loader/LoderComponent";
import { ReusablePagination } from "@/components/pagination";

// Jobs Card Component (unchanged except minor status fallback)
const JobsCard = ({
  company,
  position,
  status,
  date,
  onDelete,
  onView,
  onEdit,
  onSelect,
  isSelected,
}) => {
  const displayStatus = status || "pending";

  const statusColor =
    displayStatus === "active"
      ? "bg-[#DCFCE7] text-[#008236]"
      : displayStatus === "Approved"
      ? "bg-green-200 text-green-800"
      : displayStatus === "Rejected" ||
        displayStatus === "Inactive" ||
        displayStatus === "Closed"
      ? "bg-red-200 text-red-800"
      : "bg-yellow-200 text-yellow-800"; // default / pending / Open

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the job at ${company}`,
      icon: "warning",
      iconColor: "#ef4444",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl shadow-xl",
        title: "text-gray-800 font-semibold text-xl",
        htmlContainer: "text-gray-600",
        confirmButton: "rounded-xl px-6 py-2 font-medium",
        cancelButton: "rounded-xl px-6 py-2 font-medium",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The job has been deleted successfully.",
          icon: "success",
          background: "#ffffff",
          confirmButtonColor: "#10b981",
          confirmButtonText: "Done",
          customClass: {
            popup: "rounded-2xl shadow-xl",
            title: "text-gray-800 font-semibold text-xl",
            htmlContainer: "text-gray-600",
            confirmButton: "rounded-xl px-6 py-2 font-medium",
          },
        }).then(() => {
          onDelete();
        });
      }
    });
  };

  return (
    <div
      onClick={onSelect}
      className={`w-full bg-white shadow-sm rounded-2xl p-5 border flex space-y-3 flex-col gap-3 hover:shadow-md transition-all duration-200 cursor-pointer ${
        isSelected ? "border-[#FFFF00]" : "border-gray-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-full">
            <FaBuilding size={26} className="text-gray-700" />
          </div>
        </div>
        <p
          className={`text-sm px-4 py-1 rounded-3xl font-medium ${statusColor}`}
        >
          {displayStatus}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[16px] popbold text-gray-800">{company}</p>
          <p className="text-sm text-gray-600">{position}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <FaCalendar size={14} />
          <span>{date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex items-center justify-center gap-2 flex-1 border border-gray-300 py-[7px] rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all"
        >
          <FaEye size={19} className="text-gray-600" /> View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center justify-center gap-2 flex-1 border border-gray-300 py-[7px] rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all"
        >
          <FaEdit size={19} className="text-gray-600" /> Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="flex items-center justify-center border border-gray-200 rounded-full p-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 text-gray-500"
        >
          <FaTrash size={15} />
        </button>
      </div>
    </div>
  );
};

const ManageJobs = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrapingOpen, setIsScrapingOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken || "";

  const queryClient = useQueryClient();

  // Fetch jobs (unchanged)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", TOKEN],
    queryFn: async () => {
      const limit = 100;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

      const fetchJobsPage = async (page: number) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/job?page=${page}&limit=${limit}`,
          { headers }
        );

        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      };

      const firstResult = await fetchJobsPage(1);
      const firstPageJobs = Array.isArray(firstResult?.data)
        ? firstResult.data
        : Array.isArray(firstResult?.data?.data)
        ? firstResult.data.data
        : [];

      const meta = firstResult?.meta || firstResult?.data?.meta || {};
      const totalPages =
        Number(meta?.totalPage || meta?.totalPages) ||
        (meta?.total ? Math.ceil(Number(meta.total) / limit) : 1);

      if (totalPages <= 1) return firstPageJobs;

      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) => fetchJobsPage(i + 2))
      );

      const remainingJobs = remainingPages.flatMap((result: any) =>
        Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.data?.data)
          ? result.data.data
          : []
      );

      return [...firstPageJobs, ...remainingJobs];
    },
    enabled: !!TOKEN,
  });

  // Update Job Mutation
  const updateJobMutation = useMutation({
    mutationFn: async (updatedJob: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job/${updatedJob._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(updatedJob),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update job");
      }

      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "Job updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsEdit(false);
      setSelectedJob(null);
    },
    onError: (err: any) => {
      Swal.fire({
        title: "Error",
        text: err.message || "Could not update job",
        icon: "error",
      });
    },
  });

  // Delete Job Mutation (unchanged)
  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job/${jobId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete job");
      }

      return true;
    },

    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "Job has been deleted successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },

    onError: (err: any) => {
      Swal.fire({
        title: "Error",
        text: err.message || "Could not delete the job. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  // Approve Job Mutation (unchanged)
  const approveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/job/approved/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to approve job");
      }

      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        title: "Approved!",
        text: "Job approved successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      setSelectedJobId("");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err: any) => {
      Swal.fire({
        title: "Error",
        text: err.message || "Could not approve job. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const jobs = data || [];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const paginatedJobs = jobs.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  if (isLoading) return <LoderComponent />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-600">Error loading jobs...</div>
    );

  const handleDeleteJob = (jobId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(jobId);
      }
    });
  };

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setIsViewOpen(true);
  };

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setIsEdit(true);
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId((prev) => (prev === jobId ? "" : jobId));
  };

  const handleApproveJob = () => {
    if (!selectedJobId) return;
    approveJobMutation.mutate(selectedJobId);
  };

  // Edit payload mapper for existing reusable edit modal
  const handleSave = (rawFormData: any) => {
    const payload = {
      title: rawFormData.title?.trim() || "",
      location: rawFormData.location?.trim() || "",
      companyName: rawFormData.companyName?.trim() || "",
      companyType: rawFormData.companyType?.trim() || "Software Development",
      postedBy: rawFormData.postedBy?.trim() || "Admin",
      level: rawFormData.level?.trim() || "",
      salaryRange: rawFormData.salaryRange?.trim() || "",
      startDate: rawFormData.startDate
        ? new Date(rawFormData.startDate).toISOString().split("T")[0]
        : "",
      applicationDeadline: rawFormData.applicationDeadline
        ? new Date(rawFormData.applicationDeadline).toISOString().split("T")[0]
        : "",
      jobStatus: rawFormData.jobStatus || "Open",
      description: rawFormData.description?.trim() || "",
      additionalInfo: rawFormData.additionalInfo?.trim() || "",
      status: rawFormData.status || "active",
      requiredSkills: Array.isArray(rawFormData.requiredSkills)
        ? rawFormData.requiredSkills
        : typeof rawFormData.requiredSkills === "string"
        ? rawFormData.requiredSkills
            .split(/[\n,]+/)
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
    };

    console.log("Sending payload to API:", payload);

    if (!isEdit || !selectedJob?._id) return;

    updateJobMutation.mutate({
      ...payload,
      _id: selectedJob._id,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Headers title={"Manage Jobs"} subHeader={"Approve all jobs"} />

        <div className="flex items-center gap-3">
          {selectedJobId && (
            <button
              onClick={handleApproveJob}
              disabled={approveJobMutation.isPending}
              className="flex gap-2 items-center bg-[#FFFF00] hover:bg-yellow-500 py-3 rounded-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 font-semibold text-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {approveJobMutation.isPending ? "Approving..." : "Approve Jobs"}
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 items-center bg-[#FFFF00] hover:bg-yellow-500 py-3 rounded-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 font-semibold text-gray-900 hover:scale-105"
          >
            <FaPlus /> Add Jobs
          </button>
          <button
            onClick={() => setIsScrapingOpen(true)}
            className="flex gap-2 items-center bg-white border border-[#FFFF00] text-gray-900 hover:bg-yellow-50 py-3 rounded-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 font-semibold"
          >
            Scriping Jobs
          </button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No jobs found. Add your first job!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedJobs.map((job) => (
            <JobsCard
              key={job._id}
              company={job.companyName || job.company || "Unknown Company"}
              position={job.title || "Untitled Position"}
              status={job.status || job.jobStatus || "pending"}
              date={new Date(job.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              onSelect={() => handleSelectJob(job._id)}
              isSelected={selectedJobId === job._id}
              onDelete={() => handleDeleteJob(job._id)}
              onView={() => handleViewJob(job)}
              onEdit={() => handleEditJob(job)}
            />
          ))}
        </div>
      )}

      {jobs.length > itemsPerPage && (
        <ReusablePagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalResults={jobs.length}
          resultsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(Math.max(1, page))}
          activePageClassName="bg-[#FFFF00] text-gray-900 border-[#FFFF00] hover:bg-yellow-400"
        />
      )}

      <AddManualJobModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <ScrapingJobModal open={isScrapingOpen} onOpenChange={setIsScrapingOpen} />

      {/* View Modal */}
      <ReusableModal
        title="View Job"
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        data={selectedJob}
        location={"manageJob"}
        view={true}
      />

      {/* Edit Modal */}
      <ReusableModal
        title="Edit Job"
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        onSave={handleSave}
        location={"manageJob"}
        data={selectedJob}
        edit={true}
      />
    </div>
  );
};

export default ManageJobs;

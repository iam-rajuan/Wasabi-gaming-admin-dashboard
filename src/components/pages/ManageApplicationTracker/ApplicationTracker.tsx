"use client";
import React, { useState } from "react";
import Headers from "../../Reusable/Headers";
import { Trash2 } from "lucide-react";
import {
  FaFileAlt,
  FaBriefcase,
  FaRegCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import ReusableModal from "../../Reusable/ReusableModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Cards = ({ name, icon, number, details, color }) => {
  return (
    <div className="bg-white p-6 py-5 h-[200px] flex flex-col justify-between rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 text-sm font-medium popreg">{name}</p>
        <div className={`text-lg ${color}`}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 popmed mb-1">{number}</p>
        <p className="text-sm text-gray-500 popreg">{details}</p>
      </div>
    </div>
  );
};

const ApplicationTracker = () => {
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";

  // Card statistics API
  const { data: cardResponse, isLoading: cardLoading } = useQuery({
    queryKey: ["applicationTrackerCards"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/application-tracker/overview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch tracker overview");
      return res.json();
    },
  });

  // Table / List data API
  const { data: tableResponse, isLoading: tableLoading, refetch } = useQuery({
    queryKey: ["applicationTrackerTable"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/application-tracker/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch application list");
      return res.json();
    },
  });


  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/application-tracker/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete application");
      }
      return res.json();
    },
    onSuccess: () => {
      setDeleteModalOpen(false);
      setSelectedApplication(null);
      refetch();
    },
  });

  // Prepare card data with safe fallbacks
  const stats = cardResponse?.data || {
    totalStudent: 0,
    activeCourse: 0,
    pandingTask: 0,
    totalApplication: "0",
  };

  const cardsData = [
    {
      id: 1,
      name: "Total Applications",
      number: stats.totalApplication || "0",
      details: "All submitted applications",
      icon: <FaFileAlt />,
      color: "text-blue-500",
    },
    {
      id: 2,
      name: "Active Applications",
      number: stats.activeCourse || "0",
      details: "Currently active courses/applications",
      icon: <FaBriefcase />,
      color: "text-green-500",
    },
    {
      id: 3,
      name: "Pending Tasks",
      number: stats.pandingTask || "0",
      details: "Applications/tasks pending review",
      icon: <FaRegCalendarAlt />,
      color: "text-purple-500",
    },
    {
      id: 4,
      name: "Total Students",
      number: stats.totalStudent || "0",
      details: "Registered students who applied",
      icon: <FaUsers />,
      color: "text-yellow-500",
    },
  ];

  // Real application data from API
  const applications = tableResponse?.data || [];

  // Filter applications by status
  const filteredData =
    statusFilter === "All Status"
      ? applications
      : applications.filter(
        (item) =>
          item.status?.toLowerCase() === statusFilter.toLowerCase()
      );

  const filterOptions = [
    "All Status",
    "pending",
    "approved",
    "rejected",
  ];

  const columns = [
    {
      header: "Institution",
      accessor: "schoolName.schoolName",
      cell: (value) => (
        <span className="font-medium text-gray-800">{value || "N/A"}</span>
      ),
    },
    {
      header: "Application Type",
      accessor: "applicationType",
      cell: (value) => (
        <span className="font-medium text-gray-700">{value || "N/A"}</span>
      ),
    },
    {
      header: "Submitted By",
      accessor: "createBy.firstName",
      cell: (value, row) => (
        <span className="text-gray-700">
          {value || row.createBy?.email?.split("@")[0] || "Admin"}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <FaRegCalendarAlt className="text-gray-400 text-sm" />
          <span className="text-sm text-gray-700">
            {value
              ? new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value, row) => {
        const status = (value || "").toLowerCase();
        let statusColor = "bg-gray-100 text-gray-800";

        if (status === "approved") statusColor = "bg-green-100 text-green-800";
        if (status === "pending") statusColor = "bg-yellow-100 text-yellow-800";
        if (status === "rejected") statusColor = "bg-red-100 text-red-800";

        return (
          <div className="flex flex-col items-start gap-1">
            <span
              className={`w-fit px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}
            >
              {value || "Unknown"}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-[180px]">
              {row.description || "No description provided"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Action",
      accessor: "_id",
      cell: (value, row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedApplication(row);
            setDeleteModalOpen(true);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  const title = "Application Tracker";
  const subtitle = "Monitor and manage all student applications";

  const handleSave = (data) => {
    console.log("New application saved:", data);
    setOpen(false);
  };

  if (cardLoading || tableLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Headers title={title} subHeader={subtitle} />
        <Link
          href="/dashboard/application-tacker/create-application"
          className="flex items-center gap-2 bg-[#FFFF00] hover:bg-yellow-500 py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-gray-900"
        >
          Create Application
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsData.map((card) => (
          <Cards
            key={card.id}
            name={card.name}
            icon={card.icon}
            number={card.number}
            details={card.details}
            color={card.color}
          />
        ))}
      </div>

      <div className="bg-white mt-8 p-5 border-2 border-[#0000001A] rounded-2xl">
        <div className="pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
            >
              {filterOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row, idx) => (
                <tr key={row._id || idx} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column, colIndex) => {
                    const value = column.accessor.includes(".")
                      ? column.accessor
                        .split(".")
                        .reduce((o, k) => (o || {})[k], row)
                      : row[column.accessor];

                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        {column.cell
                          ? column.cell(value, row)
                          : value || "N/A"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {applications.length === 0
                  ? "No applications found yet"
                  : `No applications match the selected status: ${statusFilter}`}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredData.length} of {applications.length} applications
          {statusFilter !== "All Status" && ` (filtered by: ${statusFilter})`}
        </div>
      </div>

      <ReusableModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        location={"applicationTracker"}
        title="Add New Application"
        submitText="Save Application"
      />

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[430px]">
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application
              {selectedApplication?.schoolName?.schoolName
                ? ` for ${selectedApplication.schoolName.schoolName}`
                : ""}{" "}
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedApplication(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!selectedApplication?._id) return;
                deleteMutation.mutate(selectedApplication._id);
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationTracker;

"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Headers from "../../Reusable/Headers";
import ReusableModal from "../../Reusable/ReusableModal";
import { MdPersonAddAlt1 } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddStudent,
  useGetAllStudent,
  useStudentDelete,
} from "@/hooks/apiCalling";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReusablePagination } from "@/components/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoderComponent from "@/components/loader/LoderComponent";

const filterOptions = ["All", "Year 9", "Year 10", "Year 11"];

const Students = () => {
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: sessionData } = useSession();
  const token = (sessionData?.user as { accessToken: string })?.accessToken;

  const { data, isLoading, isError, refetch } = useGetAllStudent(
    currentPage,
    itemsPerPage,
    selectedFilter === "All" ? "" : selectedFilter,
    searchTerm || "",
    token,
  );

  const deleteMutation = useStudentDelete(token);
  const addStudent = useAddStudent(token, () => setOpen(false));

  const meta = data?.meta;
  const totalResults = meta?.total || 0;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const getPurchasedPlanName = (student: any) => {
    const planName =
      student?.subscription?.name ||
      student?.purchasePlans?.name ||
      student?.purchasePlan?.name ||
      student?.plan?.name ||
      student?.subscriptionPlan?.name ||
      student?.purchasedPlan?.name;

    if (!planName) return "-";
    return String(planName).charAt(0).toUpperCase() + String(planName).slice(1);
  };
  const getPlanBadgeClass = (student: any) => {
    const rawName = String(
      student?.subscription?.name ||
        student?.purchasePlans?.name ||
        student?.purchasePlan?.name ||
        student?.plan?.name ||
        student?.subscriptionPlan?.name ||
        student?.purchasedPlan?.name ||
        "",
    ).toLowerCase();

    if (rawName === "pro" || rawName === "premium") {
      return "bg-[#FEF9C2] text-[#894B00]";
    }
    return "bg-gray-100 text-gray-700";
  };

  const handleDeleteClick = (id: string, name: string) => {
    setStudentToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    deleteMutation.mutate(studentToDelete.id, {
      onSuccess: () => {
        refetch();
        setDeleteModalOpen(false);
        setStudentToDelete(null);
      },
    });
  };

  const handleSave = (studentData: {
    fullName: string;
    email: string;
    grade: string;
    status: string;
  }) => {
    addStudent.mutate(studentData);

    refetch();
  };
  if (isLoading) return <LoderComponent />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <Headers
          title="Students"
          subHeader="Manage all students enrolled in your platform"
        />
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-[#FFFF00] hover:bg-yellow-500 py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-gray-900 disabled:opacity-60"
        >
          <MdPersonAddAlt1 size={18} /> Add Student
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center my-4 gap-3">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-3 pr-4 py-2 text-sm bg-[#F9F9F9] border w-[300px] border-gray-200 rounded-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
        />

        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[150px] rounded-full">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="border rounded-lg overflow-hidden">
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
        </div>
      ) : isError ? (
        <div className="text-red-600 py-10 text-center">
          {" "}
          Failed to load students
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600 border-b-2 border-gray-200">
                <th className="py-4 px-4 font-semibold">Name</th>
                <th className="py-4 px-4 font-semibold">Email</th>
                <th className="py-4 px-4 font-semibold">Grade</th>
                <th className="py-4 px-4 font-semibold">Courses</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Plan</th>
                <th className="py-4 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-4 px-4">{student.email}</td>
                  <td className="py-4 px-4">{student.grade || "-"}</td>
                  <td className="py-4 px-4">{student.course?.length || 0}</td>
                  <td className="py-4 px-4">
                    <span
  className={`px-3 py-1 rounded-full text-xs font-medium ${
    student.status?.toLowerCase() === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-600"
  }`}
>
  {student.status?.charAt(0).toUpperCase() + student.status?.slice(1).toLowerCase()}
</span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-medium ${getPlanBadgeClass(student)}`}
                    >
                      {getPurchasedPlanName(student)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        handleDeleteClick(
                          student._id,
                          `${student.firstName} ${student.lastName}`,
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-4">
          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            resultsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add Student Modal */}
      <ReusableModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        title="Add Student"
        subTitle="Add a new student to your school management platform."
        submitText="Add Student"
        location="student"
        loading={addStudent.isPending}
      />

      {/* ShadCN Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{studentToDelete?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;

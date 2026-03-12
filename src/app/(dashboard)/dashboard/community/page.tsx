"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

// UI Components (shadcn/ui)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type YesNo = "Yes" | "No";

interface CommunityMember {
  _id: string;
  fullName?: string;
  email?: string;
  age?: number;

  location?: string;
  raceEthnicity?: string;
  yearGroup?: string;
  industry?: string;
  pathway?: string;

  firstInFamilyToAttendUni?: YesNo | string;
  receivedFreeSchoolMeals?: YesNo | string;
  careExperience?: YesNo | string;

  homePostcode?: string;

  status?: string;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
}

const fetchMembers = async (): Promise<CommunityMember[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/community`);
  if (!res.ok) throw new Error("Failed to fetch community members");
  const json = await res.json();
  return json.data || [];
};

const deleteMember = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/community/${id}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete member");
  }

  return true;
};

const formatDateTime = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
};

const safe = (v: any) => {
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
};

const labelize = (key: string) => {
  const map: Record<string, string> = {
    fullName: "Full Name",
    email: "Email",
    age: "Age",
    location: "Location",
    raceEthnicity: "Race/Ethnicity",
    yearGroup: "Year Group",
    industry: "Industry",
    pathway: "Pathway",
    firstInFamilyToAttendUni: "First in Family to Attend Uni",
    receivedFreeSchoolMeals: "Received Free School Meals",
    careExperience: "Care Experience",
    homePostcode: "Home Postcode",
    status: "Status",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };

  if (map[key]) return map[key];

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
};

function getPageNumbers(current: number, total: number) {
  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  const showLeft = Math.max(2, current - 1);
  const showRight = Math.min(total - 1, current + 1);

  pages.push(1);

  if (showLeft > 2) pages.push("...");

  for (let i = showLeft; i <= showRight; i++) pages.push(i);

  if (showRight < total - 1) pages.push("...");

  pages.push(total);
  return pages;
}

export default function CommunityMembersPage() {
  const queryClient = useQueryClient();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedMember, setSelectedMember] =
    useState<CommunityMember | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: members = [], isLoading, isError } = useQuery({
    queryKey: ["community-members"],
    queryFn: fetchMembers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-members"] });
      setIsDeleteOpen(false);
      setDeleteId(null);
    },
  });

  const total = members.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pagedMembers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return members.slice(start, start + pageSize);
  }, [members, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  const handleView = (member: CommunityMember) => {
    setSelectedMember(member);
    setIsViewOpen(true);
  };

  const tableColumns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "yearGroup", label: "Year Group" },
    { key: "industry", label: "Industry" },
    { key: "pathway", label: "Pathway" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ] as const;

  const pageItems = useMemo(
    () => getPageNumbers(page, totalPages),
    [page, totalPages]
  );

  return (
    <div className="w-full mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Community Members</h1>

      {isError ? (
        <div className="text-center py-10 text-red-600">
          Failed to load community members.
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pagedMembers.map((m) => (
                <TableRow key={m._id}>
                  {tableColumns.map((c) => (
                    <TableCell key={c.key}>
                      {c.key === "createdAt"
                        ? formatDateTime(m.createdAt)
                        : safe(m[c.key])}
                    </TableCell>
                  ))}

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(m)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(m._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-3 border-t">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageItems.map((p, i) =>
                p === "..." ? (
                  <span key={i}>...</span>
                ) : (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === page ? "default" : "outline"}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
            <DialogDescription>
              Full information for this community member.
            </DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-auto">
              {Object.entries(selectedMember)
                .filter(
                  ([key]) => key !== "_id" && key !== "__v"
                )
                .map(([key, value]) => (
                  <div key={key} className="border rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">
                      {labelize(key)}
                    </div>
                    <div className="text-sm mt-1">
                      {key === "createdAt" || key === "updatedAt"
                        ? formatDateTime(value)
                        : safe(value)}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

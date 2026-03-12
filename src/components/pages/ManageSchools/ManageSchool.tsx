// "use client";
// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import { FaBuilding, FaCalendar, FaCheck, FaTimesCircle } from "react-icons/fa";
// import Headers from "../../Reusable/Headers";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import LoderComponent from "@/components/loader/LoderComponent"; // যদি তোমার কাছে থাকে
// import { useSession } from "next-auth/react";
// import { Eye } from "lucide-react";

// // SchoolCards কম্পোনেন্ট (একদম আগের মতোই রাখা হয়েছে)
// interface SchoolCardsProps {
//   name: string;
//   type: string;
//   date: string;
//   schoolStatus: string;
//   isSelected: boolean;
//   onSelect: () => void;
//   onStatusChange: (newStatus: string) => void;
// }

// const SchoolCards: React.FC<SchoolCardsProps> = ({
//   name,
//   type,
//   date,
//   schoolStatus,
//   isSelected,
//   onSelect,
//   onStatusChange,
// }) => {
//   const [currentSchoolStatus, setCurrentSchoolStatus] = useState(
//     schoolStatus || "pending",
//   );

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setCurrentSchoolStatus(schoolStatus || "pending");
//   }, [schoolStatus]);

//   const normalizedSchoolStatus = (currentSchoolStatus || "").toLowerCase();
//   const displaySchoolStatus =
//     normalizedSchoolStatus.charAt(0).toUpperCase() +
//     normalizedSchoolStatus.slice(1);
//   const isPending = normalizedSchoolStatus === "pending";
//   const isApproved =
//     normalizedSchoolStatus === "approved" ||
//     normalizedSchoolStatus === "accepted";
//   const isRejected = normalizedSchoolStatus === "rejected";

//   const statusColor = isApproved
//     ? "bg-green-200 text-green-800"
//     : isRejected
//       ? "bg-red-200 text-red-800"
//       : "bg-yellow-200 text-yellow-800";

//   const handleApprove = (e) => {
//     e.stopPropagation();
//     Swal.fire({
//       title: "Approve School",
//       text: `Are you sure you want to approve ${name}?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#10b981",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, Approve",
//       cancelButtonText: "Cancel",
//       background: "#ffffff",
//       customClass: {
//         popup: "rounded-2xl shadow-xl",
//         title: "text-gray-800 font-semibold text-xl",
//         htmlContainer: "text-gray-600",
//         confirmButton: "rounded-xl px-6 py-2 font-medium",
//         cancelButton: "rounded-xl px-6 py-2 font-medium",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setCurrentSchoolStatus("approved");
//         onStatusChange("approved");
//       }
//     });
//   };

//   const handleReject = (e) => {
//     e.stopPropagation();
//     Swal.fire({
//       title: "Reject School",
//       text: `Are you sure you want to reject ${name}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, Reject",
//       cancelButtonText: "Cancel",
//       background: "#ffffff",
//       customClass: {
//         popup: "rounded-2xl shadow-xl",
//         title: "text-gray-800 font-semibold text-xl",
//         htmlContainer: "text-gray-600",
//         confirmButton: "rounded-xl px-6 py-2 font-medium",
//         cancelButton: "rounded-xl px-6 py-2 font-medium",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setCurrentSchoolStatus("rejected");
//         onStatusChange("rejected");
//       }
//     });
//   };

//   const handleViewDetails = (e) => {
//     e.stopPropagation();
//     Swal.fire({
//       title: name,
//       html: `
//         <div style="text-align:left;line-height:1.8;">
//           <p><strong>Type:</strong> ${type} School</p>
//           <p><strong>Joined:</strong> ${date}</p>
//           <p><strong>School Status:</strong> ${displaySchoolStatus}</p>
//         </div>
//       `,
//       icon: "info",
//       confirmButtonColor: "#4f46e5",
//       confirmButtonText: "Close",
//       background: "#ffffff",
//       customClass: {
//         popup: "rounded-2xl shadow-xl",
//         title: "text-gray-800 font-semibold text-xl",
//         confirmButton: "rounded-xl px-6 py-2 font-medium",
//       },
//     });
//   };

//   return (
//     <div className="w-full">
//       <div
//         className={`w-full bg-white shadow-sm rounded-2xl p-5 border-2 flex flex-col gap-5 hover:shadow-md transition-all duration-200 cursor-pointer ${
//           isSelected ? "border-yellow-500" : "border-gray-100"
//         }`}
//         onClick={onSelect}
//       >
//         <div className="flex justify-between items-center">
//           <div className="p-3 bg-slate-100 rounded-full">
//             <FaBuilding size={26} className="text-gray-700" />
//           </div>
//           <div className="flex flex-col items-end">
//             <p
//               className={`text-sm px-4 py-1 rounded-3xl font-medium ${statusColor}`}
//             >
//               {displaySchoolStatus}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col text-sm text-gray-500 gap-2">
//           <div className="">
//             <p className="text-[16px] font-semibold text-gray-800">{name}</p>
//             <p className="text-sm text-gray-600">{type} School</p>
//           </div>
//           <div className="flex gap-2 items-center mt-4">
//             <FaCalendar size={14} />
//             <span>{date}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between gap-3">
//           <button
//             onClick={handleViewDetails}
//             className="flex items-center justify-center gap-2 w-full border border-[#0000001A] py-2 rounded-3xl text-[#1A1A1A] font-medium hover:from-indigo-100 hover:to-blue-100 transition-all"
//           >
//             <Eye className="w-4 h-4" />
//             View Details
//           </button>
//         </div>
//       </div>

//       {isSelected && (
//         <div className="mt-3 flex items-center gap-2">
//           {isPending && (
//             <>
//               <button
//                 onClick={handleApprove}
//                 className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5E900] px-4 py-1.5 text-[13px] font-semibold text-[#111111] shadow-sm hover:bg-[#EBDD00] transition-all"
//               >
//                 <FaCheck size={11} className="text-[#111111]" /> Approved
//               </button>
//               <button
//                 onClick={handleReject}
//                 className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE2E2] px-4 py-1.5 text-[13px] font-semibold text-[#991B1B] shadow-sm hover:bg-[#FECACA] transition-all"
//               >
//                 <FaTimesCircle size={11} className="text-[#991B1B]" /> Rejected
//               </button>
//             </>
//           )}

//           {isApproved && (
//             <button
//               disabled
//               className="inline-flex items-center justify-center gap-2 rounded-full bg-[#DCFCE7] px-4 py-1.5 text-[13px] font-semibold text-[#166534] shadow-sm cursor-not-allowed"
//             >
//               <FaCheck size={11} className="text-[#166534]" /> Approved
//             </button>
//           )}

//           {isRejected && (
//             <button
//               disabled
//               className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE2E2] px-4 py-1.5 text-[13px] font-semibold text-[#991B1B] shadow-sm cursor-not-allowed"
//             >
//               <FaTimesCircle size={11} className="text-[#991B1B]" /> Rejected
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const ManageSchool = () => {
//   const queryClient = useQueryClient();
//   const session = useSession();
//   const TOKEN = session?.data?.user?.accessToken || "";

//   // GET all schools
//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["manageSchools"],
//     queryFn: async () => {
//       const token = localStorage.getItem("token") || ""; // অথবা next-auth থেকে নাও
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user?role=school`,
//         {
//           headers: {
//             Authorization: `Bearer ${TOKEN}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch schools");
//       }
//       return response.json();
//     },
//   });

//   const schools = data?.data || []; // ধরে নিচ্ছি response এ { success: true, data: [...] } আসছে

//   // Update school status (PUT)
//   const updateSchoolMutation = useMutation({
//     mutationFn: async ({
//       id,
//       schoolStatus,
//     }: {
//       id: string | number;
//       schoolStatus: string;
//     }) => {
//       // const token = localStorage.getItem("token") || "";
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${TOKEN}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ schoolStatus }),
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update school status");
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["manageSchools"] });
//       Swal.fire({
//         title: "Success!",
//         text: "School status updated successfully.",
//         icon: "success",
//         confirmButtonColor: "#10b981",
//       });
//     },
//     onError: () => {
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to update school status.",
//         icon: "error",
//         confirmButtonColor: "#ef4444",
//       });
//     },
//   });

//   const [selectedSchool, setSelectedSchool] = useState<string | number | null>(
//     null,
//   );

//   const handleSelectSchool = (id: string | number) => {
//     setSelectedSchool((prev) => (prev === id ? null : id));
//   };

//   const handleStatusChange = (id: string | number, newStatus: string) => {
//     updateSchoolMutation.mutate({ id, schoolStatus: newStatus });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <LoderComponent />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center py-10 text-red-600">
//         Error loading schools: {error?.message || "Something went wrong"}
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       <div className="flex justify-between items-center mb-8">
//         <Headers
//           title="Manage Schools"
//           subHeader="Approve or manage school applications"
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {schools.length === 0 ? (
//           <div className="col-span-full text-center py-12 text-gray-500">
//             No schools found
//           </div>
//         ) : (
//           schools.map((school: any) => (
//             <SchoolCards
//               key={school._id || school.id}
//               name={school.name || school.schoolName || "Unnamed School"}
//               type={school.type || "Unknown"}
//               date={
//                 school.createdAt
//                   ? new Date(school.createdAt).toLocaleDateString()
//                   : "N/A"
//               }
//               schoolStatus={school.schoolStatus || "pending"}
//               isSelected={selectedSchool === (school._id || school.id)}
//               onSelect={() => handleSelectSchool(school._id || school.id)}
//               onStatusChange={(newStatus) =>
//                 handleStatusChange(school._id || school.id, newStatus)
//               }
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageSchool;



"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  FaBuilding,
  FaCalendar,
  FaCrown,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Headers from "../../Reusable/Headers";
import ReusableModal from "../../Reusable/ReusableModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoderComponent from "@/components/loader/LoderComponent"; // যদি তোমার কাছে থাকে
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const DEFAULT_FEATURES = [
  "Everything included in the Premium plan",
  "School dashboard access",
  "Cohort management and analytics",
  "Student progress tracking",
  "School workshops and events",
  "Dedicated support"
];

// SchoolCards কম্পোনেন্ট (একদম আগের মতোই রাখা হয়েছে)
interface SchoolCardsProps {
  name: string;
  type: string;
  date: string;
  status: string;
  subscription?: any;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
  onStatusChange: (newStatus: string) => void;
  onApproveClick: () => void;
  onEditPlan: () => void;
  onViewDetails: () => void;
}

const SchoolCards: React.FC<SchoolCardsProps> = ({
  name,
  type,
  date,
  status,
  subscription,
  onDelete,
  isSelected,
  onSelect,
  onStatusChange,
  onApproveClick,
  onEditPlan,
  onViewDetails,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusColor =
    status === "accepted"
      ? "bg-green-200 text-green-800"
      : status === "rejected"
        ? "bg-red-200 text-red-800"
        : "bg-yellow-200 text-yellow-800";

  const handleDelete = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${name}`,
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
        onDelete();
      }
    });
  };

  const handleApprove = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Approve School",
      text: `Are you sure you want to approve ${name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve",
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
        onStatusChange("accepted");
      }
    });
  };

  const handleReject = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Reject School",
      text: `Are you sure you want to reject ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
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
        onStatusChange("rejected");
      }
    });
  };

  const handleGetPremium = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Upgrade to Premium",
      text: `Do you want to upgrade ${name} to Premium status?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Upgrade",
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
        onStatusChange("premium");
      }
    });
  };

  const handleRevokeApproval = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Revoke Premium/Approval",
      text: `Do you want to change ${name} back to Pending status?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Revoke",
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
        onStatusChange("pending");
      }
    });
  };

  const handleReopenRejected = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Reopen Application",
      text: `Do you want to reopen ${name}'s application?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reopen",
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
        onStatusChange("pending");
      }
    });
  };

  return (
    <div
      className={`w-full bg-white shadow-sm rounded-2xl p-5 border-2 flex flex-col gap-5 hover:shadow-md transition-all duration-200 cursor-pointer ${isSelected ? "border-yellow-500" : "border-gray-100"
        }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div className="p-3 bg-slate-100 rounded-full">
          <FaBuilding size={26} className="text-gray-700" />
        </div>
        <div className="flex flex-col items-end">
          <p
            className={`text-sm px-4 py-1 rounded-3xl font-medium ${statusColor}`}
          >
            {status}
          </p>
          {status === "accepted" && subscription && (
            <div className="flex items-center gap-1 mt-1">
              <FaCrown size={12} className="text-purple-500" />
              <span className="text-xs text-gray-500">Premium</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col text-sm text-gray-500 gap-2">
        <div className="">
          <p className="text-[16px] font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{type} School</p>
        </div>
        <div className="flex gap-2 items-center mt-4">
          <FaCalendar size={14} />
          <span>{date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 relative">
        {status === "accepted" ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPlan();
              }}
              className="flex items-center justify-center gap-2 flex-1 border border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 py-2 rounded-3xl text-purple-700 font-medium hover:from-purple-100 hover:to-indigo-100 transition-all shadow-sm"
            >
              <FaCrown size={14} className="text-purple-600" /> Edit Plan
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex items-center justify-center gap-2 px-3 border border-gray-200 bg-gray-50 py-2 rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all text-sm"
            >
              Details
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                </div>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange("pending");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors"
                  >
                    Set Pending
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange("rejected");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </>
        ) : status === "rejected" ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReopenRejected(e);
              }}
              className="flex items-center justify-center gap-2 flex-1 border border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 py-2 rounded-3xl text-green-700 font-medium hover:from-green-100 hover:to-emerald-100 transition-all"
            >
              <FaCheckCircle size={14} className="text-green-600" /> Reopen
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex items-center justify-center gap-2 px-3 border border-gray-200 bg-gray-50 py-2 rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all text-sm"
            >
              Details
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApproveClick();
              }}
              className="flex items-center justify-center gap-2 flex-1 border border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 py-2 rounded-3xl text-green-700 font-medium hover:from-green-100 hover:to-emerald-100 transition-all"
            >
              <FaCheckCircle size={14} className="text-green-600" /> Approve
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReject(e);
              }}
              className="flex items-center justify-center gap-2 flex-1 border border-red-300 bg-gradient-to-r from-red-50 to-rose-50 py-2 rounded-3xl text-red-700 font-medium hover:from-red-100 hover:to-rose-100 transition-all"
            >
              <FaTimesCircle size={14} className="text-red-600" /> Reject
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex items-center justify-center gap-2 px-3 border border-gray-200 bg-gray-50 py-2 rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all text-sm"
            >
              Details
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ManageSchool = () => {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedSchoolData, setSelectedSchoolData] = useState<any>(null);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  // Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDetailsData, setSelectedDetailsData] = useState<any>(null);

  const queryClient = useQueryClient();
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";

  // Create Subscription Mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ schoolId, payload }: { schoolId: string; payload: any }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/premium/school-subscribe/${schoolId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create subscription");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manageSchools"] });
      setIsPlanModalOpen(false);
      toast.success("School approved and plan created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update Subscription Mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ schoolId, payload }: { schoolId: string; payload: any }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/premium/school-subscribe/${schoolId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update subscription");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manageSchools"] });
      setIsPlanModalOpen(false);
      toast.success("Plan updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleApproveClick = (school: any) => {
    setSelectedSchoolData({
      _id: school._id || school.id,
      name: "premium",
      features: [
        "Everything included in the Premium plan",
        "School dashboard access",
        "Cohort management and analytics",
        "Student progress tracking",
        "School workshops and events",
        "Dedicated support"
      ],
      price: 20,
      type: "monthly",
    });
    setIsEditingPlan(false);
    setIsPlanModalOpen(true);
  };

  const handleEditPlan = async (school: any) => {
    // Extract subscription ID from the nested structures
    const subId = school.subscribedSchool?._id || school.subscription?._id || school.subscription?.subscription?._id;
    const schoolId = school._id || school.id;

    if (!subId) {
      toast.error("No subscription ID found for this school.");
      return;
    }

    try {
      // Fetch the subscription data first to ensure it's loaded before modal opens
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/premium/${subId}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plan details");
      }

      const resData = await response.json();
      const sub = resData.data;

      if (sub) {
        setSelectedSchoolData({
          _id: schoolId,
          name: sub.name || "premium",
          price: sub.price || 0,
          type: sub.type || "monthly",
          features: Array.isArray(sub.features) ? sub.features : (sub.features ? [sub.features] : []),
        });

        // Open the modal only AFTER data is fetched and set
        setIsEditingPlan(true);
        setIsPlanModalOpen(true);
      } else {
        toast.error("Subscription data not found.");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleViewDetails = (school: any) => {
    setSelectedDetailsData(school);
    setIsDetailsModalOpen(true);
  };

  const handleSavePlan = async (formData: any) => {
    const payload = {
      price: Number(formData.price),
      type: formData.type,
      features: formData.features,
    };

    if (isEditingPlan) {
      updateSubscriptionMutation.mutate({
        schoolId: selectedSchoolData._id,
        payload,
      });
    } else {
      // For creation, we also need to update school status to accepted
      // Usually, the backend might handle this in one go or we do it sequentially.
      // Based on user request: "school approve korle ei plans create pop up open hbe"
      // We'll create the subscription which implies approval.
      createSubscriptionMutation.mutate({
        schoolId: selectedSchoolData._id,
        payload,
      });
      // Optionally update status if the subscription API doesn't do it
      updateSchoolMutation.mutate({ id: selectedSchoolData._id, schoolStatus: "accepted" });
    }
  };

  // GET all schools
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["manageSchools"],
    queryFn: async () => {
      const token = localStorage.getItem("token") || ""; // অথবা next-auth থেকে নাও
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-user?role=school`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }
      return response.json();
    },
  });

  const schools = data?.data || []; // ধরে নিচ্ছি response এ { success: true, data: [...] } আসছে

  // Update school status (PUT)
  const updateSchoolMutation = useMutation({
    mutationFn: async ({ id, schoolStatus }: { id: string | number; schoolStatus: string }) => {
      // const token = localStorage.getItem("token") || "";
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schoolStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update school status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manageSchools"] });
      Swal.fire({
        title: "Success!",
        text: "School status updated successfully.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to update school status.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  // Delete school (DELETE) - যদি backend-এ থাকে
  const deleteSchoolMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schools/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete school");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manageSchools"] });
      Swal.fire({
        title: "Deleted!",
        text: "School deleted successfully.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete school.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  const [selectedSchool, setSelectedSchool] = useState<string | number | null>(null);

  const handleDelete = (id: string | number) => {
    deleteSchoolMutation.mutate(id);
  };

  const handleSelectSchool = (id: string | number) => {
    setSelectedSchool((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = (id: string | number, newStatus: string) => {
    updateSchoolMutation.mutate({ id, schoolStatus: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoderComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        Error loading schools: {error?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <Headers
          title="Manage Schools"
          subHeader="Approve or manage school applications"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No schools found
          </div>
        ) : (
          schools.map((school: any) => (
            <SchoolCards
              key={school._id || school.id}
              name={school.name || school.schoolName || "Unnamed School"}
              type={school.type || "Unknown"}
              date={school.createdAt ? new Date(school.createdAt).toLocaleDateString() : "N/A"}
              status={school.schoolStatus || "pending"}
              subscription={school.subscription}
              isSelected={selectedSchool === (school._id || school.id)}
              onSelect={() => handleSelectSchool(school._id || school.id)}
              onDelete={() => handleDelete(school._id || school.id)}
              onEditPlan={() => handleEditPlan(school)}
              onApproveClick={() => handleApproveClick(school)}
              onStatusChange={(newStatus) => updateSchoolMutation.mutate({ id: school._id || school.id, schoolStatus: newStatus })}
              onViewDetails={() => handleViewDetails(school)}
            />
          ))
        )}
      </div>

      <ReusableModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handleSavePlan}
        location="school-plans"
        title={isEditingPlan ? "Update School Plan" : "Approve School & Create Plan"}
        edit={isEditingPlan}
        submitText={isEditingPlan ? "Update" : "Approve & Create"}
        data={selectedSchoolData}
        loading={createSubscriptionMutation.isPending || updateSubscriptionMutation.isPending}
      />

      <ReusableModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        location="school-details"
        title="School Application Details"
        view={true}
        data={selectedDetailsData}
      />
    </div>
  );
};

export default ManageSchool;

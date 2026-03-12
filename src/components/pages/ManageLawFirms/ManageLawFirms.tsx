/* eslint-disable react-hooks/purity */
"use client";

import React, { useState } from "react";
import Headers from "../../Reusable/Headers";
import { Building, Edit, Eye, Plus, Trash2, MapPin, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import ReusableModal from "../../Reusable/ReusableModal";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import LoderComponent from "@/components/loader/LoderComponent";

const LawFirmCard = ({
  firm,
  isSelected,
  onSelect,
  onViewProfile,
  onEdit,
  onDelete,
}) => {
  const tagsArray =
    typeof firm.expertise === "string"
      ? firm.expertise.split(",").map((tag) => tag.trim())
      : firm.expertise || [];

  const visibleTags = tagsArray.slice(0, 2);
  const extraCount = tagsArray.length - visibleTags.length;

  const handleCardClick = () => {
    onSelect(firm._id);
  };

  const handleViewProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onViewProfile(firm);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(firm);
  };

  const gradients = [
    "from-blue-100 to-blue-100",
    "from-green-100 to-green-100",
    "from-yellow-100 to-yellow-100",
    "from-purple-100 to-purple-100",
    "from-pink-100 to-pink-100",
    "from-indigo-100 to-indigo-100",
  ];
  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];

  return (
   <Card
      className={`rounded-3xl overflow-hidden border-2 transition-all duration-300 w-full max-w-full mx-auto hover:shadow-lg cursor-pointer ${
        isSelected ? "border-yellow-400 shadow-lg" : "border-gray-200 shadow-sm"
      }`}
      onClick={handleCardClick}
    >
      <div className={`bg-gradient-to-r ${randomGradient} p-4 md:p-6 flex justify-center items-center relative h-24 md:h-32`}>
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center p-2 md:p-4 bg-opacity-90">
          {firm.coverImage ? (
            <Image
              width={300}
              height={300}
              src={firm.coverImage}
              alt={firm.firmName || "Law Firm"}
              className="w-full h-full object-contain rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-green-300 rounded-xl flex items-center justify-center">
              <Building size={60} className="text-gray-700" />
            </div>
          )}
        </div>

        {firm.status === "featured" && (
          <Badge
            variant="warning"
            className="absolute top-2 right-2 md:top-4 md:right-4 rounded-full font-medium text-xs md:text-sm border-0 bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
          >
            Featured
          </Badge>
        )}
      </div>

      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
          {firm.firmName || "Law Firm"}
        </h3>

        <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
          {firm.description || "Professional Legal Services"}
        </p>

        <div className="mt-3 md:mt-4 flex flex-col gap-2">
          <div className="flex items-center">
            <MapPin className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
            <span className="ml-2 text-xs md:text-sm text-gray-600">
              {firm.location || "Location not specified"}
            </span>
          </div>

          <div className="flex items-center">
            <Users className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
            <span className="ml-2 text-xs md:text-sm text-gray-600">
              {firm.employees} Attorneys
            </span>
          </div>

          {/* Optional: show internship count */}
          <div className="flex items-center">
            <Briefcase className="text-gray-500 w-4 h-4 md:w-5 md:h-5" />
            <span className="ml-2 text-xs md:text-sm text-gray-600">
              {firm.internshipOpportunities?.length || 0} Opportunities
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 gap-3">
          <button
            onClick={handleViewProfileClick}
            className="flex items-center justify-center gap-2 flex-1 border border-gray-300 py-[7px] rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all text-sm"
          >
            <Eye size={16} className="text-gray-600" /> View
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(firm);
            }}
            className="flex items-center justify-center gap-2 flex-1 border border-gray-300 py-[7px] rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all text-sm"
          >
            <Edit size={16} className="text-gray-600" /> Edit
          </button>

          <button
            onClick={handleDeleteClick}
            className="flex items-center justify-center border border-gray-200 rounded-full p-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 text-gray-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
};

const ManageLawFirms = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFirms, setSelectedFirms] = useState(new Set());
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken || "";
  const queryClient = useQueryClient();

  // Fetch law firms
  const { data: lawFirmsResponse, isLoading } = useQuery({
    queryKey: ["lawfirms"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lawfirm`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch law firms");
      const response = await res.json();
      return response;
    },
    enabled: !!TOKEN,
  });

  const lawFirms = lawFirmsResponse?.data || [];

  // Prepare payload with correct field mapping for backend requirements
  const preparePayload = (rawData: any, isUpdate = false) => {
    const formData = new FormData();

    if (rawData.coverImage instanceof File) {
      formData.append("coverImage", rawData.coverImage);
    }

    const payloadData = {
  firmType: "Law Firm",
  firmName: rawData.firmName || "",
  aboutFirm: rawData.aboutFirm || "",
  location: rawData.location || "",
  foundationYear: Number(rawData.foundationYear) || null,
  employees: Number(rawData.employees) || 0,
  website: rawData.website || "",
  email: rawData.email || "",
  phoneNumber: rawData.phoneNumber || "",
  tags: Array.isArray(rawData.tags) ? rawData.tags : [],
  practiceAreas: rawData.practiceAreas || "",
  keyHighlights: rawData.keyHighlights || "",
  internshipOpportunities: Array.isArray(rawData.internshipOpportunities)
    ? rawData.internshipOpportunities
    : [],
  cultureAndValue: Array.isArray(rawData.cultureAndValue)
    ? rawData.cultureAndValue
    : [],
  benefitsAndPerks: Array.isArray(rawData.benefitsAndPerks)
    ? rawData.benefitsAndPerks
    : [],
  description: rawData.description || "",
};

    formData.append("data", JSON.stringify(payloadData));

    if (isUpdate && rawData._id) {
      return { formData, _id: rawData._id };
    }

    return formData;
  };

  // Create mutation
  const createLawMutation = useMutation({
    mutationFn: async (rawData: any) => {
      const payload = preparePayload(rawData);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lawfirm`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: payload as any,
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create law firm");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawfirms"] });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Law firm created successfully!",
        confirmButtonColor: "#FFFF00",
      });
      setModalVisible(false);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to create law firm. Please try again.",
      });
    },
  });

  // Update mutation
  const updateLawMutation = useMutation({
    mutationFn: async (rawData: any) => {
      const { formData, _id } = preparePayload(rawData, true) as any;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lawfirm/${_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update law firm");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawfirms"] });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Law firm updated successfully!",
        confirmButtonColor: "#FFFF00",
      });
      setIsEdit(false);
      setSelectedFirm(null);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to update law firm. Please try again.",
      });
    },
  });

  // Delete mutation
  const deleteLawMutation = useMutation({
    mutationFn: async (firmId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lawfirm/${firmId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete law firm");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawfirms"] });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Law firm deleted successfully!",
        confirmButtonColor: "#FFFF00",
      });
    },
  });

  const openModal = () => {
    setSelectedFirm(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFirm(null);
  };

  const handleEdit = (value) => {
    setSelectedFirm(value);
    setIsEdit(true);
  };

  const handleDelete = (firm) => {
    const firmName = firm.firmName || "this law firm";
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${firmName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLawMutation.mutate(firm._id);
      }
    });
  };

  const handleSelectFirm = (firmId) => {
    setSelectedFirms((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(firmId)) {
        newSelected.delete(firmId);
      } else {
        newSelected.add(firmId);
      }
      return newSelected;
    });
  };

  const handleViewProfile = (firm) => {
    setSelectedFirm(firm);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFirm(null);
  };

  const handleSave = (data) => {
    console.log("Form data being saved:", data);
    if (isEdit && selectedFirm) {
      updateLawMutation.mutate({ ...data, _id: selectedFirm._id });
    } else {
      createLawMutation.mutate(data);
    }
  };

  const handleApproveSelected = () => {
    if (selectedFirms.size === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select at least one law firm to approve.",
      });
      return;
    }

    Swal.fire({
      title: "Congratulations!",
      text: `Approved ${selectedFirms.size} law firm(s) successfully!`,
      icon: "success",
      confirmButtonColor: "#FFFF00",
      confirmButtonText: "Continue",
    }).then(() => {
      setSelectedFirms(new Set());
    });
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Headers
          title="Manage Law Firm Profiles"
          subHeader="Approve or manage all law firm profiles"
        />
        <button
          onClick={openModal}
          className="flex gap-2 items-center bg-[#FFFF00] hover:bg-yellow-500 py-3 rounded-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 font-semibold text-gray-900 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoderComponent />
        </div>
      ) : lawFirms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Building size={64} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No law firms found</p>
          <p className="text-sm">Create your first law firm to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lawFirms.map((firm) => (
            <LawFirmCard
              key={firm._id}
              firm={firm}
              isSelected={selectedFirms.has(firm._id)}
              onSelect={handleSelectFirm}
              onViewProfile={handleViewProfile}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {selectedFirms.size > 0 && (
        <div className="fixed bottom-10 right-10">
          <Button
            onClick={handleApproveSelected}
            className="bg-[#FFFF00] text-black hover:bg-yellow-500 font-semibold shadow-lg px-6 py-6 rounded-full"
          >
            Approve Selected ({selectedFirms.size})
          </Button>
        </div>
      )}

      <ReusableModal
        title="Create New Law Firm"
        isOpen={modalVisible}
        onClose={closeModal}
        onSave={handleSave}
        location={"createLawFirms"}
        loading={createLawMutation.isPending}
      />

      <ReusableModal
        title="View Law Firm Profile"
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedFirm}
        view={true}
        location={"createLawFirms"}
      />

      <ReusableModal
        title="Edit Law Firm Profile"
        isOpen={isEdit}
        onClose={() => {
          setIsEdit(false);
          setSelectedFirm(null);
        }}
        data={selectedFirm}
        onSave={handleSave}
        edit={true}
        location={"createLawFirms"}
        loading={updateLawMutation.isPending}
      />
    </div>
  );
};

export default ManageLawFirms;

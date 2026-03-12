// "use client";

// import React, { useState, useMemo } from "react";
// import Image from "next/image";
// import { Plus, Edit, Eye, Calendar, Trash2, Loader2 } from "lucide-react";
// import { Pagination } from "@/components/common/pagination";
// import Headers from "../../Reusable/Headers";
// import EditEventModal from "@/components/Reusable/modalFeilds/EditEventForm";
// import ViewEventDetailsModal from "@/components/Reusable/modalFeilds/ViewEventDetailsModal";
// import { useSession } from "next-auth/react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// import LoderComponent from "@/components/loader/LoderComponent";

// const PAGE_SIZE = 6;

// interface Event {
//   _id: string;
//   title: string;
//   description: string;
//   date: string;
//   time?: string;
//   thumbnail?: string;
//   thamble?: string;
//   eventType?: string;
//   createdBy: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const EventCard = React.memo<{
//   event: Event;
//   onEdit: (event: Event) => void;
//   onView: (event: Event) => void;
//   onDelete: (id: string) => void;
//   isDeleting: boolean;
// }>(({ event, onEdit, onView, onDelete, isDeleting }) => {
//   const imageSrc = event.thumbnail || event.thamble || "/placeholder-event.jpg";

//   const eventDate = new Date(event.date);
//   const dateStr = eventDate.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });

//   const timeStr = event?.time ? ` • ${event?.time}` : "";

//   return (
//     <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
//       <div className="relative h-48 overflow-hidden">
//         <Image
//           src={imageSrc}
//           alt={event?.title}
//           fill
//           className="object-cover"
//           unoptimized
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

//         <div className="absolute top-4 left-4 flex gap-2">
//           <button
//             onClick={() => onEdit(event)}
//             className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full shadow-lg"
//             title="Edit Event"
//             disabled={isDeleting}
//           >
//             <Edit className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => onView(event)}
//             className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg"
//             title="View Event"
//             disabled={isDeleting}
//           >
//             <Eye className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => onDelete(event._id)}
//             className="bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-lg"
//             title="Delete Event"
//             disabled={isDeleting}
//           >
//             {isDeleting ? (
//               <Loader2 className="w-4 h-4 text-white animate-spin" />
//             ) : (
//               <Trash2 className="w-4 h-4 text-white" />
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="p-5 space-y-3">
//         <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
//           {event?.title}
//         </h3>

//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <Calendar className="w-4 h-4 text-yellow-500" />
//           {dateStr}
//           {timeStr}
//         </div>

//         <p className="text-sm text-gray-600 line-clamp-3">
//           {event?.description.replace(/<[^>]+>/g, "") || "No description available"}
//         </p>

//         {event?.eventType && (
//           <div className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
//             {event?.eventType}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// EventCard.displayName = "EventCard";

// export default function ManageEvents() {
//   const { data: session } = useSession();
//   const token = session?.user?.accessToken;
//   const queryClient = useQueryClient();

//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const { data: apiResponse, isLoading, isError } = useQuery({
//     queryKey: ["events", token],
//     queryFn: async () => {
//       if (!token) throw new Error("Authentication required");
//       const res = await fetch(`${API_BASE}/event`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to load events");
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   const events: Event[] = apiResponse?.data || [];

//   const [currentPage, setCurrentPage] = useState(1);
//   const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

//   // View modal states
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedViewEvent, setSelectedViewEvent] = useState<Event | null>(null);

//   // Delete states
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [eventToDelete, setEventToDelete] = useState<string | null>(null);
//   const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

//   const itemsPerPage = PAGE_SIZE;
//   const paginatedEvents = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return events.slice(start, start + itemsPerPage);
//   }, [events, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(events.length / itemsPerPage);

//   const openCreate = () => {
//     setSelectedEvent(null);
//     setModalMode("create");
//   };

//   const openEdit = (event: Event) => {
//     setSelectedEvent(event);
//     setModalMode("edit");
//   };

//   const openView = (event: Event) => {
//     setSelectedViewEvent(event);
//     setViewModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalMode(null);
//     setSelectedEvent(null);
//   };

//   const handleDeleteRequest = (id: string) => {
//     setEventToDelete(id);
//     setDeleteConfirmOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!eventToDelete || !token) return;

//     setDeletingEventId(eventToDelete);
//     setDeleteConfirmOpen(false);

//     try {
//       const res = await fetch(`${API_BASE}/event/${eventToDelete}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(errData.message || "Failed to delete event");
//       }

//       queryClient.invalidateQueries({ queryKey: ["events"] });
//       toast.success("Event deleted successfully!");
//     } catch (err: any) {
//       console.error("Delete error:", err);
//       toast.error(err.message || "Failed to delete event");
//     } finally {
//       setDeletingEventId(null);
//       setEventToDelete(null);
//     }
//   };

//   if (isLoading) return <LoderComponent />;

//   if (isError) {
//     return (
//       <div className="py-12 text-center text-red-600">
//         Failed to load events. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <Headers
//           title="Manage Events"
//           subHeader="Create, edit, and monitor all upcoming events"
//         />
//         <button
//           onClick={openCreate}
//           className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors"
//         >
//           <Plus className="w-5 h-5" /> Create Event
//         </button>
//       </div>

//       {events.length === 0 ? (
//         <div className="text-center py-16 text-gray-500">
//           No events found. Start by creating your first event!
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {paginatedEvents.map((event) => (
//               <EventCard
//                 key={event._id}
//                 event={event}
//                 onEdit={openEdit}
//                 onView={() => openView(event)}
//                 onDelete={handleDeleteRequest}
//                 isDeleting={deletingEventId === event._id}
//               />
//             ))}
//           </div>

//           {totalPages > 1 && (
//             <div className="flex justify-center mt-12">
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 itemsPerPage={itemsPerPage}
//                 totalItems={events.length}
//                 startIndex={(currentPage - 1) * itemsPerPage + 1}
//                 endIndex={Math.min(currentPage * itemsPerPage, events.length)}
//                 onPageChange={setCurrentPage}
//                 onItemsPerPageChange={() => { }}
//               />
//             </div>
//           )}
//         </>
//       )}

//       {/* Create / Edit Modal */}
//       {modalMode && (
//         <EditEventModal
//           open={true}
//           setOpen={closeModal}
//           initialData={modalMode === "edit" ? selectedEvent : null}
//         />
//       )}

//       {/* View Details Modal */}
//       <ViewEventDetailsModal
//         open={viewModalOpen}
//         onOpenChange={setViewModalOpen}
//         event={selectedViewEvent}
//       />

//       {/* Delete Confirmation Modal */}
//       <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Event</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this event? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={!!deletingEventId}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleConfirmDelete}
//               disabled={!!deletingEventId}
//               className="bg-red-600 hover:bg-red-700 text-white"
//             >
//               {deletingEventId ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 "Delete Event"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }




"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Edit, Eye, Calendar, Trash2, Loader2 } from "lucide-react";
import { Pagination } from "@/components/common/pagination";
import Headers from "../../Reusable/Headers";
import EditEventModal from "@/components/Reusable/modalFeilds/EditEventForm";
import ViewEventDetailsModal from "@/components/Reusable/modalFeilds/ViewEventDetailsModal";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import LoderComponent from "@/components/loader/LoderComponent";

const PAGE_SIZE = 6;

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  thumbnail?: string;
  thamble?: string;
  eventType?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface EventManagement {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventId: {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    thumbnail: string;
    eventType: string;
  };
  createdAt: string;
  updatedAt: string;
}

const EventCard = React.memo<{
  event: Event;
  onEdit: (event: Event) => void;
  onView: (event: Event) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}>(({ event, onEdit, onView, onDelete, isDeleting }) => {
  const imageSrc = event.thumbnail || event.thamble || "/placeholder-event.jpg";

  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = event?.time ? ` • ${event?.time}` : "";

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc}
          alt={event?.title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full shadow-lg"
            title="Edit Event"
            disabled={isDeleting}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onView(event)}
            className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg"
            title="View Event"
            disabled={isDeleting}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-lg"
            title="Delete Event"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {event?.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-yellow-500" />
          {dateStr}
          {timeStr}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {event?.description.replace(/<[^>]+>/g, "") || "No description available"}
        </p>

        {event?.eventType && (
          <div className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {event?.eventType}
          </div>
        )}
      </div>
    </div>
  );
});

EventCard.displayName = "EventCard";

export default function ManageEvents() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { data: apiResponse, isLoading, isError } = useQuery({
    queryKey: ["events", token],
    queryFn: async () => {
      if (!token) throw new Error("Authentication required");
      const res = await fetch(`${API_BASE}/event`, {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load events");
      return res.json();
    },
  });

  const { data: eventManagementResponse } = useQuery({
    queryKey: ["event-management", token],
    queryFn: async () => {
      if (!token) throw new Error("Authentication required");
      const res = await fetch(`${API_BASE}/event-management`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load event management data");
      return res.json();
    },
    enabled: !!token,
  });

  const eventManagementData: EventManagement[] = eventManagementResponse?.data || [];

  const events: Event[] = apiResponse?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewEvent, setSelectedViewEvent] = useState<Event | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // Table delete states
  const [tableDeleteConfirmOpen, setTableDeleteConfirmOpen] = useState(false);
  const [tableEventToDelete, setTableEventToDelete] = useState<string | null>(null);
  const [tableDeletingId, setTableDeletingId] = useState<string | null>(null);

  const itemsPerPage = PAGE_SIZE;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return events.slice(start, start + itemsPerPage);
  }, [events, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const openCreate = () => {
    setSelectedEvent(null);
    setModalMode("create");
  };

  const openEdit = (event: Event) => {
    setSelectedEvent(event);
    setModalMode("edit");
  };

  const openView = (event: Event) => {
    setSelectedViewEvent(event);
    setViewModalOpen(true);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedEvent(null);
  };

  const handleDeleteRequest = (id: string) => {
    setEventToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete || !token) return;

    setDeletingEventId(eventToDelete);
    setDeleteConfirmOpen(false);

    try {
      const res = await fetch(`${API_BASE}/event/${eventToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete event");
      }

      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully!");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete event");
    } finally {
      setDeletingEventId(null);
      setEventToDelete(null);
    }
  };

  const handleTableDeleteRequest = (id: string) => {
    setTableEventToDelete(id);
    setTableDeleteConfirmOpen(true);
  };

  const handleTableConfirmDelete = async () => {
    if (!tableEventToDelete || !token) return;

    setTableDeletingId(tableEventToDelete);
    setTableDeleteConfirmOpen(false);

    try {
      const res = await fetch(`${API_BASE}/event-management/${tableEventToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete registration");
      }

      queryClient.invalidateQueries({ queryKey: ["event-management"] });
      toast.success("Registration deleted successfully!");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete registration");
    } finally {
      setTableDeletingId(null);
      setTableEventToDelete(null);
    }
  };

  if (isLoading) return <LoderComponent />;

  if (isError) {
    return (
      <div className="py-12 text-center text-red-600">
        Failed to load events. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Headers
          title="Manage Events"
          subHeader="Create, edit, and monitor all upcoming events"
        />
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" /> Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No events found. Start by creating your first event!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={openEdit}
                onView={() => openView(event)}
                onDelete={handleDeleteRequest}
                isDeleting={deletingEventId === event._id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={events.length}
                startIndex={(currentPage - 1) * itemsPerPage + 1}
                endIndex={Math.min(currentPage * itemsPerPage, events.length)}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={() => {}}
              />
            </div>
          )}
        </>
      )}

      {/* Events Management Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mt-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Event</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {eventManagementData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  No registered students found.
                </td>
              </tr>
            ) : (
              eventManagementData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 text-gray-600">{item.phone}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">
                    {item.eventId?.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-500" />
                      {new Date(item.eventId?.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {item.eventId?.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleTableDeleteRequest(item._id)}
                      disabled={tableDeletingId === item._id}
                      className="bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-sm transition-colors"
                      title="Delete Registration"
                    >
                      {tableDeletingId === item._id ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <EditEventModal
          open={true}
          setOpen={closeModal}
          initialData={modalMode === "edit" ? selectedEvent : null}
        />
      )}

      {/* View Details Modal */}
      <ViewEventDetailsModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        event={selectedViewEvent}
      />

      {/* Card Delete Confirmation Modal */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingEventId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={!!deletingEventId}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingEventId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table Delete Confirmation Modal */}
      <AlertDialog open={tableDeleteConfirmOpen} onOpenChange={setTableDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!tableDeletingId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTableConfirmDelete}
              disabled={!!tableDeletingId}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {tableDeletingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Registration"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
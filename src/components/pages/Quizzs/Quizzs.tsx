// "use client";

// import React, { useState } from "react";
// import Headers from "../../Reusable/Headers";
// import { FaEye, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { QuizModal } from "@/components/Reusable/modalFeilds/QuizFeilds"; // Create Quiz modal
// import { QuizEditModal } from "@/components/Reusable/modalFeilds/QuizEditModal"; // Edit Quiz modal
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// interface Video {
//   title: string;
//   url: string;
//   // time?: string;
// }

// interface Course {
//   name: string;
// }

// interface Quiz {
//   _id: string;
//   title: string;
//   status: string;
//   course?: Course;
//   users?: any[];
//   createdAt: string;
//   video?: Video;
// }

// interface QuizCardsProps {
//   title: string;
//   subject: string;
//   attempts: number;
//   onView: () => void;
//   onEdit: () => void;
//   onDelete?: () => void;
// }

// interface QuizDetailsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   quiz?: Quiz | null;
// }

// // --- Quiz Card Component ---
// const QuizCards: React.FC<QuizCardsProps> = ({
//   title,
//   subject,
//   attempts,
//   onView,
//   onEdit,
//   onDelete,
// }) => (
//   <div className="p-5 bg-white shadow-md rounded-2xl hover:shadow-lg transition-all border border-gray-100">
//     <div className="mb-4">
//       <p className="text-lg font-semibold text-gray-800">{title}</p>
//       <p className="text-sm text-gray-500">{subject}</p>
//     </div>

//     <div className="mb-5 space-y-3">
//       <div className="flex justify-between">
//         <span className="text-sm text-gray-500">Attempts</span>
//         <span className="font-semibold">{attempts}</span>
//       </div>
//     </div>

//     <div className="flex gap-3">
//       <button
//         onClick={onView}
//         className="flex-1 flex items-center justify-center gap-2 border py-2 rounded-3xl hover:bg-gray-100 transition-colors"
//       >
//         <FaEye /> View
//       </button>

//       <button
//         onClick={onEdit}
//         className="p-3 border rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
//         title="Edit Quiz"
//       >
//         <FaEdit />
//       </button>

//       {onDelete && (
//         <button
//           onClick={onDelete}
//           className="p-3 border rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
//           title="Delete Quiz"
//         >
//           <FaTrash />
//         </button>
//       )}
//     </div>
//   </div>
// );

// // --- Quiz Details Modal ---
// const QuizDetailsModal: React.FC<QuizDetailsModalProps> = ({
//   isOpen,
//   onClose,
//   quiz,
// }) => {
//   if (!quiz) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-xl rounded-2xl p-6 space-y-5">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-semibold text-gray-800">
//             {quiz.title}
//           </DialogTitle>
//         </DialogHeader>

//         {/* Quiz Info */}
//         <div className="space-y-2 text-sm text-gray-700">
//           <div className="flex justify-between">
//             <span className="text-gray-500">Status</span>
//             <span className="font-medium capitalize">{quiz.status}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-gray-500">Course</span>
//             <span className="font-medium">{quiz.course?.name || "N/A"}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-gray-500">Attempts</span>
//             <span className="font-medium">{quiz.users?.length || 0}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-gray-500">Created At</span>
//             <span className="font-medium">
//               {new Date(quiz.createdAt).toLocaleString()}
//             </span>
//           </div>
//         </div>

//         {/* Video Section */}
//         {quiz.video && (
//           <div className="border rounded-xl p-4 space-y-2">
//             <p className="font-semibold text-gray-800">Related Video</p>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p>
//                 <span className="text-gray-500">Title:</span> {quiz.video.title}
//               </p>
//               {/* <p>
//                 <span className="text-gray-500">Time:</span> {quiz.video.time}
//               </p> */}
//             </div>

//             <a
//               href={quiz.video.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block text-sm text-blue-600 hover:underline"
//             >
//               ▶ Watch Video
//             </a>
//           </div>
//         )}

//         <DialogFooter>
//           <Button
//             className="w-full py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
//             onClick={onClose}
//           >
//             Close
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // --- Main Component ---
// export default function Quizzes() {
//   const [viewOpen, setViewOpen] = useState(false);
//   const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

//   const [createQuizModalOpen, setCreateQuizModalOpen] = useState(false);
//   const [editQuizModalOpen, setEditQuizModalOpen] = useState(false);
//   const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);

//   const { data: sessionData } = useSession();
//   const token = sessionData?.user?.accessToken;
//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

//   const { data: quizzesData, isLoading } = useQuery({
//     queryKey: ["quizzes", token],
//     queryFn: async () => {
//       const res = await fetch(`${API_BASE}/quizzes`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) throw new Error("Failed to load quizzes");
//       return res.json();
//     },
//     enabled: !!token,
//   });

//   const quizzes: Quiz[] = quizzesData?.data || [];

//   const handleView = (quiz: Quiz) => {
//     setSelectedQuiz(quiz);
//     setViewOpen(true);
//   };

//   const handleEdit = (quiz: Quiz) => {
//     setQuizToEdit(quiz);
//     setEditQuizModalOpen(true);
//   };

//   const handleDelete = (quizId: string) => {
//     if (confirm("Are you sure you want to delete this quiz?")) {
//       console.log("Delete quiz:", quizId);
//       // TODO: Implement delete mutation
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <Headers
//           title="Quizzes"
//           subHeader="Manage all quizzes available for your students"
//         />

//         <button
//           onClick={() => setCreateQuizModalOpen(true)}
//           className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-semibold transition-colors"
//         >
//           <FaPlus /> Create New Quiz
//         </button>
//       </div>

//       {/* Quiz Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {isLoading && (
//           <p className="col-span-full text-center text-gray-600 py-10">
//             Loading quizzes...
//           </p>
//         )}

//         {!isLoading && quizzes.length === 0 && (
//           <p className="col-span-full text-center text-gray-500 py-10">
//             No quizzes found
//           </p>
//         )}

//         {!isLoading &&
//           quizzes.map((quiz) => (
//             <QuizCards
//               key={quiz._id}
//               title={quiz.title}
//               subject={`Course : ${quiz?.course?.name || "—"}`}
//               attempts={quiz.users?.length || 0}
//               onView={() => handleView(quiz)}
//               onEdit={() => handleEdit(quiz)}
//               onDelete={() => handleDelete(quiz._id)}
//             />
//           ))}
//       </div>

//       {/* Modals */}
//       <QuizDetailsModal
//         isOpen={viewOpen}
//         onClose={() => setViewOpen(false)}
//         quiz={selectedQuiz}
//       />

//       <QuizModal
//         open={createQuizModalOpen}
//         onOpenChange={setCreateQuizModalOpen}
//       />

//       {quizToEdit && (
//         <QuizEditModal
//           open={editQuizModalOpen}
//           onOpenChange={setEditQuizModalOpen}
//           quiz={quizToEdit}
//         />
//       )}
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import Headers from "../../Reusable/Headers";
import { FaEye, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { QuizModal } from "@/components/Reusable/modalFeilds/QuizFeilds";
import { QuizEditModal } from "@/components/Reusable/modalFeilds/QuizEditModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Video {
  title: string;
  url: string;
}

interface Course {
  name: string;
}

interface Quiz {
  _id: string;
  title: string;
  status: string;
  course?: Course;
  users?: any[];
  createdAt: string;
  video?: Video;
}

interface QuizCardsProps {
  title: string;
  subject: string;
  attempts: number;
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

// --- Quiz Card Component ---
const QuizCards: React.FC<QuizCardsProps> = ({
  title,
  subject,
  attempts,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="p-5 bg-white shadow-md rounded-2xl hover:shadow-lg transition-all border border-gray-100">
    <div className="mb-4">
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{subject}</p>
    </div>

    <div className="mb-5 space-y-3">
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">Attempts</span>
        <span className="font-semibold">{attempts}</span>
      </div>
    </div>

    <div className="flex gap-3">
      <button
        onClick={onView}
        className="flex-1 flex items-center justify-center gap-2 border py-2 rounded-3xl hover:bg-gray-100 transition-colors"
      >
        <FaEye /> View
      </button>

      <button
        onClick={onEdit}
        className="p-3 border rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
        title="Edit Quiz"
      >
        <FaEdit />
      </button>

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-3 border rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Delete Quiz"
        >
          <FaTrash />
        </button>
      )}
    </div>
  </div>
);

// --- Quiz Details Modal ---
interface QuizDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz?: Quiz | null;
}

const QuizDetailsModal: React.FC<QuizDetailsModalProps> = ({
  isOpen,
  onClose,
  quiz,
}) => {
  if (!quiz) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl rounded-2xl p-6 space-y-5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {quiz.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-medium capitalize">{quiz.status}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Course</span>
            <span className="font-medium">{quiz.course?.name || "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Attempts</span>
            <span className="font-medium">{quiz.users?.length || 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Created At</span>
            <span className="font-medium">
              {new Date(quiz.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {quiz.video && (
          <div className="border rounded-xl p-4 space-y-2">
            <p className="font-semibold text-gray-800">Related Video</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="text-gray-500">Title:</span> {quiz.video.title}
              </p>
            </div>

            <a
              href={quiz.video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              ▶ Watch Video
            </a>
          </div>
        )}

        <DialogFooter>
          <Button
            className="gap-2 w-full text-black bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-semibold transition-colors"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component ---
export default function Quizzes() {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const [createQuizModalOpen, setCreateQuizModalOpen] = useState(false);
  const [editQuizModalOpen, setEditQuizModalOpen] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const { data: sessionData } = useSession();
  const token = sessionData?.user?.accessToken;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const queryClient = useQueryClient();

  // Fetch quizzes
  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ["quizzes", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load quizzes");
      return res.json();
    },
    enabled: !!token,
  });

  const quizzes: Quiz[] = quizzesData?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete quiz");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", token] });
      setDeleteConfirmOpen(false);
      setQuizToDelete(null);
    },
  });

  const handleView = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setViewOpen(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setQuizToEdit(quiz);
    setEditQuizModalOpen(true);
  };

  const handleDelete = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (quizToDelete) deleteMutation.mutate(quizToDelete._id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Headers
          title="Quizzes"
          subHeader="Manage all quizzes available for your students"
        />

        <button
          onClick={() => setCreateQuizModalOpen(true)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <FaPlus /> Create New Quiz
        </button>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <p className="col-span-full text-center text-gray-600 py-10">
            Loading quizzes...
          </p>
        )}

        {!isLoading && quizzes.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-10">
            No quizzes found
          </p>
        )}

        {!isLoading &&
          quizzes.map((quiz) => (
            <QuizCards
              key={quiz._id}
              title={quiz.title}
              subject={`Course : ${quiz?.course?.name || "—"}`}
              attempts={quiz.users?.length || 0}
              onView={() => handleView(quiz)}
              onEdit={() => handleEdit(quiz)}
              onDelete={() => handleDelete(quiz)}
            />
          ))}
      </div>

      {/* Modals */}
      <QuizDetailsModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        quiz={selectedQuiz}
      />

      <QuizModal
        open={createQuizModalOpen}
        onOpenChange={setCreateQuizModalOpen}
      />

      {quizToEdit && (
        <QuizEditModal
          open={editQuizModalOpen}
          onOpenChange={setEditQuizModalOpen}
          quiz={quizToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmOpen}
        onOpenChange={(open) => !open && setDeleteConfirmOpen(false)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this quiz?
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            This action cannot be undone.
          </p>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="flex-1"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

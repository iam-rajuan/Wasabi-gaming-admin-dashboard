"use client";
import { useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import Headers from "../../Reusable/Headers";
import ReusableModal from '../../Reusable/ReusableModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import CourseEditFields from '@/components/Reusable/modalFeilds/CourseEditFields';
import LoderComponent from '@/components/loader/LoderComponent';

// Category → Color mapping
const getCategoryColor = (category: string = '') => {
  const colors: Record<string, string> = {
    Mathematics: 'amber',
    Science: 'blue',
    English: 'green',
    'Social Studies': 'red',
    History: 'purple',
    Technology: 'indigo',
  };
  return colors[category] || 'gray';
};

const courseFields = [
  { name: "courseName", label: "Course Name", type: "text", placeholder: "Enter course name" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Brief description of the course..." },
  {
    name: "grade",
    label: "Grade Level",
    type: "select",
    options: [
      { label: "Grade 6", value: "6" },
      { label: "Grade 7", value: "7" },
      { label: "Grade 8", value: "8" },
      { label: "Grade 9", value: "9" },
      { label: "Grade 10", value: "10" },
      { label: "Grade 11", value: "11" },
      { label: "Grade 12", value: "12" },
    ]
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Mathematics", value: "Mathematics" },
      { label: "Science", value: "Science" },
      { label: "English", value: "English" },
      { label: "Social Studies", value: "Social Studies" },
      { label: "History", value: "History" },
      { label: "Technology", value: "Technology" },
    ]
  },
  { name: "coursePrice", label: "Course Price (৳)", type: "number", placeholder: "Enter price" },
  {
    name: "videos",
    label: "Upload Course Videos",
    type: "file",
    multiple: true,
    accept: "video/mp4,video/quicktime,video/x-msvideo"
  },
  {
    name: "videoTitle",
    label: "Video Titles (comma separated)",
    type: "text",
    placeholder: "Intro, Lesson 1, Lesson 2, ..."
  }
];

interface Course {
  _id: string;
  name: string;
  description?: string;
  gradeLevel: string;
  category: string;
  thumbnail: string;
  coursePrice: number;
  enrolledStudents: string[];
  courseVideo: Array<{ title: string; url: string; time: string }>;
  status: string;
  createdAt: string;
}

const CourseCard = ({ course }: { course: Course }) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const token = sessionData?.user?.accessToken;

  const color = getCategoryColor(course.category);

  const initialEditData = {
    courseName: course.name || "",
    description: course.description || "",
    grade: course.gradeLevel || "",
    category: course.category || "",
    coursePrice: course.coursePrice || 0,
    thumbnail: course?.thumbnail || "",
    videos: course.courseVideo.map((video: any) => ({ file: null, title: video.title, existingUrl: video.url, time: video.time, _id: video._id }))
  };

  const { mutate: deleteCourse } = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Unauthorized");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete course");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: () => {
      toast.error("Failed to delete course");
    },
  });

  const handleDeleteClick = () => {
    deleteCourse(course._id);
  };

  return (
    <div className='bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group'>
      <div className='flex justify-between items-start mb-6'>
        <div className='flex items-start gap-3'>
          <div className={`p-2 rounded-lg bg-${color}-50 mt-1`}>
            <FaUsers className={`text-sm text-${color}-600`} />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>{course?.name}</h3>
            <p className='text-gray-500 text-sm'>Grade {course?.gradeLevel}</p>
          </div>
        </div>
        <span className={`bg-${color}-50 text-${color}-700 px-3 py-1 rounded-full text-xs font-semibold`}>
          {course?.category}
        </span>
      </div>

      <div className='mb-6 flex items-center gap-2 text-gray-600'>
        <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
          <FaUsers className="text-gray-500 text-sm" />
        </div>
        <span className='font-medium text-gray-700'>{course?.enrolledStudents?.length || 0}</span>
        <span className='text-gray-500 text-sm'>students enrolled</span>
      </div>

      <div className='flex justify-between items-center gap-3'>
        <button
          onClick={() => setOpen(true)}
          className='flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm group-hover:shadow-sm'
        >
          <FaEdit className="text-xs" />
          Edit Course
        </button>
        <button onClick={handleDeleteClick} className='flex items-center justify-center w-[20%] border border-gray-200 rounded-xl py-2.5 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 text-gray-500 group-hover:shadow-sm'>
          <FaTrash className="text-xs" />
        </button>
      </div>

      {open && (
        <CourseEditFields
          open={open}
          setOpen={setOpen}
          initialData={initialEditData}
          courseId={course._id}
        />
      )}
    </div>
  );
};

export default function Courses() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data: sessionData } = useSession();
  const token = sessionData?.user?.accessToken;
  const queryClient = useQueryClient();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["courses", token],
    queryFn: async () => {
      if (!token) throw new Error("Authentication required");
      const res = await fetch(`${API_BASE}/course`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load courses");
      return res.json();
    },
    enabled: !!token,
  });

  const createCourseMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error("Authentication token missing");

      const response = await fetch(`${API_BASE}/course`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create course");
      }
      return response.json();
    },

    onSuccess: () => {
      toast.success("Course created successfully!");
      setCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },

    onError: (err: any) => {
      toast.error(err.message || "Something went wrong");
      console.error(err);
    },
  });

  const handleCreateCourse = (modalData: any) => {
    console.log(modalData)
    const formData = new FormData();
    const coursePayload = {
      name: modalData.courseName?.trim() || "",
      description: modalData.description?.trim() || "",
      gradeLevel: modalData.grade || "",
      category: modalData.category || "",
      coursePrice: Number(modalData.coursePrice) || 0,
    };

    formData.append("data", JSON.stringify(coursePayload));

    if (modalData.videos && Array.isArray(modalData.videos)) {
      modalData.videos.forEach((video: any, index: number) => {
        if (video?.file instanceof File) {
          formData.append("courseVideo", video.file);
        }
      });

      if (modalData?.thumbnail) {
        formData.append("thumbnail", modalData.thumbnail);
      }
      // Ensure titles array matches the videos array
      const titles: string[] = modalData.videos.map((video: any, index: number) => {
        // If the user provided a title, use it. Otherwise fallback to file name
        return video.title?.trim() || video.file?.name || `Video ${index + 1}`;
      });

      formData.append("titles", JSON.stringify(titles));
    }

    createCourseMutation.mutate(formData);
  };

  if (isLoading) return <LoderComponent />;

  const courses = apiResponse?.data || [];

  return (
    <div className='p-0'>
      <div className='flex justify-between items-center mb-8'>
        <Headers
          title="Courses"
          subHeader="Manage all courses and learning materials"
        />
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[#FFFF00] hover:bg-yellow-500 py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-gray-900 disabled:opacity-60"
          disabled={createCourseMutation.isPending}
        >
          <FaPlus className="text-sm" />
          {createCourseMutation.isPending ? 'Creating...' : 'Create New Course'}
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-16 text-gray-500 text-lg">
          Loading your courses...
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-red-600">
          Failed to load courses<br />
          <small className="text-gray-500">{(error as Error)?.message || 'Unknown error'}</small>
        </div>
      )}

      {!isLoading && !isError && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-600 text-lg">
              You don&apos;t have any courses yet.<br />
            </div>
          ) : (
            courses.map((course: Course) => (
              <CourseCard key={course._id} course={course} />
            ))
          )}
        </div>
      )}

      <ReusableModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateCourse}
        title="Create New Course"
        location="course"
        fields={courseFields}
        submitText="Create Course"
        loading={createCourseMutation.isPending}
      />
    </div>
  );
}

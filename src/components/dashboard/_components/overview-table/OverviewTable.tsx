// 'use client';

// import React from 'react';
// import { useDashboardStudents } from '@/hooks/useDashboard';
// import { DataTable } from '@/components/common/table/DataTable';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Badge } from '@/components/ui/badge';
// import { Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// export default function OverviewTable() {
//     const { data: students, isLoading } = useDashboardStudents();

//     const columns = [
//         { header: "Student", accessor: "student" },
//         { header: "Email", accessor: "email" },
//         { header: "Grade", accessor: "grade" },
//         { header: "Courses", accessor: "courses" },
//         {
//             header: "Status",
//             accessor: "status",
//             render: (value: string) => (
//                 <Badge
//                     variant={value === "Active" ? "success" : "secondary"}
//                     className={`rounded-full font-medium ${value !== "Active" ? "bg-gray-200 text-gray-600 hover:bg-gray-300" : ""}`}
//                 >
//                     {value}
//                 </Badge>
//             )
//         },
//         {
//             header: "Actions",
//             accessor: "actions",
//             render: () => (
//                 <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8">
//                     <Trash2 className="h-4 w-4" />
//                 </Button>
//             )
//         },
//     ];

//     const filterOptions = ["All", "9th", "10th", "11th", "12th"];

//     if (isLoading) {
//         return <Skeleton className="w-full h-[400px] mt-8 rounded-2xl" />;
//     }

//     return (
//         <div className='bg-white mt-8 p-5 border-2 border-[#0000001A] rounded-2xl'>
//             <div className='pb-4'>
//                 <h2 className="text-lg popmed text-gray-800">Recent Students</h2>
//                 <p className="text-lg text-gray-500">Manage and view all students enrolled in your platform</p>
//             </div>
//             <DataTable
//                 columns={columns}
//                 data={students || []}
//                 filterOptions={filterOptions}
//                 filterKey="grade"
//             />
//         </div>
//     );
// }


'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAllStudent, useStudentDelete } from '@/hooks/apiCalling';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

export default function OverviewTable() {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);

    const { data: sessionData } = useSession();
    const token = (sessionData?.user as { accessToken: string })?.accessToken;

    // Only show 5 recent students
    const { data, isLoading, isError, refetch } = useGetAllStudent(1, 5, '', '', token);
    const deleteMutation = useStudentDelete(token);

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

    if (isLoading) {
        return <Skeleton className="w-full h-[300px] mt-8 rounded-2xl" />;
    }

    if (isError) {
        return <div className="text-red-600 py-10 text-center">❌ Failed to load students</div>;
    }

    const students = data?.data || [];

    return (
        <div className="bg-white mt-8 p-5 border-2 border-[#0000001A] rounded-2xl">
            <div className="pb-4">
                <h2 className="text-lg popmed text-gray-800">Recent Students</h2>
                <p className="text-gray-500">View the most recent students enrolled on your platform.</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-600 border-b-2 border-gray-200">
                            <th className="py-3 px-4 font-semibold">Name</th>
                            <th className="py-3 px-4 font-semibold">Email</th>
                            <th className="py-3 px-4 font-semibold">Grade</th>
                            <th className="py-3 px-4 font-semibold">Courses</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{student.firstName} {student.lastName}</td>
                                <td className="py-3 px-4">{student.email}</td>
                                <td className="py-3 px-4">{student.grade || '-'}</td>
                                <td className="py-3 px-4">{student.course?.length || 0}</td>
                                <td className="py-3 px-4">
                                    <Badge
                                        variant={student.status === 'active' ? 'success' : 'secondary'}
                                        className={`rounded-full font-medium ${student.status !== 'active' ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : ''}`}
                                    >
                                        {student.status}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() =>
                                            handleDeleteClick(student._id, `${student.firstName} ${student.lastName}`)
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

            {/* Delete Confirmation */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Student</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{studentToDelete?.name}</strong>? This action cannot be undone.
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
}

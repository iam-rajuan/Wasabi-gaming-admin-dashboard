import { addStudent, deleteStudent, getAllStudents } from "@/lib/students"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";



export function useGetAllStudent(page?: number, limit?: number, year?: string, search?: string, token?: string) {

    return useQuery<StudentApiResponse>({
        queryKey: ["stduent", page, limit, year, search, token],
        queryFn: () => {
            return getAllStudents({ page, limit, year, search, token })
        },
    })
}

export function useStudentDelete(token: string, onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteStudent(token, id),
        onSuccess: (success) => {
            toast.success(success.message || "Student Delete successful");
            queryClient.invalidateQueries({ queryKey: ["stduent"] });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error: unknown) => {
            if (error instanceof Error) toast.error(error.message || "delete failed");
            else toast.error("delete failed");
        },
    });
}


export function useAddStudent(token: string, onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { fullName: string, email: string, grade: string, status: string }) => addStudent(token, payload),
        onSuccess: () => {
            toast.success("Student Add successfylly");
            queryClient.invalidateQueries({ queryKey: ["stduent"] });
            
            if (onSuccessCallback) onSuccessCallback();
            
        },
        onError: (error: unknown) => {
            if (error instanceof Error) toast.error(error.message || "add failed");
            else toast.error("add failed");
        },
    });
}
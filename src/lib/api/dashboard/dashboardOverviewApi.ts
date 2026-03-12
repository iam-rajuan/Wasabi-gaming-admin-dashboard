export interface Student {
    student: string;
    email: string;
    grade: string;
    courses: number;
    status: "Active" | "Inactive";
}

export const fetchDashboardStudents = async (): Promise<Student[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
        {
            student: "Sarah Johnson",
            email: "sarah.j@email.com",
            grade: "10th",
            courses: 5,
            status: "Active",
        },
        {
            student: "Michael Chen",
            email: "michael.c@email.com",
            grade: "11th",
            courses: 6,
            status: "Active",
        },
        {
            student: "Emma Williams",
            email: "emma.w@email.com",
            grade: "9th",
            courses: 4,
            status: "Inactive",
        },
        {
            student: "James Davis",
            email: "james.d@email.com",
            grade: "12th",
            courses: 7,
            status: "Active",
        },
        {
            student: "Olivia Martinez",
            email: "olivia.m@email.com",
            grade: "10th",
            courses: 5,
            status: "Active",
        },
    ];
};

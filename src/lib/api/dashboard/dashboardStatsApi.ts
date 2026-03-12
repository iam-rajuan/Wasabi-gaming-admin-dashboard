export interface DashboardStat {
    name: string;
    iconType: 'school' | 'book' | 'tasks' | 'chart';
    number: string;
    details: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStat[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return [
        {
            name: "Total Students",
            iconType: "school",
            number: "1,234",
            details: "1,200 active • 34 new",
        },
        {
            name: "Active Courses",
            iconType: "book",
            number: "24",
            details: "18 ongoing • 6 upcoming",
        },
        {
            name: "Pending Tasks",
            iconType: "tasks",
            number: "12",
            details: "8 assignments • 4 reviews",
        },
        {
            name: "Quiz Results",
            iconType: "chart",
            number: "87%",
            details: "5% increase from last month",
        },
    ];
};

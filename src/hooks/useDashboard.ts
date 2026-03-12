import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/lib/api/dashboard/dashboardStatsApi';
import { fetchDashboardStudents } from '@/lib/api/dashboard/dashboardOverviewApi';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
    });
};

export const useDashboardStudents = () => {
    return useQuery({
        queryKey: ['dashboardStudents'],
        queryFn: fetchDashboardStudents,
    });
};

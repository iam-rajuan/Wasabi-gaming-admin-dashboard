'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { School, BookOpen, ClipboardList, BarChart3 } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const iconMap = {
    totalStudent: <School className="w-6 h-6" />,
    activeCourse: <BookOpen className="w-6 h-6" />,
    pendingTask: <ClipboardList className="w-6 h-6" />,
    quizeResult: <BarChart3 className="w-6 h-6" />,
    totalSchool: <School className="w-6 h-6" />,
};

export default function StatsCards() {
    const { data: sessionData } = useSession();
    const token = sessionData?.user?.accessToken;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats', token],
        queryFn: async () => {
            if (!token) throw new Error('Authentication required');
            const res = await fetch(`${API_BASE}/dashboard/admin-overview`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to load stats');
            return res.json();
        },
        enabled: !!token,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                ))}
            </div>
        );
    }

    // Transform API data into an array for mapping
    const cards = stats?.data
        ? [
            {
                name: 'Total Students',
                number: stats.data.totalStudent,
                details: 'All students enrolled',
                iconType: 'totalStudent',
            },
            {
                name: 'Total Schools',
                number: stats.data.totalSchool,
                details: 'Schools registered',
                iconType: 'totalSchool',
            },
            {
                name: 'Active Courses',
                number: stats.data.activeCourse,
                details: 'Courses currently active',
                iconType: 'activeCourse',
            },
            {
                name: 'Pending Tasks',
                number: stats.data.pendingTask,
                details: 'Tasks to complete',
                iconType: 'pendingTask',
            },
        ]
        : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((item, index) => (
                <Card
                    key={index}
                    className={cn(
                        'bg-white p-6 py-5 h-[200px] flex flex-col justify-between rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300'
                    )}
                >
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[#737373] text-sm font-medium popreg">{item.name}</p>
                        <div className="text-blue-500 text-lg">{iconMap[item.iconType]}</div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800 popmed mb-1">{item.number}</p>
                        <p className="text-[12px] text-gray-500 popreg">{item.details}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}

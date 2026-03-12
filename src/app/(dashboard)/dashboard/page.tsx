'use client';

import OverviewTable from "@/components/dashboard/_components/overview-table/OverviewTable";
import StatsCards from "@/components/dashboard/_components/stats-cards/StatsCards";
import Headers from "@/components/Reusable/Headers";


export default function Page() {
  return (
    <div className='min-h-screen'>
      <Headers title={"Dashboard"} subHeader={"Welcome back! Here's what's happening with your school."} />
      <StatsCards />
      <OverviewTable />
    </div>
  );
}

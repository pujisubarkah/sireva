
import LayoutShell from "@/components/LayoutShell";
import PageHeader from "@/components/PageHeader";
import ExecutiveInfoCards from "@/components/ExecutiveInfoCards";
import SummaryCardsRow from "@/components/SummaryCardsRow";
import UnitProgressTable from "@/components/UnitProgressTable";
import PerformanceTrendCard from "@/components/PerformanceTrendCard";
import RecentActivityCard from "@/components/RecentActivityCard";

export default function DashboardPage() {
  return (
    <LayoutShell>
      <PageHeader 
        title="Dashboard Unit Kerja" 
        description="Ringkasan integrasi perencanaan dan capaian kinerja LAN RI Tahun 2026." 
      />
      <div>
          {/* Info Cards Row */}
          <ExecutiveInfoCards role="user" />
          {/* Summary Cards Row */}
          <SummaryCardsRow role="user" />
          {/* Chart + Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <PerformanceTrendCard role="user" />
            </div>
            <div>
              <RecentActivityCard role="user" />
            </div>
          </div>
          <UnitProgressTable role="user" />
      </div>
    </LayoutShell>
  );
}

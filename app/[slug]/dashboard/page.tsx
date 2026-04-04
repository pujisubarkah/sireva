
import UserLayout from "../components/UserLayout";
import ExecutiveInfoCards from "../../../src/components/ExecutiveInfoCards";
import SummaryCardsRow from "../../../src/components/SummaryCardsRow";
import UnitProgressTable from "../../../src/components/UnitProgressTable";
import PerformanceTrendCard from "../../../src/components/PerformanceTrendCard";
import RecentActivityCard from "../../../src/components/RecentActivityCard";

export default function UserDashboardPage() {
  return (
    <UserLayout>
      <div className="min-h-screen bg-[#f6f8fa] px-8 py-10">
        {/* Header */}
        <div className="max-w-screen-xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Dashboard Unit Kerja</h1>
          <p className="text-gray-500 text-base mt-2">Ringkasan integrasi perencanaan dan capaian kinerja LAN RI Tahun 2026.</p>
        </div>
        <div className="max-w-screen-xl mx-auto">
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
          {/* Table Section */}
          <UnitProgressTable role="user" />
        </div>
      </div>
    </UserLayout>
  );
}

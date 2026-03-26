"use client";
import React from "react";
import AdminLayoutShell from "../../../src/components/admin/AdminLayoutShell";
import ExecutiveInfoCards from "../../../src/components/ExecutiveInfoCards";
import SummaryCardsRow from "../../../src/components/SummaryCardsRow";
import UnitProgressTable from "../../../src/components/UnitProgressTable";
import PerformanceTrendCard from "../../../src/components/PerformanceTrendCard";
import RecentActivityCard from "../../../src/components/RecentActivityCard";


export default function AdminDashboardPage() {
  return (
    <AdminLayoutShell>
      <div className="min-h-screen bg-[#f6f8fa] px-8 py-10">
        {/* Header */}
        <div className="max-w-screen-xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Dashboard Eksekutif</h1>
          <p className="text-gray-500 text-base mt-2">Ringkasan integrasi perencanaan dan capaian kinerja LAN RI Tahun 2026.</p>
        </div>
        <div className="max-w-screen-xl mx-auto">
          {/* Info Cards Row */}
          <ExecutiveInfoCards role="admin" />
          {/* Summary Cards Row */}
          <SummaryCardsRow role="admin" />
          {/* Chart + Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <PerformanceTrendCard role="admin" />
            </div>
            <div>
              <RecentActivityCard role="admin" />
            </div>
          </div>
          {/* Table Section */}
          <UnitProgressTable role="admin" />
        </div>
      </div>
    </AdminLayoutShell>
  );
}

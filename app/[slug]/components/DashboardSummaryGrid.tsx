import StatCard from "./StatCard";
import React from "react";

export default function DashboardSummaryGrid() {
  return (
    <div className="grid grid-cols-4 gap-6 mb-10">
      <StatCard
        title="SASARAN STRATEGIS"
        value="4"
        badgeText="SS"
        variant="default"
      />
      <StatCard
        title="SASARAN PROGRAM"
        value="12"
        badgeText="SP"
        variant="default"
      />
      <StatCard
        title="SASARAN KEGIATAN"
        value="45"
        badgeText="SK"
        variant="default"
      />
      <StatCard
        title="CAPAIAN PEMANTAUAN KINERJA"
        value="78.5%"
        badgeText="%"
        variant="blue"
      />
    </div>
  );
}

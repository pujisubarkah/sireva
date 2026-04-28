<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header Utama -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Pemantauan Perjanjian Kinerja</h1>
        <p class="text-sm text-slate-500 mt-1">Pemantauan realisasi capaian indikator Perjanjian Kinerja tahun berjalan.</p>
      </div>

      <!-- Toolbar -->
      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Realisasi Perjanjian Kinerja</h2>
        <div class="flex items-center gap-3">
          <FilterDropdown
            v-model="selectedUnitKerja"
            :options="unitKerjaOptions"
            :icon="IconBuilding"
          />
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
          />
        </div>
      </div>

      <!-- Konten Tabel -->
      <div class="overflow-x-auto">
        <div style="min-width: 1200px;" class="p-5">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <!-- Capaian Badge -->
            <template #cell-capaian="{ row }">
              <div class="flex items-center">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center justify-center min-w-[3.5rem]',
                    parseFloat(row.capaian) >= 100 ? 'bg-emerald-100 text-emerald-700' : 
                    parseFloat(row.capaian) >= 80 ? 'bg-blue-100 text-blue-700' :
                    parseFloat(row.capaian) >= 50 ? 'bg-amber-100 text-amber-700' :
                    row.capaian !== '-' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                  ]"
                >
                  {{ row.capaian !== '-' ? row.capaian + '%' : '-' }}
                </span>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { IconCalendarEvent, IconBuilding } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';

const router = useRouter();

const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum'];
const selectedUnitKerja = ref('Semua Unit Kerja');
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja];

const columns = computed(() => [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaran', label: 'Sasaran' },
  { key: 'indikator', label: 'Indikator' },
  { key: 'unitKerja', label: 'Unit Kerja' },
  { key: 'target', label: `Target (${selectedYear.value})`, className: 'text-center w-32' },
  { key: 'realisasi', label: 'Realisasi', className: 'text-center w-32 font-semibold' },
  { key: 'capaian', label: '% Capaian', className: 'text-center w-28' },
]);

// Dummy Data State (for simulation)
const dummyRealisasi = ref<Record<string, string>>({
  '1-2026': '75.5',
});

const baseData = [
  { id: 1, sasaran: 'Terwujudnya ASN yang Profesional dan Kompeten', indikator: 'Indeks Kepuasan Peserta Pelatihan', target: 85.0, unitKerja: 'Pusbangkom ASN' },
  { id: 2, sasaran: 'Meningkatnya Kualitas Kurikulum Kediklatan ASN', indikator: 'Jumlah Modul Pelatihan Kepemimpinan Tersusun', target: 4, unitKerja: 'Puslatbang KDOD' },
  { id: 3, sasaran: 'Terintegrasinya Sistem Pembelajaran Digital LAN', indikator: 'Jumlah Fitur Platform Pembelajaran Aktif', target: 3, unitKerja: 'Pusdatin LAN' },
];

const tableRows = computed(() => {
  let filteredData = baseData.map((item, index) => {
    const targetVal = item.target;
    const realisasiStr = dummyRealisasi.value[`${item.id}-${selectedYear.value}`];
    const realisasiVal = realisasiStr ? parseFloat(realisasiStr) : 0;
    
    let capaian = 0;
    if (targetVal > 0 && realisasiStr) {
      capaian = (realisasiVal / targetVal) * 100;
    }

    return {
      id: item.id,
      sasaran: item.sasaran,
      indikator: item.indikator,
      unitKerja: item.unitKerja,
      target: targetVal,
      realisasi: realisasiStr || '-',
      capaian: realisasiStr ? capaian.toFixed(1) : '-',
    };
  });

  if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    filteredData = filteredData.filter(d => d.unitKerja === selectedUnitKerja.value);
  }

  // Recalculate 'no'
  return filteredData.map((d, index) => ({ ...d, no: index + 1 }));
});
</script>

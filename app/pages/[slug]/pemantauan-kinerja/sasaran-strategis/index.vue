<template>
  <div class="space-y-4">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
        <div class="text-slate-500 text-sm font-medium mb-1">Total Indikator</div>
        <div class="text-2xl font-bold text-slate-800">{{ summary.total }}</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
        <div class="text-slate-500 text-sm font-medium mb-1">Rata-rata Capaian</div>
        <div class="text-2xl font-bold text-blue-600">{{ summary.averageCapaian }}%</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
        <div class="text-slate-500 text-sm font-medium mb-1">Tercapai (≥100%)</div>
        <div class="text-2xl font-bold text-emerald-600">{{ summary.tercapai }}</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
        <div class="text-slate-500 text-sm font-medium mb-1">Perlu Perhatian (<80%)</div>
        <div class="text-2xl font-bold text-red-600">{{ summary.perluPerhatian }}</div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h1 class="text-lg font-semibold text-slate-800">Pemantauan Kinerja - Sasaran Strategis</h1>
        <p class="text-sm text-slate-500 mt-1">Pantau target dan realisasi dari indikator sasaran strategis.</p>
      </div>

      <!-- Toolbar -->
      <div class="px-5 py-3 border-b border-slate-200 bg-white flex flex-col xl:flex-row items-center justify-between gap-4">
        <h2 class="text-sm font-semibold text-slate-700 whitespace-nowrap">Realisasi Sasaran Strategis</h2>
        <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div class="relative flex-1 sm:flex-none sm:min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch class="w-4 h-4 text-slate-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari indikator..."
              class="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            />
          </div>
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
          <button class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <IconDownload class="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Konten Tabel -->
      <div v-if="loading" class="p-6 text-sm text-slate-500 text-center">
        <div class="inline-block animate-pulse">Memuat data...</div>
      </div>
      <div v-else-if="!tableRows.length" class="p-6 text-sm text-slate-500 text-center italic">Data belum tersedia.</div>
      
      <div v-else class="overflow-x-auto">
        <div style="min-width: 1200px;" class="p-5">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <!-- Kolom Aksi -->
            <template #cell-aksi="{ row }">
              <button class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat Detail">
                <IconEye class="w-5 h-5" />
              </button>
            </template>
            
            <!-- Capaian Badge & Progress -->
            <template #cell-capaian="{ row }">
              <div class="flex flex-col gap-1.5 w-full min-w-[120px]">
                <div class="flex items-center justify-between text-xs">
                  <span 
                    :class="[
                      'px-2 py-0.5 rounded font-bold',
                      row.capaian === '-' || isNaN(parseFloat(row.capaian)) ? 'bg-slate-100 text-slate-500' :
                      parseFloat(row.capaian) >= 100 ? 'bg-emerald-100 text-emerald-700' : 
                      parseFloat(row.capaian) >= 80 ? 'bg-blue-100 text-blue-700' :
                      parseFloat(row.capaian) >= 50 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ row.capaian !== '-' && !isNaN(parseFloat(row.capaian)) ? row.capaian + '%' : '-' }}
                  </span>
                  <span v-if="row.capaian !== '-' && !isNaN(parseFloat(row.capaian))" class="text-slate-500 font-medium text-[10px] uppercase tracking-wider">
                    {{ parseFloat(row.capaian) >= 100 ? 'Sgt Baik' : parseFloat(row.capaian) >= 80 ? 'Baik' : parseFloat(row.capaian) >= 50 ? 'Cukup' : 'Kurang' }}
                  </span>
                </div>
                <div v-if="row.capaian !== '-' && !isNaN(parseFloat(row.capaian))" class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    class="h-1.5 rounded-full transition-all duration-500"
                    :class="[
                      parseFloat(row.capaian) >= 100 ? 'bg-emerald-500' : 
                      parseFloat(row.capaian) >= 80 ? 'bg-blue-500' :
                      parseFloat(row.capaian) >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    ]"
                    :style="{ width: `${Math.min(parseFloat(row.capaian), 100)}%` }"
                  ></div>
                </div>
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
import useSWRV from 'swrv';
import { IconBuilding, IconCalendarEvent, IconSearch, IconDownload, IconEye } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum'];
const selectedUnitKerja = ref('Semua Unit Kerja');
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja];

const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const searchQuery = ref('');

const router = useRouter();
const fetcher = (url: string) => fetch(url).then(r => r.json());

const { data: sasaranRes, isValidating: sasLoading } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: indikatorRes, isValidating: indikLoading } = useSWRV('/api/indikator-kinerja', fetcher);
const { data: targetRes, isValidating: targetLoading } = useSWRV('/api/target-indikator', fetcher);
const { data: tahunRes, isValidating: tahunLoading } = useSWRV('/api/tahun', fetcher);
const { data: realisasiRes, isValidating: realisasiLoading, mutate: mutateRealisasi } = useSWRV('/api/realisasi-indikator', fetcher);

const loading = computed(() => sasLoading.value || indikLoading.value || targetLoading.value || tahunLoading.value || realisasiLoading.value);

const columns = computed(() => [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaranStrategis', label: 'Sasaran Strategis' },
  { key: 'indikatorKinerja', label: 'Indikator Kinerja' },
  { key: 'unitKerja', label: 'Unit Kerja' },
  { key: 'target', label: `Target (${selectedYear.value})`, className: 'text-center' },
  { key: 'realisasi', label: `Realisasi (${selectedYear.value})`, className: 'text-center' },
  { key: 'capaian', label: 'Capaian', className: 'w-40' },
  { key: 'aksi', label: '', className: 'w-14 text-center' }
]);

const tableRows = computed(() => {
  if (loading.value || !sasaranRes.value || !indikatorRes.value || !targetRes.value || !tahunRes.value || !realisasiRes.value) return [];

  const currYearNum = parseInt(selectedYear.value);

  // Cari ID tahun untuk tahun berjalan
  const currentTahunObj = tahunRes.value.find((t: any) => t.tahun === currYearNum);
  const currentTahunId = currentTahunObj ? currentTahunObj.id : null;

  const sasaranMap = sasaranRes.value.reduce((acc: any, s: any) => {
    acc[s.id] = s.sasaranText;
    return acc;
  }, {});

  const targetMap = targetRes.value.reduce((acc: any, t: any) => {
    if (t.tahunId === currentTahunId) {
      acc[t.indikatorId] = t.target;
    }
    return acc;
  }, {});

  const realisasiMap = realisasiRes.value.reduce((acc: any, r: any) => {
    if (r.tahun === currYearNum && r.indikatorKode) {
      acc[r.indikatorKode] = parseFloat(r.realisasi) || 0;
    }
    return acc;
  }, {});

  let filteredData = indikatorRes.value.map((indikator: any, index: number) => {
    const target = parseFloat(targetMap[indikator.id]) || 0;
    const realisasi = realisasiMap[indikator.kode] || 0;
    
    let capaian = 0;
    if (target > 0) {
      capaian = (realisasi / target) * 100;
    }

    // Mock unit kerja
    const unitKerja = dummyUnitKerja[indikator.id % dummyUnitKerja.length];

    return {
      id: indikator.id,
      indikatorKode: indikator.kode,
      sasaranStrategis: sasaranMap[indikator.sasaranId] || '-',
      indikatorKinerja: indikator.namaIndikator,
      unitKerja,
      target: targetMap[indikator.id] || '-',
      targetVal: target,
      realisasi: realisasi || '-',
      capaian: capaian.toFixed(1),
    };
  });

  if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    filteredData = filteredData.filter((d: any) => d.unitKerja === selectedUnitKerja.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filteredData = filteredData.filter((d: any) => 
      d.indikatorKinerja.toLowerCase().includes(q) || 
      d.sasaranStrategis.toLowerCase().includes(q)
    );
  }

  // Recalculate 'no' after filtering
  return filteredData.map((d: any, index: number) => ({ ...d, no: index + 1 }));
});

const summary = computed(() => {
  const rows = tableRows.value;
  const total = rows.length;
  
  let validCapaianCount = 0;
  let totalCapaian = 0;
  let tercapai = 0;
  let perluPerhatian = 0;

  rows.forEach((r: any) => {
    if (r.capaian !== '-' && !isNaN(parseFloat(r.capaian))) {
      const val = parseFloat(r.capaian);
      validCapaianCount++;
      totalCapaian += val;
      if (val >= 100) tercapai++;
      if (val < 80) perluPerhatian++;
    }
  });

  const averageCapaian = validCapaianCount > 0 ? (totalCapaian / validCapaianCount).toFixed(1) : '0';

  return {
    total,
    averageCapaian,
    tercapai,
    perluPerhatian
  };
});
</script>

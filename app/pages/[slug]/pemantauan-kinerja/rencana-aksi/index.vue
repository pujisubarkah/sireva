<template>
  <div class="space-y-4">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
        <div class="text-slate-500 text-sm font-medium mb-1">Total Rencana Aksi</div>
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

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <!-- Header Utama -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Pemantauan Rencana Aksi</h1>
        <p class="text-sm text-slate-500 mt-1">Pemantauan realisasi capaian Rencana Aksi.</p>
      </div>

      <!-- Toolbar -->
      <div class="px-5 py-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-blue-600"></div>
          Realisasi Rencana Aksi
        </h2>
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative min-w-[240px]">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <IconSearch class="w-4 h-4 text-slate-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari rencana aksi..."
              class="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 bg-slate-50/50 transition-all font-medium"
            />
          </div>
          <div class="h-8 w-px bg-slate-200 mx-1"></div>
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
          <button class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <IconDownload class="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center text-slate-500">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p>Memuat data rencana aksi...</p>
      </div>

      <!-- Konten Tabel -->
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
                      row.capaian === '-' ? 'bg-slate-100 text-slate-500' :
                      parseFloat(row.capaian) >= 100 ? 'bg-emerald-100 text-emerald-700' : 
                      parseFloat(row.capaian) >= 80 ? 'bg-blue-100 text-blue-700' :
                      parseFloat(row.capaian) >= 50 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ row.capaian !== '-' ? row.capaian + '%' : '-' }}
                  </span>
                  <span v-if="row.capaian !== '-'" class="text-slate-500 font-medium text-[10px] uppercase tracking-wider">
                    {{ parseFloat(row.capaian) >= 100 ? 'Sgt Baik' : parseFloat(row.capaian) >= 80 ? 'Baik' : parseFloat(row.capaian) >= 50 ? 'Cukup' : 'Kurang' }}
                  </span>
                </div>
                <div v-if="row.capaian !== '-'" class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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

            <!-- Anggaran Cell -->
            <template #cell-anggaran="{ row }">
              <span class="text-xs font-black text-emerald-600">
                Rp {{ Number(row.anggaran || 0).toLocaleString('id-ID') }}
              </span>
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
import { IconCalendarEvent, IconBuilding, IconSearch, IconDownload, IconEye } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import useSWRV from 'swrv';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher);
const selectedUnitKerja = ref('Semua Unit Kerja');
const unitKerjaOptions = computed(() => {
  const units = unitData.value?.map((u: any) => u.nama) || [];
  return ['Semua Unit Kerja', ...units];
});

const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const searchQuery = ref('');

const router = useRouter();

const rencanaUrl = computed(() => `/api/rencana-aksi?tahun=${selectedYear.value}&unitKerja=${selectedUnitKerja.value}`);
const { data: rencanaData, isValidating: loading } = useSWRV(rencanaUrl, fetcher);

const columns = computed(() => [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaran', label: 'Sasaran' },
  { key: 'indikator', label: 'Indikator' },
  { key: 'unitKerja', label: 'Unit Kerja' },
  { key: 'rencanaAksi', label: 'Rencana Aksi' },
  { key: 'target', label: `Target (${selectedYear.value})`, className: 'text-center w-28' },
  { key: 'anggaran', label: 'Anggaran', className: 'text-center w-32' },
  { key: 'realisasi', label: 'Realisasi', className: 'text-center w-28 font-semibold' },
  { key: 'capaian', label: '% Capaian', className: 'w-40' },
  { key: 'aksi', label: '', className: 'w-14 text-center' }
]);

// Dummy Data State (for simulation)
const dummyRealisasi = ref<Record<string, string>>({
  '1': '5',
  '2': '80'
});

const tableRows = computed(() => {
  if (!rencanaData.value) return [];
  
  let filteredData = rencanaData.value.map((item: any, index: number) => {
    const targetVal = parseFloat(item.target) || 0;
    const realisasiStr = dummyRealisasi.value[item.id];
    const realisasiVal = realisasiStr ? parseFloat(realisasiStr) : 0;
    
    let capaian = 0;
    if (targetVal > 0 && realisasiStr) {
      capaian = (realisasiVal / targetVal) * 100;
    }

    return {
      ...item,
      target: targetVal,
      realisasi: realisasiStr || '-',
      capaian: realisasiStr ? capaian.toFixed(1) : '-',
    };
  });

  if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    filteredData = filteredData.filter((d: any) => d.unitKerja === selectedUnitKerja.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filteredData = filteredData.filter((d: any) => 
      d.rencanaAksi.toLowerCase().includes(q) || 
      d.indikator.toLowerCase().includes(q) ||
      d.sasaran.toLowerCase().includes(q)
    );
  }

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
    if (r.capaian !== '-' && r.capaian !== 'NaN') {
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

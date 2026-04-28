<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h1 class="text-lg font-semibold text-slate-800">Pemantauan Kinerja - Sasaran Strategis</h1>
        <p class="text-sm text-slate-500 mt-1">Pantau target dan realisasi dari indikator sasaran strategis.</p>
      </div>

      <!-- Toolbar -->
      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Realisasi Sasaran Strategis</h2>
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
      <div v-if="loading" class="p-6 text-sm text-slate-500 text-center">
        <div class="inline-block animate-pulse">Memuat data...</div>
      </div>
      <div v-else-if="!tableRows.length" class="p-6 text-sm text-slate-500 text-center italic">Data belum tersedia.</div>
      
      <div v-else class="overflow-x-auto">
        <div style="min-width: 1000px;" class="p-5">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <template #cell-capaian="{ row }">
              <span :class="{'text-emerald-600 font-bold': parseFloat(row.capaian) >= 100, 'text-amber-600 font-bold': parseFloat(row.capaian) >= 50 && parseFloat(row.capaian) < 100, 'text-red-600 font-bold': parseFloat(row.capaian) < 50}">
                {{ row.capaian }}%
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
import useSWRV from 'swrv';
import { IconBuilding, IconCalendarEvent } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum'];
const selectedUnitKerja = ref('Semua Unit Kerja');
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja];

const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

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
  { key: 'capaian', label: 'Capaian', className: 'text-center w-24' },
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

  // Recalculate 'no' after filtering
  return filteredData.map((d: any, index: number) => ({ ...d, no: index + 1 }));
});

</script>

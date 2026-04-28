<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header Utama -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Pemantauan Rencana Aksi</h1>
        <p class="text-sm text-slate-500 mt-1">Pemantauan realisasi capaian Rencana Aksi.</p>
      </div>

      <!-- Toolbar -->
      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Realisasi Rencana Aksi</h2>
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
import Table from '@/components/UI/Table.vue';
import useSWRV from 'swrv';

const router = useRouter();

const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: rencanaData, isValidating: loading } = useSWRV('/api/rencana-aksi', fetcher);

const columns = [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaran', label: 'Sasaran' },
  { key: 'indikator', label: 'Indikator' },
  { key: 'rencanaAksi', label: 'Rencana Aksi' },
  { key: 'target', label: 'Target', className: 'text-center w-28' },
  { key: 'realisasi', label: 'Realisasi', className: 'text-center w-28 font-semibold' },
  { key: 'capaian', label: '% Capaian', className: 'text-center w-28' },
];

// Dummy Data State (for simulation)
const dummyRealisasi = ref<Record<string, string>>({});

const tableRows = computed(() => {
  if (!rencanaData.value) return [];
  
  return rencanaData.value.map((item: any, index: number) => {
    const targetVal = parseFloat(item.target) || 0;
    const realisasiStr = dummyRealisasi.value[item.id];
    const realisasiVal = realisasiStr ? parseFloat(realisasiStr) : 0;
    
    let capaian = 0;
    if (targetVal > 0 && realisasiStr) {
      capaian = (realisasiVal / targetVal) * 100;
    }

    return {
      id: item.id,
      no: index + 1,
      sasaran: item.sasaran,
      indikator: item.indikator,
      rencanaAksi: item.rencanaAksi,
      target: targetVal,
      realisasi: realisasiStr || '-',
      capaian: realisasiStr ? capaian.toFixed(1) : '-',
    };
  });
});
</script>

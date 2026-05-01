<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-10">
    <!-- Header Utama -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Sasaran Strategis</h1>
          <p class="text-sm text-slate-500 mt-1">Ringkasan indikator dan capaian target per tahun.</p>
        </div>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
          class="w-full sm:w-auto px-5 py-2.5 bg-[#2663A3] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition-all"
        >
          <IconPlus :size="18" :stroke="'2'" />
          Tambah Sasaran Strategis
        </button>
      </div>

      <!-- Toolbar / Filter Bar -->
      <div class="px-6 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center gap-4">
        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch class="w-4 h-4 text-slate-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari sasaran atau indikator..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
          />
        </div>
        
        <div class="flex-1 flex flex-col sm:flex-row items-center justify-end gap-3 w-full md:w-auto">
          <div class="w-full sm:w-64">
            <FilterDropdown
              v-model="selectedUnitKerja"
              :options="unitKerjaOptions"
              :icon="IconBuilding"
            />
          </div>
          <div class="w-full sm:w-40">
            <FilterDropdown
              v-model="selectedYear"
              :options="yearOptions"
              :icon="IconCalendarEvent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty / Loading States -->
    <div v-if="loading" class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div class="inline-block animate-pulse text-slate-500 font-medium">Memuat data sasaran strategis...</div>
    </div>
    
    <div v-else-if="!groupedData || groupedData.length === 0" class="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm py-16 px-4">
      <div class="flex flex-col items-center text-center">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" class="mb-4">
          <circle cx="48" cy="48" r="48" fill="#2663A3" fill-opacity="0.08"/>
          <g>
            <polygon points="48,22 54,40 73,40 57,52 63,70 48,59 33,70 39,52 23,40 42,40" fill="#2663A3"/>
            <polygon points="48,28 52,40 64,40 54,48 58,60 48,53 38,60 42,48 32,40 44,40" fill="#FBB23B"/>
          </g>
        </svg>
        <h2 class="text-2xl font-bold mb-2 text-slate-800">Data Tidak Ditemukan</h2>
        <p class="text-slate-500 max-w-md">Belum ada sasaran strategis yang terdaftar atau pencarian tidak cocok dengan data apapun.</p>
        <button
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
          class="mt-6 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
        >
          <IconPlus :size="18" />
          Buat Data Baru
        </button>
      </div>
    </div>

    <!-- Table List Layout -->
    <div v-else class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-[25%]">Sasaran Strategis</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Indikator Kinerja</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-1/4">Unit Kerja</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-32 text-center">Target {{ selectedYear }}</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-36 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="(group, gIndex) in groupedData" :key="group.sasaranId">
              <tr v-for="(ind, i) in group.indikators" :key="ind.id" class="group hover:bg-slate-50/80 transition-colors">
                <td class="p-4 text-center">
                  <span class="text-sm font-bold text-slate-400">{{ i === 0 ? gIndex + 1 : '' }}</span>
                </td>
                <td class="p-4">
                  <div v-if="i === 0" class="space-y-1">
                    <p class="text-sm font-bold text-slate-800 leading-tight">{{ group.sasaranText }}</p>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{{ ind.kode || 'Tanpa Kode' }}</span>
                    <span class="text-sm font-semibold text-slate-700 leading-snug">{{ ind.indikatorKinerja }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                    <IconBuilding :size="12" class="text-slate-400"/>
                    {{ ind.unitKerja }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <span class="px-3 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 inline-flex min-w-[3.5rem] justify-center shadow-sm">
                    {{ ind.targetRenstra[selectedYear] || '-' }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-strategis/view?id=${ind.id}`)" 
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <IconEye :size="18" />
                    </button>
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${ind.id}`)" 
                      class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <IconPencil :size="18" />
                    </button>
                    <button 
                      @click="handleDelete(ind)" 
                      class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <IconTrash :size="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Halaman Index Sasaran Strategis
 * Menampilkan daftar sasaran strategis dengan layout Grouped Cards
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconEye, IconPencil, IconPlus, IconTrash, IconCalendarEvent, IconBuilding, IconSearch } from '@tabler/icons-vue';
import FilterDropdown from '@/components/FilterDropdown.vue';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const selectedUnitKerja = ref('Semua Unit Kerja');
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher);
const unitKerjaOptions = computed(() => {
  const units = unitData.value?.map((u: any) => u.nama) || [];
  return ['Semua Unit Kerja', ...units];
});

const router = useRouter();
const route = useRoute();

// Pencarian
const searchQuery = ref('');

// Konfigurasi tahun
const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];


// Mengambil data dari berbagai API
const { data: sasaranRes, isValidating: sasLoading } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: indikatorRes, isValidating: indikLoading, mutate: mutateIndikator } = useSWRV('/api/indikator-kinerja', fetcher);
const { data: targetRes, isValidating: targetLoading } = useSWRV('/api/target-indikator', fetcher);
const { data: tahunRes, isValidating: tahunLoading } = useSWRV('/api/tahun', fetcher);

// Status loading gabungan
const loading = computed(() => sasLoading.value || indikLoading.value || targetLoading.value || tahunLoading.value);

/**
 * Memetakan hasil API ke dalam struktur Grouped Data
 */
const groupedData = computed(() => {
  if (loading.value) return [];
  if (!sasaranRes.value || !indikatorRes.value || !targetRes.value || !tahunRes.value) return [];

  type Sasaran = { id: number; sasaranText: string };
  type Indikator = { id: number; sasaranId: number; namaIndikator: string; unitKerja: string; kode: string };
  type Target = { indikatorId: number; tahunId: number | null; target: string | number | null };
  type Tahun = { id: number; tahun: number };

  // Map sasaran berdasarkan ID
  const sasaranMap: Record<number, Sasaran> = (sasaranRes.value as Sasaran[]).reduce((acc: Record<number, Sasaran>, s: Sasaran) => {
    acc[s.id] = s;
    return acc;
  }, {});

  // Map tahun berdasarkan ID
  const tahunMap: Record<number, number> = (tahunRes.value as Tahun[]).reduce((acc: Record<number, number>, item: Tahun) => {
    acc[item.id] = item.tahun;
    return acc;
  }, {});

  // Map target berdasarkan kombinasi Indikator ID dan Tahun
  const targetMap: Record<string, string> = {};
  (targetRes.value as Target[]).forEach((target) => {
    const tahun = target.tahunId ? tahunMap[target.tahunId] : undefined;
    if (tahun) {
      targetMap[`${target.indikatorId}-${tahun}`] = target.target ? String(target.target) : '-';
    }
  });

  // Gabungkan indikator dengan data lainnya
  let allIndikators = (indikatorRes.value as Indikator[]).map((indikator) => {
    const sasaran = sasaranMap[indikator.sasaranId];
    if (!sasaran) return null;

    // Ambil target untuk tahun yang dipilih
    const targetObj: Record<string, string> = {};
    targetObj[selectedYear.value] = targetMap[`${indikator.id}-${selectedYear.value}`] || '-';

    return {
      id: indikator.id,
      sasaranId: sasaran.id,
      sasaranText: sasaran.sasaranText,
      indikatorKinerja: indikator.namaIndikator,
      unitKerja: indikator.unitKerja || '-',
      kode: indikator.kode,
      targetRenstra: targetObj
    };
  }).filter(Boolean) as any[];

  // 1. Filter by Unit Kerja
  if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    allIndikators = allIndikators.filter(ind => ind.unitKerja === selectedUnitKerja.value);
  }

  // 2. Filter by Search Query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    allIndikators = allIndikators.filter(ind => {
      return ind.indikatorKinerja.toLowerCase().includes(q) || ind.sasaranText.toLowerCase().includes(q);
    });
  }

  // 3. Group by Sasaran Strategis
  const groupsObj: Record<number, { sasaranId: number, sasaranText: string, indikators: any[] }> = {};
  
  allIndikators.forEach(ind => {
    let group = groupsObj[ind.sasaranId];
    if (!group) {
      group = {
        sasaranId: ind.sasaranId,
        sasaranText: ind.sasaranText,
        indikators: []
      };
      groupsObj[ind.sasaranId] = group;
    }
    group.indikators.push(ind);
  });

  // Convert object to array and sort by sasaranId
  return Object.values(groupsObj).sort((a, b) => a.sasaranId - b.sasaranId);
});

async function handleDelete(ind: any) {
  if (!confirm(`Apakah Anda yakin ingin menghapus indikator "${ind.indikatorKinerja}"? Data yang dihapus tidak dapat dikembalikan.`)) return;
  
  try {
    const result = await $fetch<any[]>('/api/indikator-kinerja', {
      method: 'DELETE',
      body: { id: ind.id }
    });

    if (result) {
      mutateIndikator();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menghapus data.');
  }
}
</script>

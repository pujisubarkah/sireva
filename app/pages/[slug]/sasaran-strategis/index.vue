<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-10">
    <!-- Header Utama -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
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

    <!-- Grouped Cards Layout -->
    <div v-else class="space-y-6">
      <div v-for="(group, gIndex) in groupedData" :key="group.sasaranId" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
        
        <!-- Card Header (Sasaran Strategis) -->
        <div class="bg-gradient-to-r from-slate-50 to-white px-6 py-5 border-b border-slate-200 flex items-start gap-4">
          <div class="mt-0.5 bg-blue-100 text-[#2663A3] w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm border border-blue-200">
            {{ gIndex + 1 }}
          </div>
          <div class="flex-1">
            <h3 class="text-xs font-black text-[#2663A3] uppercase tracking-widest mb-1">Sasaran Strategis</h3>
            <p class="text-lg font-bold text-slate-800 leading-snug">{{ group.sasaranText }}</p>
          </div>
        </div>

        <!-- Tabel Indikator -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th class="p-4 pl-6 w-16 text-center">No</th>
                <th class="p-4 min-w-[250px]">Indikator Kinerja</th>
                <th class="p-4 min-w-[200px]">Unit Kerja</th>
                <th class="p-4 w-32 text-center">Target {{ selectedYear }}</th>
                <th class="p-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-sm text-slate-700 bg-slate-50/30">
              <tr v-for="(ind, i) in group.indikators" :key="ind.id" class="hover:bg-slate-50 transition-colors">
                <td class="p-4 pl-6 text-center font-medium text-slate-400">{{ i + 1 }}</td>
                <td class="p-4 font-semibold text-slate-800">{{ ind.indikatorKinerja }}</td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-600 border border-slate-200 shadow-sm whitespace-nowrap">
                    <IconBuilding :size="14" class="text-slate-400"/>
                    {{ ind.unitKerja }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <span class="px-3 py-1 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex min-w-[4rem] justify-center items-center shadow-sm">
                    {{ ind.targetRenstra[selectedYear] || '-' }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-strategis/view?id=${ind.id}`)" 
                      class="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition-colors" 
                      title="Lihat Detail"
                    >
                      <IconEye :size="18" stroke="2" />
                    </button>
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${ind.id}`)" 
                      class="text-emerald-500 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-100 transition-colors" 
                      title="Edit Indikator"
                    >
                      <IconPencil :size="18" stroke="2" />
                    </button>
                    <button 
                      @click="handleDelete(ind)" 
                      class="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors" 
                      title="Hapus"
                    >
                      <IconTrash :size="18" stroke="2" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum'];
const selectedUnitKerja = ref('Semua Unit Kerja');
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja];

const router = useRouter();
const route = useRoute();

// Pencarian
const searchQuery = ref('');

// Konfigurasi tahun
const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const fetcher = (url: string) => fetch(url).then(r => r.json());

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
  type Indikator = { id: number; sasaranId: number; namaIndikator: string };
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

    const unitKerja = dummyUnitKerja[indikator.id % dummyUnitKerja.length];
    
    // Ambil target untuk tahun yang dipilih
    const targetObj: Record<string, string> = {};
    targetObj[selectedYear.value] = targetMap[`${indikator.id}-${selectedYear.value}`] || '-';

    return {
      id: indikator.id,
      sasaranId: sasaran.id,
      sasaranText: sasaran.sasaranText,
      indikatorKinerja: indikator.namaIndikator,
      unitKerja,
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

<template>
  <div class="space-y-6 pb-10">
    <!-- Header Section -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-1">
            Perencanaan Taktis
          </div>
          <h1 class="text-xl font-bold text-slate-800 tracking-tight">Sasaran Program (SP)</h1>
          <p class="text-slate-500 mt-1 text-sm font-medium">Penjabaran strategis ke tingkat program kerja pada Level JPT Pratama.</p>
        </div>
        <div class="flex items-center gap-3">
           <button
            @click="router.push(`/${$route.params.slug}/sasaran-program/add`)"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all"
          >
            <IconPlus :size="18" :stroke-width="3" />
            Tambah Program
          </button>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="px-6 py-4 bg-white flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="relative flex-1">
          <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari nama program..."
            class="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2663A3] transition-all"
          />
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <FilterDropdown
            v-model="selectedUnitKerja"
            :options="unitKerjaOptions"
            :icon="IconBuilding"
            class="min-w-[200px]"
          />
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
          />
        </div>
      </div>
    </div>

    <!-- Table List Layout -->
    <div v-if="Object.keys(groupedData).length > 0" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-[20%]">Program</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Sasaran Program</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-1/5">Unit Kerja</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-28 text-center">Target</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="(programs, progName, gIndex) in groupedData" :key="progName">
              <tr v-for="(prog, i) in programs" :key="prog.id" class="group hover:bg-slate-50/80 transition-colors">
                <td class="p-4 text-center">
                  <span class="text-sm font-bold text-slate-400">{{ i === 0 ? Number(gIndex) + 1 : '' }}</span>
                </td>
                <td class="p-4">
                  <p v-if="i === 0" class="text-sm font-bold text-slate-800 leading-tight">{{ progName }}</p>
                </td>
                <td class="p-4">
                  <p class="text-sm font-semibold text-slate-700 leading-snug">{{ prog.sasaranProgram }}</p>
                </td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                    <IconBuilding :size="12" class="text-slate-400"/>
                    {{ prog.unitKerja }}
                  </span>
                </td>
                <td class="p-4 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-100 min-w-[3rem]">
                      {{ prog.targetRenstra[Number(selectedYear)] || '0' }}
                    </span>
                    <span class="text-[9px] text-slate-400 font-bold uppercase">{{ prog.satuan }}</span>
                  </div>
                </td>
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-program/view?id=${prog.id}`)" 
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <IconEye :size="18" />
                    </button>
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-program/edit?id=${prog.id}`)" 
                      class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <IconPencil :size="18" />
                    </button>
                    <button 
                      @click="handleDelete(prog)" 
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

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <IconSearch :size="40" class="text-slate-300" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">Tidak ada sasaran program ditemukan</h3>
      <p class="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Coba sesuaikan kata kunci pencarian atau filter Unit Kerja Anda.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Sasaran Program (SP)
 * Migrasi ke Grouped Card Layout (By Sasaran Strategis).
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useSWRV from 'swrv'
import { 
  IconPlus, IconSearch, IconBuilding, IconCalendarEvent, 
  IconEye, IconPencil, IconLayout, IconTrash
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const router = useRouter()
const route = useRoute()
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher)

// State Filters
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()))
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

const selectedUnitKerja = ref('Semua Unit Kerja')
const unitKerjaOptions = computed(() => {
  const units = unitData.value?.map((u: any) => u.nama) || []
  return ['Semua Unit Kerja', ...units]
})

type YearMap = Record<number, number>

interface ProgramRow {
  id: number
  sasaranProgram: string
  sasaranText: string
  programName: string
  satuan: string
  targetRenstra: YearMap
  targetPerjanjian: YearMap
  unitKerja: string
}

const baseData = ref<ProgramRow[]>([])

// Logic Pengelompokan Data (Group by Sasaran Strategis)
const groupedData = computed(() => {
  let filtered = baseData.value.filter(item => {
    const matchesSearch = item.sasaranText.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         (item.programName || '').toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesUnit = selectedUnitKerja.value === 'Semua Unit Kerja' || item.unitKerja === selectedUnitKerja.value;
    return matchesSearch && matchesUnit;
  });

  const groups: Record<string, ProgramRow[]> = {};
  filtered.forEach(item => {
    const key = item.programName || 'Tanpa Program';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  return groups;
});

onMounted(async () => {
  try {
    // Fetch real data from Sasaran Program API
    const [spRes, progRes] = await Promise.all([
      $fetch<any[]>('/api/sasaran-program'),
      $fetch<any[]>('/api/master-program')
    ]);

    const programMap = new Map(progRes.map((p: any) => [p.id, p.namaProgram]));

    baseData.value = spRes.map((p: any) => ({
      id: p.id,
      sasaranProgram: p.sasaranText,
      sasaranText: p.sasaranText, // For filtering
      programName: programMap.get(p.programId) || 'Program Umum',
      satuan: 'Layanan',
      targetRenstra: { 2025: 0, 2026: 0, 2027: 0, 2028: 0, 2029: 0 },
      targetPerjanjian: { 2025: 0, 2026: 0, 2027: 0, 2028: 0, 2029: 0 },
      unitKerja: p.unitKerja || '-',
    }));
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

async function handleDelete(item: any) {
  if (!confirm(`Apakah Anda yakin ingin menghapus "${item.sasaranProgram}"? Data yang dihapus tidak dapat dikembalikan.`)) return;
  
  try {
    const result = await $fetch<any[]>('/api/sasaran-program', {
      method: 'DELETE',
      body: { id: item.id }
    });

    if (result) {
      // Reload page or re-fetch
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menghapus data.');
  }
}
</script>

<style scoped>
/* Grid transisi halus */
.group:hover {
  transform: translateY(-4px);
}
</style>

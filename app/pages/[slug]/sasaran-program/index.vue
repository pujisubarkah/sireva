<template>
  <div class="space-y-6 pb-10">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-3">
            Perencanaan Taktis
          </div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Sasaran Program (SP)</h1>
          <p class="text-slate-500 mt-1 text-sm font-medium">Penjabaran strategis ke tingkat program kerja pada Level JPT Pratama.</p>
        </div>
        <div class="flex items-center gap-3">
           <button
            @click="router.push(`/${$route.params.slug}/sasaran-program/add`)"
            class="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] transition-all"
          >
            <IconPlus :size="18" :stroke-width="3" />
            Tambah Program
          </button>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="px-8 py-4 bg-white flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="relative flex-1">
          <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari nama program atau sasaran strategis..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2663A3] transition-all"
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

    <!-- Grouped Cards State -->
    <div v-if="Object.keys(groupedData).length > 0" class="space-y-8">
      <div v-for="(programs, sasaranText) in groupedData" :key="sasaranText" class="space-y-4">
        <!-- Sasaran Strategis Group Header -->
        <div class="flex items-center gap-3 px-2">
          <div class="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
          <h2 class="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{{ sasaranText }}</h2>
          <div class="h-px flex-1 bg-slate-100 ml-2"></div>
          <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{{ programs.length }} PROGRAM</span>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="prog in programs" 
            :key="prog.id"
            class="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <!-- Card Body -->
            <div class="p-6 flex-1 space-y-4">
              <div class="flex justify-between items-start gap-3">
                <p class="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                  {{ prog.sasaranProgram }}
                </p>
                <div class="p-2 rounded-lg bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                  <IconLayout :size="18" />
                </div>
              </div>

              <!-- Targets Preview -->
              <div class="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Target Renstra</p>
                  <p class="text-xs font-bold text-blue-700">{{ prog.targetRenstra[Number(selectedYear)] || '-' }} {{ prog.satuan }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Target PK</p>
                  <p class="text-xs font-bold text-emerald-700">{{ prog.targetPerjanjian[Number(selectedYear)] || '-' }} {{ prog.satuan }}</p>
                </div>
              </div>

              <!-- Metadata -->
              <div class="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-2">
                <IconBuilding :size="14" class="text-slate-400" />
                <span>{{ prog.unitKerja }}</span>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between group-hover:bg-indigo-50/50 transition-colors">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">ID: SP-{{ prog.id.toString().padStart(3, '0') }}</span>
              <div class="flex items-center gap-2">
                <button
                  @click="router.push(`/${$route.params.slug}/sasaran-program/view?id=${prog.id}`)"
                  class="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                  title="Lihat Detail"
                >
                  <IconEye :size="16" />
                </button>
                <button
                  @click="router.push(`/${$route.params.slug}/sasaran-program/edit?id=${prog.id}`)"
                  class="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all"
                  title="Edit Program"
                >
                  <IconPencil :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
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
import { 
  IconPlus, IconSearch, IconBuilding, IconCalendarEvent, 
  IconEye, IconPencil, IconLayout 
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const router = useRouter()
const route = useRoute()

// State Filters
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()))
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum']
const selectedUnitKerja = ref('Semua Unit Kerja')
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja]

type YearMap = Record<number, number>

interface ProgramRow {
  id: number
  sasaranProgram: string
  satuan: string
  targetRenstra: YearMap
  targetPerjanjian: YearMap
  unitKerja: string
  sasaranStrategis: string
}

const baseData = ref<ProgramRow[]>([])

// Logic Pengelompokan Data (Group by Sasaran Strategis)
const groupedData = computed(() => {
  let filtered = baseData.value.filter(item => {
    const matchesSearch = item.sasaranProgram.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         item.sasaranStrategis.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesUnit = selectedUnitKerja.value === 'Semua Unit Kerja' || item.unitKerja === selectedUnitKerja.value;
    return matchesSearch && matchesUnit;
  });

  const groups: Record<string, ProgramRow[]> = {};
  filtered.forEach(item => {
    const key = item.sasaranStrategis || 'Tanpa Sasaran Strategis';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  return groups;
});

onMounted(async () => {
  try {
    // In a real app, fetch from real APIs
    const [progRes, sasRes] = await Promise.all([
      $fetch<any[]>('/api/master-program'),
      $fetch<any[]>('/api/sasaran-strategis')
    ]);

    const sasaranMap = new Map(sasRes.map((s: any) => [s.id, s.sasaranText]));

    // Mapping dummy/real data
    baseData.value = progRes.map((p: any) => ({
      id: p.id,
      sasaranProgram: p.namaProgram,
      satuan: 'Layanan',
      targetRenstra: { 2025: 800, 2026: 900, 2027: 1000, 2028: 1100, 2029: 1200 },
      targetPerjanjian: { 2025: 780, 2026: 880, 2027: 980, 2028: 1050, 2029: 1150 },
      unitKerja: dummyUnitKerja[p.id % dummyUnitKerja.length] || 'Pusbangkom ASN',
      sasaranStrategis: sasaranMap.get(p.sasaranId) || 'Sasaran Strategis Umum'
    }));
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<style scoped>
/* Grid transisi halus */
.group:hover {
  transform: translateY(-4px);
}
</style>

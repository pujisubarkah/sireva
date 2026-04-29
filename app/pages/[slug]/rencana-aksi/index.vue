<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Rencana Aksi
          <span class="px-3 py-1 rounded-full bg-blue-100 text-[#2663A3] text-xs font-black uppercase tracking-widest">
            {{ tableRows.length }} Data
          </span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Pengelolaan rincian rencana aksi dan target capaian operasional.</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FilterDropdown
            v-model="selectedUnitKerja"
            :options="unitKerjaOptions"
            :icon="IconBuilding"
            class="!border-0 shadow-none hover:bg-slate-50"
          />
          <div class="w-px h-6 bg-slate-200"></div>
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
            class="!border-0 shadow-none hover:bg-slate-50"
          />
        </div>
        <button
          @click="router.push(`/${$route.params.slug}/rencana-aksi/add`)"
          class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <IconPlus :size="20" :stroke-width="3" />
          Tambah Baru
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-2">
      <div class="relative group max-w-xl">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IconSearch :size="20" class="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari rencana aksi atau indikator..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-medium"
        />
      </div>
    </div>

    <!-- Grouped Content -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs">Menyinkronkan Data...</p>
    </div>

    <div v-else-if="groupedData.length > 0" class="space-y-12">
      <div v-for="group in groupedData" :key="group.sasaran" class="space-y-6">
        <!-- Group Header -->
        <div class="flex items-center gap-4 px-2">
          <div class="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-blue-600">
            <IconTarget :size="20" />
          </div>
          <div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-[0.15em] leading-none">Sasaran Strategis</h2>
            <p class="text-lg font-black text-slate-800 mt-1">{{ group.sasaran }}</p>
          </div>
          <div class="flex-grow h-px bg-gradient-to-r from-slate-200 to-transparent ml-4"></div>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="item in group.items" 
            :key="item.id"
            class="group bg-white rounded-3xl border border-slate-200 p-1 hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
          >
            <div class="p-6 space-y-6">
              <!-- Card Header -->
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                    <IconChartBar :size="18" />
                  </div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indikator Kinerja</span>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="router.push(`/${$route.params.slug}/rencana-aksi/view?id=${item.id}`)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                    <IconEye :size="18" />
                  </button>
                  <button @click="router.push(`/${$route.params.slug}/rencana-aksi/edit?id=${item.id}`)" class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
                    <IconPencil :size="18" />
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="space-y-2">
                <p class="text-xs font-bold text-slate-900 leading-relaxed min-h-[40px] line-clamp-2">
                  {{ item.indikator }}
                </p>
                <div class="h-px bg-slate-50 w-full"></div>
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rencana Aksi</span>
                  <p class="text-sm font-black text-[#2663A3] mt-1 line-clamp-3">
                    {{ item.rencanaAksi }}
                  </p>
                </div>
              </div>

              <!-- Footer Metrics -->
              <div class="pt-4 flex items-center justify-between border-t border-slate-50">
                <div class="flex items-center gap-2">
                  <IconBuilding :size="14" class="text-slate-300" />
                  <span class="text-[10px] font-bold text-slate-500">{{ item.unitKerja }}</span>
                </div>
                <div class="text-right">
                  <p class="text-[9px] font-black text-slate-400 uppercase">Target {{ selectedYear }}</p>
                  <p class="text-lg font-black text-slate-900 leading-none mt-1">{{ item.target }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
      <div class="p-6 bg-slate-50 rounded-full mb-6">
        <IconSearch :size="48" class="text-slate-300" />
      </div>
      <h3 class="text-xl font-black text-slate-900">Rencana Aksi Tidak Ditemukan</h3>
      <p class="text-slate-500 mt-2 max-w-sm text-center font-medium">Gunakan kata kunci lain atau periksa filter unit kerja dan tahun.</p>
      <button 
        @click="searchQuery = ''; selectedUnitKerja = 'Semua Unit Kerja'"
        class="mt-8 px-6 py-2 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
      >
        Reset Pencarian
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Rencana Aksi Modern (Standardized)
 */

definePageMeta({ layout: 'dashboard' })

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IconEye, IconPencil, IconPlus, IconBuilding, IconCalendarEvent, 
  IconTarget, IconChartBar, IconSearch 
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import useSWRV from 'swrv'

const router = useRouter()
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()))
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum']
const selectedUnitKerja = ref('Semua Unit Kerja')
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja]

// Fetchers
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: rencanaData, isValidating: loading } = useSWRV('/api/rencana-aksi', fetcher)

// Computeds
const tableRows = computed(() => {
  if (!rencanaData.value) return []
  
  let data = (rencanaData.value || []).map((row: any) => {
    return {
      ...row,
      unitKerja: dummyUnitKerja[row.id % dummyUnitKerja.length]
    }
  })

  // Filter Unit Kerja
  if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    data = data.filter((d: any) => d.unitKerja === selectedUnitKerja.value)
  }

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter((d: any) => 
      d.rencanaAksi.toLowerCase().includes(q) || 
      d.indikator.toLowerCase().includes(q) ||
      d.sasaran.toLowerCase().includes(q)
    )
  }

  return data
})

const groupedData = computed(() => {
  const groups: Record<string, any[]> = {}
  
  tableRows.value.forEach((item: any) => {
    const key = item.sasaran || 'Tanpa Sasaran'
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
  })

  return Object.keys(groups).map(sasaran => ({
    sasaran,
    items: groups[sasaran]
  }))
})
</script>

<style scoped>
/* Scoped custom animations and styles */
</style>

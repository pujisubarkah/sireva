<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Perjanjian Kinerja
          <span class="px-3 py-1 rounded-full bg-blue-100 text-[#2663A3] text-xs font-black uppercase tracking-widest">
            {{ tableRows.length }} Item
          </span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Dokumentasi komitmen kinerja tahunan antara atasan dan bawahan.</p>
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
          @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/add`)"
          class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <IconPlus :size="20" :stroke-width="3" />
          Tambah PK
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-2">
      <div class="relative group max-w-xl text-sm">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <IconSearch :size="20" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari sasaran atau indikator PK..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium"
        />
      </div>
    </div>

    <!-- Grouped Content -->
    <div v-if="groupedData.length > 0" class="space-y-12">
      <div v-for="group in groupedData" :key="group.sasaran" class="space-y-6">
        <!-- Group Header -->
        <div class="flex items-center gap-4 px-2">
          <div class="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-blue-600">
            <IconTarget :size="20" />
          </div>
          <div class="flex-grow">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-[0.15em] leading-none">Sasaran Strategis / Program</h2>
            <p class="text-lg font-black text-slate-800 mt-1">{{ group.sasaran }}</p>
          </div>
          <div class="hidden md:block w-32 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="item in group.items" 
            :key="item.id"
            class="group bg-white rounded-3xl border border-slate-200 p-1 hover:border-blue-600/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden relative"
          >
            <!-- Card Decor -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors duration-500"></div>

            <div class="p-6 space-y-6 relative z-10">
              <!-- Card Header -->
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-400">
                  <IconFileCheck :size="14" />
                  <span class="text-[9px] font-black uppercase tracking-widest">Komitmen PK</span>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/view?id=${item.id}`)" class="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-colors shadow-sm border border-transparent hover:border-slate-100">
                    <IconEye :size="18" />
                  </button>
                  <button @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/edit?id=${item.id}`)" class="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-colors shadow-sm border border-transparent hover:border-slate-100">
                    <IconPencil :size="18" />
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="space-y-4">
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Indikator Kinerja</span>
                  <p class="text-sm font-black text-slate-900 leading-tight group-hover:text-[#2663A3] transition-colors">
                    {{ item.indikator }}
                  </p>
                </div>
                
                <!-- Target Chip -->
                <div class="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-100/50">
                  <span class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Target PK</span>
                  <p class="text-xl font-black text-[#2663A3] tracking-tighter">{{ item.target }}</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="pt-4 flex items-center justify-between border-t border-slate-50">
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{{ item.unitKerja }}</span>
                </div>
                <IconBuilding :size="16" class="text-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 px-4 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
      <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <IconFileCheck :size="48" class="text-slate-200" />
      </div>
      <h3 class="text-2xl font-black text-slate-900">Belum Ada Perjanjian Kinerja</h3>
      <p class="text-slate-500 mt-2 max-w-sm text-center font-medium">Data PK untuk tahun {{ selectedYear }} belum tersedia atau tidak sesuai dengan filter pencarian Anda.</p>
      <button 
        @click="searchQuery = ''; selectedUnitKerja = 'Semua Unit Kerja'"
        class="mt-8 px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all"
      >
        Tampilkan Semua
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Perjanjian Kinerja Modern
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IconEye, IconPencil, IconPlus, IconBuilding, IconCalendarEvent, 
  IconTarget, IconFileCheck, IconSearch 
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum'];
const selectedUnitKerja = ref('Semua Unit Kerja');
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja];

const baseData = [
  {
    id: 1,
    sasaran: 'Terwujudnya ASN yang Profesional dan Kompeten',
    indikator: 'Indeks Kepuasan Peserta Pelatihan',
    target: '85.0',
    unitKerja: 'Pusbangkom ASN',
  },
  {
    id: 2,
    sasaran: 'Meningkatnya Kualitas Kurikulum Kediklatan ASN',
    indikator: 'Jumlah Modul Pelatihan Kepemimpinan Tersusun',
    target: '4 Modul',
    unitKerja: 'Puslatbang KDOD',
  },
  {
    id: 3,
    sasaran: 'Terintegrasinya Sistem Pembelajaran Digital LAN',
    indikator: 'Jumlah Fitur Platform Pembelajaran Aktif',
    target: '3 Fitur',
    unitKerja: 'Pusdatin LAN',
  },
]

const tableRows = computed(() => {
  let data = baseData.map(item => ({
    ...item,
    unitKerja: item.unitKerja
  }))

  if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    data = data.filter((d: any) => d.unitKerja === selectedUnitKerja.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter((d: any) => 
      d.sasaran.toLowerCase().includes(q) || 
      d.indikator.toLowerCase().includes(q)
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
/* Scoped styles */
</style>

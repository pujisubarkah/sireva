<template>
  <div class="space-y-6 pb-10">
    <!-- Header Section -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-3">
            Perencanaan Operasional
          </div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Sasaran Kegiatan (SK)</h1>
          <p class="text-slate-500 mt-1 text-sm font-medium">Daftar rinci kegiatan operasional pada Level Administrator/Pengawas.</p>
        </div>
        <div class="flex items-center gap-3">
           <button
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/add`)"
            class="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] transition-all"
          >
            <IconPlus :size="18" :stroke-width="3" />
            Tambah Kegiatan
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
            placeholder="Cari nama kegiatan atau program..."
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

    <!-- Alert Information -->
    <div class="px-2">
      <Alert 
        variant="neutral" 
        message="Sasaran kegiatan merupakan turunan teknis dari Sasaran Program yang difokuskan pada level operasional unit kerja." 
      />
    </div>

    <!-- Grouped Cards State -->
    <div v-if="Object.keys(groupedData).length > 0" class="space-y-8">
      <div v-for="(kegiatans, programName) in groupedData" :key="programName" class="space-y-4">
        <!-- Program Group Header -->
        <div class="flex items-center gap-3 px-2">
          <div class="h-8 w-1.5 bg-[#2663A3] rounded-full"></div>
          <h2 class="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{{ programName }}</h2>
          <div class="h-px flex-1 bg-slate-100 ml-2"></div>
          <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{{ kegiatans.length }} KEGIATAN</span>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div 
            v-for="kegiatan in kegiatans" 
            :key="kegiatan.id"
            class="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <!-- Card Body -->
            <div class="p-6 flex-1 space-y-4">
              <div class="flex justify-between items-start gap-3">
                <p class="text-sm font-bold text-slate-800 leading-snug group-hover:text-[#2663A3] transition-colors">
                  {{ kegiatan.kegiatan }}
                </p>
                <div class="p-2 rounded-lg bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                  <IconFileDescription :size="18" />
                </div>
              </div>

              <!-- Metadata -->
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <IconBuilding :size="14" class="text-slate-400" />
                  <span>{{ kegiatan.unitKerja }}</span>
                </div>
                <div class="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <IconCoin :size="14" class="text-emerald-500" />
                  <span class="font-bold text-slate-700">Anggaran: {{ kegiatan.anggaran }}</span>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">ID: SK-{{ kegiatan.id.toString().padStart(3, '0') }}</span>
              <div class="flex items-center gap-2">
                <button
                  @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/view?id=${kegiatan.id}`)"
                  class="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                  title="Lihat Detail"
                >
                  <IconEye :size="16" />
                </button>
                <button
                  @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${kegiatan.id}`)"
                  class="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all"
                  title="Edit Kegiatan"
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
      <h3 class="text-lg font-bold text-slate-800">Tidak ada kegiatan ditemukan</h3>
      <p class="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Coba sesuaikan kata kunci pencarian atau filter Unit Kerja Anda.</p>
      <button 
        @click="searchQuery = ''; selectedUnitKerja = 'Semua Unit Kerja'"
        class="mt-6 text-blue-600 font-bold text-sm hover:underline"
      >
        Reset Filter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Sasaran Kegiatan (SK)
 * Migrasi ke Grouped Card Layout untuk skalabilitas data tinggi.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPlus, IconSearch, IconBuilding, IconCalendarEvent, 
  IconEye, IconPencil, IconCoin, IconFileDescription 
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import Alert from '@/components/UI/alert.vue'

const router = useRouter()
const route = useRoute()

// State Filters
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()))
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

const dummyUnitKerja = ['Pusbangkom ASN', 'Puslatbang KDOD', 'Pusdatin LAN', 'Biro SDM dan Umum']
const selectedUnitKerja = ref('Semua Unit Kerja')
const unitKerjaOptions = ['Semua Unit Kerja', ...dummyUnitKerja]

interface KegiatanRow {
  id: number
  program: string
  kegiatan: string
  unitKerja: string
  anggaran: string
}

const baseData = ref<KegiatanRow[]>([])

// Logic Pengelompokan Data (Group by Program)
const groupedData = computed(() => {
  let filtered = baseData.value.filter(item => {
    const matchesSearch = item.kegiatan.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         item.program.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesUnit = selectedUnitKerja.value === 'Semua Unit Kerja' || item.unitKerja === selectedUnitKerja.value;
    return matchesSearch && matchesUnit;
  });

  const groups: Record<string, KegiatanRow[]> = {};
  filtered.forEach(item => {
    const key = item.program || 'Tanpa Program';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  return groups;
});

function formatCurrency(value: any): string {
  if (!value) return '-'
  const num = parseFloat(value)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

onMounted(async () => {
  try {
    const [kegiatanData, programData] = await Promise.all([
      $fetch<any[]>('/api/master-kegiatan'),
      $fetch<any[]>('/api/master-program'),
    ])

    const programMap = new Map(programData.map((p: any) => [p.id, p.namaProgram]))

    baseData.value = kegiatanData.map((item: any) => ({
      id: item.id,
      program: programMap.get(item.programId) || 'Program Tidak Terdefinisi',
      kegiatan: item.namaKegiatan,
      unitKerja: dummyUnitKerja[item.id % dummyUnitKerja.length] || 'Pusbangkom ASN',
      anggaran: formatCurrency(item.total),
    }))
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

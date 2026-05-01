<template>
  <div class="space-y-6 pb-10">
    <!-- Header Section -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-1">
            Perencanaan Operasional
          </div>
          <h1 class="text-xl font-bold text-slate-800 tracking-tight">Sasaran Kegiatan (SK)</h1>
          <p class="text-slate-500 mt-1 text-sm font-medium">Daftar rinci kegiatan operasional pada Level Administrator/Pengawas.</p>
        </div>
        <div class="flex items-center gap-3">
           <button
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/add`)"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all"
          >
            <IconPlus :size="18" :stroke-width="3" />
            Tambah Kegiatan
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
            placeholder="Cari nama kegiatan..."
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

    <!-- Alert Information -->
    <div class="px-2">
      <Alert 
        variant="neutral" 
        message="Sasaran kegiatan merupakan turunan teknis dari Sasaran Program yang difokuskan pada level operasional unit kerja." 
      />
    </div>

    <!-- Table List Layout -->
    <div v-if="Object.keys(groupedData).length > 0" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-[15%]">Program</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-[15%]">Kegiatan</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Indikator Kinerja</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center w-24">Target</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center w-32">Anggaran</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="(kegiatans, programName, gIndex) in groupedData" :key="programName">
              <tr v-for="(kegiatan, i) in kegiatans" :key="kegiatan.id" class="group hover:bg-slate-50/80 transition-colors">
                <td class="p-4 text-center">
                  <span class="text-sm font-bold text-slate-400">{{ i === 0 ? Number(gIndex) + 1 : '' }}</span>
                </td>
                <td class="p-4">
                  <p v-if="i === 0" class="text-sm font-bold text-slate-800 leading-tight">{{ programName }}</p>
                </td>
                <td class="p-4">
                  <p class="text-sm font-semibold text-slate-700 leading-snug">{{ kegiatan.kegiatan }}</p>
                </td>
                <td class="p-4">
                  <div class="space-y-1">
                    <p class="text-sm font-bold text-[#2663A3] leading-snug">{{ kegiatan.sasaranText }}</p>
                    <span class="inline-flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <IconBuilding :size="10"/>
                      {{ kegiatan.unitKerja }}
                    </span>
                  </div>
                </td>
                 <td class="p-4 text-center">
                   <span class="px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-100">{{ kegiatan.target || 0 }}</span>
                 </td>
                 <td class="p-4 text-center">
                   <span class="text-sm font-black text-emerald-600 font-mono">{{ formatCurrency(kegiatan.anggaran) }}</span>
                 </td>
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/view?id=${kegiatan.id}`)" 
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <IconEye :size="18" />
                    </button>
                    <button 
                      @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${kegiatan.id}`)" 
                      class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <IconPencil :size="18" />
                    </button>
                    <button 
                      @click="handleDelete(kegiatan)" 
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
      <h3 class="text-lg font-bold text-slate-800">Tidak ada kegiatan ditemukan</h3>
      <p class="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Coba sesuaikan kata kunci pencarian atau filter Unit Kerja Anda.</p>
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
import useSWRV from 'swrv'
import { 
  IconPlus, IconSearch, IconBuilding, IconCalendarEvent, 
  IconEye, IconPencil, IconCoin, IconFileDescription, IconTrash
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import Alert from '@/components/UI/alert.vue'

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

interface KegiatanRow {
  id: number
  program: string
  kegiatan: string
  sasaranText: string
  unitKerja: string
  target: any
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
    const [skRes, masterKegiatanRes, masterProgramRes] = await Promise.all([
      $fetch<any[]>('/api/sasaran-kegiatan'),
      $fetch<any[]>('/api/master-kegiatan'),
      $fetch<any[]>('/api/master-program'),
    ])

    const kegMap = new Map(masterKegiatanRes.map((k: any) => [k.id, k.namaKegiatan]));
    const progMap = new Map(masterProgramRes.map((p: any) => [p.id, p.namaProgram]));

    baseData.value = skRes.map((item: any) => ({
      id: item.id,
      program: item.kegiatanName || progMap.get(item.programId) || 'Program Umum',
      kegiatan: item.kegiatanName || 'Kegiatan Utama',
      sasaranText: item.sasaranText || '-',
      unitKerja: item.unitKerja || '-',
      target: item.target || 0,
      anggaran: item.anggaran || '0',
    }))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

async function handleDelete(item: any) {
  if (!confirm(`Apakah Anda yakin ingin menghapus "${item.kegiatan}"? Data yang dihapus tidak dapat dikembalikan.`)) return;
  
  try {
    const result = await $fetch<any[]>('/api/sasaran-kegiatan', {
      method: 'DELETE',
      body: { id: item.id }
    });

    if (result) {
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

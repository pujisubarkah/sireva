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
            class="border-0! shadow-none hover:bg-slate-50"
          />
          <div class="w-px h-6 bg-slate-200"></div>
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
            class="border-0! shadow-none hover:bg-slate-50"
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

    <!-- Table List Layout -->
    <div v-else-if="tableRows.length > 0" class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <UiTable
        :columns="tableColumns"
        :data="tableRows"
        :page-size="10"
        :show-pagination="true"
        row-key="id"
      >
        <template #cell-no="{ index }">
          <span class="text-sm font-bold text-slate-400">{{ Number(index) + 1 }}</span>
        </template>

        <template #cell-indikator="{ value }">
          <p class="text-sm font-bold text-slate-800 leading-tight">{{ value }}</p>
        </template>

        <template #cell-rencanaAksi="{ value }">
          <p class="text-sm font-semibold text-[#2663A3] leading-snug">{{ value }}</p>
        </template>

        <template #cell-unitKerja="{ value }">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
            <IconBuilding :size="12" class="text-slate-400"/>
            {{ value }}
          </span>
        </template>

        <template #cell-target="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 inline-flex min-w-16 justify-center shadow-sm">
            {{ value }}
          </span>
        </template>

        <template #cell-anggaran="{ value }">
          <span class="text-xs font-black text-emerald-600">
            Rp {{ Number(value || 0).toLocaleString('id-ID') }}
          </span>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="router.push(`/${$route.params.slug}/rencana-aksi/view?id=${row.id}`)"
              class="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
            >
              <IconEye :size="20" />
            </button>
            <button
              @click="router.push(`/${$route.params.slug}/rencana-aksi/edit?id=${row.id}`)"
              class="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <IconPencil :size="20" />
            </button>
            <button
              @click="handleDelete(row)"
              class="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <IconTrash :size="20" />
            </button>
          </div>
        </template>
      </UiTable>
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
  IconTarget, IconChartBar, IconSearch, IconTrash
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import UiTable from '@/components/UI/Table.vue'
import useSWRV from 'swrv'

const router = useRouter()
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher)
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()))
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

const selectedUnitKerja = ref('Semua Unit Kerja')
const unitKerjaOptions = computed(() => {
  const units = unitData.value?.map((u: any) => u.nama) || []
  return ['Semua Unit Kerja', ...units]
})

// Fetchers

const { data: rencanaData, isValidating: loading } = useSWRV('/api/rencana-aksi', fetcher)

const tableColumns = [
  { key: 'no', label: 'No', center: true, width: 70 },
  { key: 'indikator', label: 'Indikator Kinerja', width: '25%' },
  { key: 'rencanaAksi', label: 'Rencana Aksi' },
  { key: 'unitKerja', label: 'Unit Kerja', width: '20%' },
  { key: 'target', label: 'Target', center: true, width: 100 },
  { key: 'anggaran', label: 'Anggaran', center: true, width: 140 },
  { key: 'aksi', label: 'Aksi', center: true, width: 140 },
]

// Computeds
const tableRows = computed(() => {
  if (!rencanaData.value) return []
  
  let data = (rencanaData.value || []);

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

async function handleDelete(item: any) {
  if (!confirm(`Apakah Anda yakin ingin menghapus rencana aksi "${item.rencanaAksi}"? Data yang dihapus tidak dapat dikembalikan.`)) return;
  
  try {
    const result = await $fetch<any[]>('/api/rencana-aksi', {
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
/* Scoped custom animations and styles */
</style>

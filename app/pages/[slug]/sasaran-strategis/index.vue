<template>
  <div class="space-y-8 pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
      <div class="flex items-start gap-5">
        <div class="p-4 bg-blue-100 rounded-3xl text-[#2663A3] shadow-sm">
          <IconLayoutGrid :size="32" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Sasaran Strategis
            <span class="px-3 py-1 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {{ displayRows.length }} Data
            </span>
          </h1>
          <p class="text-slate-500 mt-1 font-medium text-sm">Kelola dan pantau target sasaran strategis organisasi secara real-time.</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Floating Add Button -->
        <button
          v-if="isSuperAdmin"
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
          class="hidden md:flex px-8 py-4 rounded-2xl bg-[#2663A3] text-white text-sm font-black hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 items-center gap-2 active:scale-95"
        >
          <IconPlus :size="18" stroke-width="3" />
          Tambah Sasaran
        </button>

        <div class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FilterDropdown
            v-if="isSuperAdmin"
            v-model="selectedUnitId"
            :options="unitOptions"
            :icon="IconBuilding"
            placeholder="Pilih Unit Kerja"
            class="border-0! shadow-none hover:bg-slate-50"
            :label-mode="true"
          />
          <div v-if="isSuperAdmin" class="w-px h-6 bg-slate-200"></div>
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
            placeholder="Pilih Tahun"
            class="border-0! shadow-none hover:bg-slate-50"
          />
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-2 flex flex-col md:flex-row gap-4">
      <div class="relative group flex-1">
        <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <IconSearch :size="20" class="text-slate-400 group-focus-within:text-[#2663A3] transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari kode atau sasaran strategis..." 
          class="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2663A3] transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
        />
      </div>
      
      <button
        v-if="isSuperAdmin"
        @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
        class="md:hidden w-full py-4 rounded-2xl bg-[#2663A3] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20"
      >
        <IconPlus :size="18" stroke-width="3" />
        Tambah Sasaran Strategis
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && displayRows.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-[#2663A3] rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-8 text-slate-500 font-black uppercase tracking-widest text-[10px]">Sinkronisasi Data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="displayRows.length === 0" class="text-center py-20 bg-white border border-slate-200 rounded-3xl mx-2 shadow-sm">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
        <IconFolderSearch :size="40" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">Tidak ada data ditemukan</h3>
      <p class="text-slate-500 mt-2 text-sm font-medium">Coba ubah kriteria pencarian atau tambahkan data baru.</p>
    </div>

    <!-- Table Layout (List Mode) -->
    <div v-else class="mx-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <UiTable
        :columns="tableColumns"
        :data="paginatedRows"
        :page-size="pageSize"
        :current-page="currentPage"
        :show-pagination="true"
        @page-change="currentPage = $event"
        row-key="id"
        class="border-0"
      >
        <template #cell-no="{ index }">
          <span class="text-xs font-black text-slate-400">{{ (currentPage - 1) * pageSize + Number(index) + 1 }}</span>
        </template>

        <template #cell-kode="{ value }">
          <span class="px-2 py-1 bg-blue-50 text-[#2663A3] text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-tighter">
            {{ value || '-' }}
          </span>
        </template>

        <template #cell-sasaranText="{ value }">
          <p class="text-[13px] font-bold text-slate-800 leading-tight">{{ value }}</p>
        </template>

        <template #cell-unit="{ row }">
          <span v-if="row.ownerUnitName" class="px-3 py-1.5 bg-blue-50 text-[#2663A3] text-[10px] font-black rounded-xl border border-blue-100 uppercase tracking-tight">
            {{ row.ownerUnitName }}
          </span>
          <span v-else class="text-[10px] text-slate-400 font-bold uppercase italic tracking-widest">
            Global / Semua Unit
          </span>
        </template>

        <template #cell-indikatorNama="{ value }">
          <p class="text-[12px] font-black text-slate-700 uppercase tracking-tight leading-snug">{{ value || '-' }}</p>
        </template>

        <template #cell-target="{ row }">
          <div class="flex items-end justify-center gap-1">
            <span class="text-sm font-black text-[#2663A3]">{{ row.targetValue || 0 }}</span>
            <span class="text-[9px] font-bold text-slate-400 uppercase pb-0.5">{{ row.indikatorSatuan }}</span>
          </div>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="router.push(`/${$route.params.slug}/sasaran-strategis/view?id=${row.ssId}`)"
              class="p-2.5 text-slate-400 hover:text-[#2663A3] hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
              title="Lihat Detail"
            >
              <IconEye :size="20" stroke-width="2.5" />
            </button>
            <button
              v-if="isSuperAdmin"
              @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${row.ssId}`)"
              class="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90"
              title="Edit"
            >
              <IconPencil :size="20" stroke-width="2.5" />
            </button>
            <button
              v-if="isSuperAdmin"
              @click="handleDelete(row)"
              class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
              title="Hapus"
            >
              <IconTrash :size="20" stroke-width="2.5" />
            </button>
          </div>
        </template>
      </UiTable>
    </div>
  </div>
</template>


<script setup lang="ts">
/**
 * Komponen Sasaran Strategis Index Standardized
 */

definePageMeta({ layout: 'dashboard' })

import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IconEye, IconPencil, IconPlus, IconBuilding, IconCalendarEvent,
  IconSearch, IconTrash, IconFolderSearch
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import UiTable from '@/components/UI/Table.vue'
import useSWRV from 'swrv'
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()
const fetcher = (url: string) => fetch(url).then(r => r.json())

// State
const searchQuery = ref('')
const selectedYear = ref('2026')
const selectedUnitId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)

// Options
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

// Data Fetching
const { role, authUser } = useAuthUser()
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher)
// Role Checks Normalized
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const isAdmin = computed(() => normalizedRole.value === 'admin')

const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())
const userUnitKerjaId = computed(() => {
  if (!isAdmin.value || !unitData.value) return null
  const found = unitData.value.find((u: any) => u.nama === loggedUnitKerjaName.value)
  return found?.id || null
})

const apiUrl = computed(() => {
  if (isSuperAdmin.value) {
    if (selectedUnitId.value) return `/api/sasaran-strategis/unit-kerja/${selectedUnitId.value}`
    return '/api/sasaran-strategis'
  }
  const unitId = userUnitKerjaId.value
  if (!unitId) return null
  return `/api/sasaran-strategis/unit-kerja/${unitId}`
})

const { data: ssRaw, isValidating: loading, mutate } = useSWRV(() => apiUrl.value, fetcher)

const unitOptions = computed(() => {
  const units = (unitData.value || []).map((u: any) => ({ value: u.id, label: u.nama }))
  return [{ value: null, label: 'Semua Unit Kerja' }, ...units]
})

const displayRows = computed(() => {
  let rows = (ssRaw.value || []) as any[]
  if (ssRaw.value?.data) rows = ssRaw.value.data

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    rows = rows.filter((r: any) => 
      r.sasaranText?.toLowerCase().includes(q) || 
      r.kode?.toLowerCase().includes(q) ||
      r.indikatorNama?.toLowerCase().includes(q)
    )
  }

  return rows.map((r: any) => ({
    ...r,
    targetValue: r.targets?.find((t: any) => Number(t.tahun) === Number(selectedYear.value))?.target || 0
  }))
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return displayRows.value.slice(start, start + pageSize.value)
})

const tableColumns = [
  { key: 'no', label: 'No', center: true, width: 60 },
  { key: 'kode', label: 'Kode', center: true, width: 80 },
  { key: 'sasaranText', label: 'Sasaran Strategis', width: '25%' },
  { key: 'unit', label: 'Unit Kerja', width: '20%' },
  { key: 'indikatorNama', label: 'Indikator Kinerja', width: '25%' },
  { key: 'target', label: 'Target', center: true, width: 140 },
  { key: 'aksi', label: 'Aksi', center: true, width: 120 },
]

async function handleDelete(item: any) {
  if (!confirm(`Hapus sasaran strategis "${item.sasaranText}"?`)) return
  try {
    await $fetch(`/api/sasaran-strategis/${item.ssId}`, { method: 'DELETE' })
    mutate()
  } catch (error) {
    alert('Gagal menghapus data.')
  }
}

watch([searchQuery, selectedYear, selectedUnitId], () => { currentPage.value = 1 })
</script>

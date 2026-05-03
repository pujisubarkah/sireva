<template>
  <div class="space-y-8 pb-10">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Rencana Aksi
          <span class="px-3 py-1 rounded-full bg-blue-100 text-[#2663A3] text-xs font-black uppercase tracking-widest">
            {{ displayRows.length }} Data
          </span>
        </h1>
        <p class="text-slate-500 mt-2 font-medium">Pengelolaan rincian rencana aksi dan target capaian operasional.</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FilterDropdown
            v-if="!isUserOnly"
            v-model="selectedUnitKerja"
            :options="unitKerjaOptions"
            :icon="IconBuilding"
            placeholder="Pilih Unit Kerja"
            class="border-0! shadow-none hover:bg-slate-50"
          />
          <div v-if="!isUserOnly" class="w-px h-6 bg-slate-200"></div>
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
    <div class="px-2">
      <div class="relative group max-w-xl">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IconSearch :size="20" class="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari rencana aksi, indikator, atau sasaran..." 
          class="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-medium"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && displayRows.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs">Menyinkronkan Data...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="displayRows.length === 0" class="text-center py-16 bg-white border border-slate-200 rounded-3xl">
      <IconFolderSearch :size="48" class="mx-auto text-slate-300 mb-4" />
      <h3 class="text-lg font-bold text-slate-700">Tidak ada data ditemukan</h3>
      <p class="text-slate-500 mt-2">Coba ubah filter pencarian atau tambahkan data baru.</p>
      <button
        @click="router.push(`/${$route.params.slug}/rencana-aksi/add`)"
        class="mt-4 px-5 py-2.5 rounded-xl bg-[#2663A3] text-white text-sm font-bold hover:bg-blue-800 transition-colors"
      >
        + Tambah Rencana Aksi
      </button>
    </div>

    <!-- Table List Layout -->
    <div v-else class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <UiTable
        :columns="tableColumns"
        :data="paginatedRows"
        :page-size="pageSize"
        :current-page="currentPage"
        :show-pagination="true"
        @page-change="currentPage = $event"
        row-key="id"
      >
        <template #cell-no="{ index }">
          <span class="text-sm font-bold text-slate-400">{{ (currentPage - 1) * pageSize + Number(index) + 1 }}</span>
        </template>

        <template #cell-indikator="{ value }">
          <p class="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{{ value }}</p>
        </template>

        <template #cell-rencanaAksi="{ value }">
          <p class="text-sm font-semibold text-[#2663A3] leading-snug line-clamp-2">{{ value }}</p>
        </template>

        <template #cell-target="{ value, row }">
          <div class="flex flex-col items-center gap-1">
            <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 inline-flex min-w-16 justify-center shadow-sm">
              {{ value }}
            </span>
            <span v-if="row.satuan" class="text-[10px] text-slate-400 font-medium">{{ row.satuan }}</span>
          </div>
        </template>

        <template #cell-tw1="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex min-w-14 justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-tw2="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-cyan-50 text-cyan-700 border border-cyan-200 inline-flex min-w-14 justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-tw3="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 inline-flex min-w-14 justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-tw4="{ value }">
          <span class="px-3 py-1.5 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 inline-flex min-w-14 justify-center">
            {{ value }}
          </span>
        </template>

        <template #cell-anggaran="{ value }">
          <span class="text-xs font-black text-emerald-600 whitespace-nowrap">
            Rp {{ formatRupiah(value || 0) }}
          </span>
        </template>

        <template #cell-aksi="{ row }">
          <div class="flex items-center justify-center gap-1">
            <button
              @click="router.push(`/${$route.params.slug}/rencana-aksi/view?id=${row.id}`)"
              class="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
              title="Lihat Detail"
            >
              <IconEye :size="20" />
            </button>
            <button
              @click="router.push(`/${$route.params.slug}/rencana-aksi/edit?id=${row.id}`)"
              class="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Edit"
            >
              <IconPencil :size="20" />
            </button>
            <button
              @click="handleDelete(row)"
              class="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Hapus"
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
 * Komponen Rencana Aksi - Versi Optimized
 * Fitur: Filtering multi-kriteria, pagination, format currency, error handling
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
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

const dummyRows = [
  {
    id: 9001,
    indikatorId: 101,
    indikator: 'Persentase ketercapaian output kegiatan',
    rencanaAksi: 'Penyusunan jadwal rinci pelaksanaan kegiatan triwulan I',
    target: '95',
    satuan: '%',
    anggaran: 25000000,
    sasaran: 'Peningkatan kualitas layanan organisasi',
    unitKerja: 'Bagian Perencanaan',
    tahun: 2026,
    tw1: '25',
    tw2: '24',
    tw3: '23',
    tw4: '23',
  },
  {
    id: 9002,
    indikatorId: 102,
    indikator: 'Jumlah dokumen monitoring yang tervalidasi',
    rencanaAksi: 'Monitoring bulanan dan validasi dokumen capaian',
    target: '12',
    satuan: 'Dokumen',
    anggaran: 18000000,
    sasaran: 'Penguatan tata kelola kinerja',
    unitKerja: 'Bagian Evaluasi',
    tahun: 2026,
    tw1: '3',
    tw2: '3',
    tw3: '3',
    tw4: '3',
  },
  {
    id: 9003,
    indikatorId: 103,
    indikator: 'Ketepatan waktu pelaporan capaian',
    rencanaAksi: 'Penyusunan laporan semester dan review internal',
    target: '2',
    satuan: 'Laporan',
    anggaran: 15000000,
    sasaran: 'Meningkatkan akuntabilitas pelaporan',
    unitKerja: 'Bagian Perencanaan',
    tahun: 2026,
    tw1: '1',
    tw2: '0',
    tw3: '1',
    tw4: '0',
  },
] as const

// State
const searchQuery = ref('')
const selectedYear = ref(String(new Date().getFullYear()))
const selectedUnitKerja = ref('Semua Unit Kerja')
const currentPage = ref(1)
const pageSize = ref(10)

// Options
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

// Data Fetching
const { authUser, role } = useAuthUser()
const { data: unitData } = useSWRV('/api/unit-kerja', fetcher)
const { data: rencanaData, isValidating: loading, mutate } = useSWRV('/api/rencana-aksi', fetcher)

// Computed Properties
const isUserOnly = computed(() => {
  const roleName = String(role.value || '').toLowerCase()
  const roleId = Number(authUser.value?.role_id)
  return roleName === 'user' || roleId === 3
})

const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

const unitKerjaOptions = computed((): string[] => {
  const units =
    unitData.value
      ?.map((u: any) => String(u?.nama ?? '').trim())
      .filter((name: string) => Boolean(name)) || []

  const uniqueUnits: string[] = [...new Set<string>(units)]

  if (isUserOnly.value) {
    return loggedUnitKerjaName.value ? [loggedUnitKerjaName.value] : []
  }

  return ['Semua Unit Kerja', ...uniqueUnits]
})

const unitNameById = computed(() => {
  const map = new Map<number, string>()
  for (const u of unitData.value ?? []) {
    const id = Number(u?.id)
    const name = String(u?.nama || '').trim()
    if (!Number.isNaN(id) && name) map.set(id, name)
  }
  return map
})

const normalize = (value: unknown) => String(value || '').trim().toLowerCase()

const sourceRows = computed<any[]>(() => {
  const rows = Array.isArray(rencanaData.value) ? rencanaData.value : []
  if (rows.length > 0) return rows

  // Keep preview visible for user role by aligning one dummy row with logged-in unit.
  if (isUserOnly.value && loggedUnitKerjaName.value) {
    return dummyRows.map((row, idx) => ({
      ...row,
      unitKerja: idx === 0 ? loggedUnitKerjaName.value : row.unitKerja,
    }))
  }

  return [...dummyRows]
})

const quarterSum = (values: Array<unknown>): number => {
  let total = 0
  for (const value of values) {
    total += Number(value ?? 0)
  }
  return total
}

const filteredRows = computed(() => {
  let data = [...sourceRows.value].map((d: any) => {
    const unitId = Number(d.unitKerja)
    const mappedName = unitNameById.value.get(unitId)
    const computedTw1 = d.tw1 != null ? Number(d.tw1) : quarterSum([d.b01, d.b02, d.b03])
    const computedTw2 = d.tw2 != null ? Number(d.tw2) : quarterSum([d.b04, d.b05, d.b06])
    const computedTw3 = d.tw3 != null ? Number(d.tw3) : quarterSum([d.b07, d.b08, d.b09])
    const computedTw4 = d.tw4 != null ? Number(d.tw4) : quarterSum([d.b10, d.b11, d.b12])

    return {
      ...d,
      unitKerja: mappedName || d.unitKerja,
      tw1: String(computedTw1),
      tw2: String(computedTw2),
      tw3: String(computedTw3),
      tw4: String(computedTw4),
    }
  })

  // Filter by Year
  if (selectedYear.value) {
    data = data.filter((d: any) => String(d.tahun) === selectedYear.value)
  }

  // Force unit kerja scope for user login
  if (isUserOnly.value && loggedUnitKerjaName.value) {
    data = data.filter((d: any) => normalize(d.unitKerja) === normalize(loggedUnitKerjaName.value))
  } else if (selectedUnitKerja.value !== 'Semua Unit Kerja') {
    data = data.filter((d: any) => d.unitKerja === selectedUnitKerja.value)
  }

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter((d: any) =>
      d.rencanaAksi?.toLowerCase().includes(q)
      || d.indikator?.toLowerCase().includes(q)
      || d.sasaran?.toLowerCase().includes(q)
      || d.unitKerja?.toLowerCase().includes(q)
    )
  }

  return data
})

const hasApiRows = computed(() => {
  return Array.isArray(rencanaData.value) && rencanaData.value.length > 0
})

const displayRows = computed(() => {
  if (filteredRows.value.length > 0) return filteredRows.value

  // In user context, keep table visible even when filteredRows is empty.
  if (isUserOnly.value) {
    return sourceRows.value.map((d: any) => {
      const unitId = Number(d.unitKerja)
      const mappedName = unitNameById.value.get(unitId)
      const computedTw1 = d.tw1 != null ? Number(d.tw1) : quarterSum([d.b01, d.b02, d.b03])
      const computedTw2 = d.tw2 != null ? Number(d.tw2) : quarterSum([d.b04, d.b05, d.b06])
      const computedTw3 = d.tw3 != null ? Number(d.tw3) : quarterSum([d.b07, d.b08, d.b09])
      const computedTw4 = d.tw4 != null ? Number(d.tw4) : quarterSum([d.b10, d.b11, d.b12])

      return {
        ...d,
        unitKerja: mappedName || d.unitKerja,
        tw1: String(computedTw1),
        tw2: String(computedTw2),
        tw3: String(computedTw3),
        tw4: String(computedTw4),
      }
    })
  }

  // Keep table visible with preview rows when API data is still empty.
  if (!hasApiRows.value) {
    return sourceRows.value.map((d: any) => {
      const unitId = Number(d.unitKerja)
      const mappedName = unitNameById.value.get(unitId)
      const computedTw1 = d.tw1 != null ? Number(d.tw1) : quarterSum([d.b01, d.b02, d.b03])
      const computedTw2 = d.tw2 != null ? Number(d.tw2) : quarterSum([d.b04, d.b05, d.b06])
      const computedTw3 = d.tw3 != null ? Number(d.tw3) : quarterSum([d.b07, d.b08, d.b09])
      const computedTw4 = d.tw4 != null ? Number(d.tw4) : quarterSum([d.b10, d.b11, d.b12])

      return {
        ...d,
        unitKerja: mappedName || d.unitKerja,
        tw1: String(computedTw1),
        tw2: String(computedTw2),
        tw3: String(computedTw3),
        tw4: String(computedTw4),
      }
    })
  }

  return []
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return displayRows.value.slice(start, end)
})

const tableColumns = [
  { key: 'no', label: 'No', center: true, width: 70 },
  { key: 'indikator', label: 'Indikator Kinerja', width: '30%' },
  { key: 'rencanaAksi', label: 'Rencana Aksi', width: '35%' },
  { key: 'target', label: 'Target Tahunan', center: true, width: 120 },
  { key: 'tw1', label: 'TW I', center: true, width: 90 },
  { key: 'tw2', label: 'TW II', center: true, width: 90 },
  { key: 'tw3', label: 'TW III', center: true, width: 90 },
  { key: 'tw4', label: 'TW IV', center: true, width: 90 },
  { key: 'aksi', label: 'Aksi', center: true, width: 140 },
]

// Helpers
const formatRupiah = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return Number(num || 0).toLocaleString('id-ID')
}

// Actions
async function handleDelete(item: any) {
  if (!confirm(`Hapus rencana aksi "${item.rencanaAksi}"? Data tidak dapat dikembalikan.`)) return

  try {
    await fetch('/api/rencana-aksi', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    })

    // Refresh data tanpa reload full page
    await mutate()

    // Reset pagination if current page becomes empty
    if (paginatedRows.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    console.error('Delete error:', error)
    alert('Gagal menghapus data. Silakan coba lagi.')
  }
}

// Reset pagination when filters change
const resetPagination = () => { currentPage.value = 1 }
watch([searchQuery, selectedYear, selectedUnitKerja], resetPagination)

watch(
  [isUserOnly, loggedUnitKerjaName],
  ([userOnly, unitName]) => {
    if (userOnly && unitName) {
      selectedUnitKerja.value = unitName
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

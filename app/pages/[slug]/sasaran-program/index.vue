<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Sasaran Program (SP)</h1>
        <p class="text-sm text-slate-500 mt-1">Penjabaran strategis ke tingkat program kerja (Level JPT Pratama).</p>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Daftar Sasaran Program</h2>
        <div class="flex items-center gap-3">
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
          />
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/sasaran-program/add`)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm cursor-pointer"
          >
            + Tambah Sasaran Program
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div style="min-width: 1100px;" class="p-5">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <template #cell-targetRenstra="{ row }">
              <div class="metric-card metric-card-blue">
                <div v-for="year in years" :key="`renstra-${row.id}-${year}`" class="metric-row metric-row-blue">
                  <span class="metric-year metric-year-blue">{{ year }}</span>
                  <span class="metric-value metric-value-blue">{{ row.targetRenstra[year] }}</span>
                </div>
              </div>
            </template>

            <template #cell-targetPerjanjian="{ row }">
              <div class="metric-card metric-card-emerald">
                <div v-for="year in years" :key="`pk-${row.id}-${year}`" class="metric-row metric-row-emerald">
                  <span class="metric-year metric-year-emerald">{{ year }}</span>
                  <span class="metric-value metric-value-emerald">{{ row.targetPerjanjian[year] }}</span>
                </div>
              </div>
            </template>

            <template #cell-aksi="{ row }">
              <div class="flex items-center justify-center gap-2">
                <button
                  type="button"
                  @click="router.push(`/${$route.params.slug}/sasaran-program/edit?id=${row.id}`)"
                  title="Edit"
                  :aria-label="`Edit ${row.sasaranProgram}`"
                  class="action-btn action-btn-edit"
                >
                  <IconPencil :size="16" :stroke="'2'" />
                </button>
                <button
                  type="button"
                  @click="router.push(`/${$route.params.slug}/sasaran-program/view?id=${row.id}`)"
                  title="Lihat"
                  :aria-label="`Lihat ${row.sasaranProgram}`"
                  class="action-btn action-btn-view"
                >
                  <IconEye :size="16" :stroke="'2'" />
                </button>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useRouter } from 'vue-router'
import { IconEye, IconPencil, IconCalendarEvent } from '@tabler/icons-vue'
import { ref, computed } from 'vue'
import Table from '@/components/UI/Table.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const router = useRouter()

const selectedYear = ref(String(new Date().getFullYear()))
const yearOptions = ['2025', '2026', '2027', '2028', '2029']

const years = computed(() => [Number(selectedYear.value)])

type YearMap = Record<number, number>

interface ProgramRow {
  id: number
  no: number
  sasaranProgram: string
  satuan: string
  targetRenstra: YearMap
  targetPerjanjian: YearMap
  unitKerja: string
  aksi: string
}

const columns = computed(() => [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaranProgram', label: 'Sasaran Program' },
  { key: 'satuan', label: 'Satuan', className: 'w-28' },
  { key: 'targetRenstra', label: `Target Kinerja Renstra (${selectedYear.value})` },
  { key: 'targetPerjanjian', label: `Target Perjanjian Kinerja (${selectedYear.value})` },
  { key: 'unitKerja', label: 'Unit Kerja' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
])

const tableRows: ProgramRow[] = [
  {
    id: 1,
    no: 1,
    sasaranProgram: 'Program Pelatihan ASN',
    satuan: 'Orang',
    targetRenstra: { 2025: 800, 2026: 900, 2027: 1000, 2028: 1100, 2029: 1200 },
    targetPerjanjian: { 2025: 780, 2026: 880, 2027: 980, 2028: 1050, 2029: 1150 },
    unitKerja: 'Pusbangkom ASN',
    aksi: '',
  },
  {
    id: 2,
    no: 2,
    sasaranProgram: 'Program Penguatan Inovasi Kelembagaan',
    satuan: 'Inovasi',
    targetRenstra: { 2025: 8, 2026: 10, 2027: 12, 2028: 14, 2029: 16 },
    targetPerjanjian: { 2025: 7, 2026: 9, 2027: 11, 2028: 13, 2029: 15 },
    unitKerja: 'Puslatbang KDOD',
    aksi: '',
  },
  {
    id: 3,
    no: 3,
    sasaranProgram: 'Program Digitalisasi Layanan Pembelajaran',
    satuan: 'Layanan',
    targetRenstra: { 2025: 5, 2026: 7, 2027: 9, 2028: 11, 2029: 13 },
    targetPerjanjian: { 2025: 5, 2026: 6, 2027: 8, 2028: 10, 2029: 12 },
    unitKerja: 'Pusdatin LAN',
    aksi: '',
  },
]
</script>

<style scoped>
.metric-card {
  border-radius: 0.5rem;
  border: 1px solid;
  padding: 0.5rem;
}

.metric-card-blue {
  border-color: rgb(191 219 254);
  background-color: rgb(239 246 255 / 0.5);
}

.metric-card-emerald {
  border-color: rgb(167 243 208);
  background-color: rgb(236 253 245 / 0.5);
}

.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid;
}

.metric-row:last-child {
  border-bottom: none;
}

.metric-row-blue {
  border-bottom-color: rgb(191 219 254);
}

.metric-row-emerald {
  border-bottom-color: rgb(167 243 208);
}

.metric-year {
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-year-blue {
  color: rgb(30 64 175);
}

.metric-year-emerald {
  color: rgb(6 95 70);
}

.metric-value {
  font-size: 0.875rem;
  font-weight: 700;
}

.metric-value-blue {
  color: rgb(30 58 138);
}

.metric-value-emerald {
  color: rgb(6 78 59);
}

.action-btn {
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 0.5rem;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn-edit {
  color: rgb(22 101 52);
  border-color: rgb(167 243 208);
  background-color: rgb(236 253 245);
}

.action-btn-edit:hover {
  color: rgb(255 255 255);
  border-color: rgb(22 163 74);
  background-color: rgb(22 163 74);
}

.action-btn-view {
  color: rgb(30 64 175);
  border-color: rgb(191 219 254);
  background-color: rgb(239 246 255);
}

.action-btn-view:hover {
  color: rgb(255 255 255);
  border-color: rgb(37 99 235);
  background-color: rgb(37 99 235);
}
</style>

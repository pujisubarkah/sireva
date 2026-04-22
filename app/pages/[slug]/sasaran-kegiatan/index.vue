<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Sasaran Kegiatan (SK)</h1>
        <p class="text-sm text-slate-500 mt-1">Daftar rinci kegiatan operasional (Level Administrator/Pengawas).</p>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Daftar Sasaran Kegiatan</h2>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/add`)"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow text-sm cursor-pointer"
        >
          + Tambah Sasaran Kegiatan
        </button>
      </div>

      <div class="px-5 pt-5">
        <Alert 
          variant="neutral" 
          message="Sasaran kegiatan merupakan turunan teknis dari Sasaran Program yang difokuskan pada level operasional unit kerja." 
        />
      </div>

      <div class="overflow-x-auto">
        <div style="min-width: 1200px;" class="p-5">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <template #cell-aksi="{ row }">
              <div class="flex items-center justify-center gap-2">
                <button
                  type="button"
                  @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${row.id}`)"
                  title="Edit"
                  :aria-label="`Edit ${row.kegiatan}`"
                  class="action-btn action-btn-edit"
                >
                  <IconPencil :size="16" :stroke="'2'" />
                </button>
                <button
                  type="button"
                  @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/view?id=${row.id}`)"
                  title="Lihat"
                  :aria-label="`Lihat ${row.kegiatan}`"
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
import { IconEye, IconPencil } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'
import Alert from '@/components/UI/alert.vue'
import { ref, onMounted } from 'vue'

const router = useRouter()

interface KegiatanRow {
  id: number
  no: number
  program: string
  kegiatan: string
  anggaran: string
  aksi: string
}

const columns = [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'program', label: 'Program' },
  { key: 'kegiatan', label: 'Kegiatan' },
  { key: 'anggaran', label: 'Anggaran', className: 'text-right w-40' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]

const tableRows = ref<KegiatanRow[]>([])

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
      $fetch('/api/master-kegiatan'),
      $fetch('/api/master-program'),
    ])

    const programMap = new Map(programData.map((p: any) => [p.id, p.namaProgram]))

    tableRows.value = kegiatanData.map((item: any, index: number) => ({
      id: item.id,
      no: index + 1,
      program: programMap.get(item.programId) || '-',
      kegiatan: item.namaKegiatan,
      anggaran: formatCurrency(item.total),
      aksi: '',
    }))
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
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

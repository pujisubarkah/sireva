<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Perjanjian Kinerja</h1>
        <p class="text-sm text-slate-500 mt-1">Daftar sasaran, indikator, dan target perjanjian kinerja.</p>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Daftar Perjanjian Kinerja</h2>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/add`)"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm transition-colors cursor-pointer"
        >
          <IconPlus :size="16" :stroke="'2'" />
          Tambah Perjanjian Kinerja
        </button>
      </div>

      <div class="p-5">
        <Table
          :columns="columns"
          :data="tableRows"
          rowKey="id"
          :showSearch="true"
          :showPagination="false"
        >
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/edit?id=${row.id}`)"
                :aria-label="`Edit ${row.sasaran}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/view?id=${row.id}`)"
                :aria-label="`Lihat ${row.sasaran}`"
                title="Lihat"
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
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useRouter } from 'vue-router'
import { IconEye, IconPencil, IconPlus } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'

const router = useRouter()

interface PerjanjianKinerjaRow {
  id: number
  no: number
  sasaran: string
  indikator: string
  target: string
  aksi: string
}

const columns = [
  { key: 'no', label: 'No', className: 'text-center w-16' },
  { key: 'sasaran', label: 'Sasaran' },
  { key: 'indikator', label: 'Indikator' },
  { key: 'target', label: 'Target', className: 'text-center w-32' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]

const tableRows: PerjanjianKinerjaRow[] = [
  {
    id: 1,
    no: 1,
    sasaran: 'Terwujudnya ASN yang Profesional dan Kompeten',
    indikator: 'Indeks Kepuasan Peserta Pelatihan',
    target: '85.0',
    aksi: '',
  },
  {
    id: 2,
    no: 2,
    sasaran: 'Meningkatnya Kualitas Kurikulum Kediklatan ASN',
    indikator: 'Jumlah Modul Pelatihan Kepemimpinan Tersusun',
    target: '4 Modul',
    aksi: '',
  },
  {
    id: 3,
    no: 3,
    sasaran: 'Terintegrasinya Sistem Pembelajaran Digital LAN',
    indikator: 'Jumlah Fitur Platform Pembelajaran Aktif',
    target: '3 Fitur',
    aksi: '',
  },
]
</script>

<style scoped>
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

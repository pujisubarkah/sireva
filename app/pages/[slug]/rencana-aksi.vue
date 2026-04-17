<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Rencana Aksi</h1>
        <p class="text-sm text-slate-500 mt-1">Rincian rencana aksi dan target capaian per triwulan.</p>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Daftar Rencana Aksi</h2>
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm"
        >
          + Tambah Rencana Aksi
        </button>
      </div>

      <div class="p-5">
        <Table :columns="columns" :data="tableRows" rowKey="id" :showPagination="false">
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-1">
              <button
                type="button"
                class="action-btn action-btn-view"
                title="Detail"
                :aria-label="`Detail ${row.rencanaAksi}`"
                @click="openDetailModal(row.id)"
              >
                <IconEye :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                class="action-btn action-btn-edit"
                title="Edit"
                :aria-label="`Edit ${row.rencanaAksi}`"
                @click="openEditModal(row.id)"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                class="action-btn action-btn-delete"
                title="Hapus"
                :aria-label="`Hapus ${row.rencanaAksi}`"
                @click="removeRow(row.id)"
              >
                <IconTrash :size="16" :stroke="'2'" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" class="absolute inset-0 bg-slate-900/45" aria-label="Tutup modal" @click="closeCreateModal" />

      <div class="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-slate-800">Tambah Rencana Aksi</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 text-xl leading-none" aria-label="Tutup" @click="closeCreateModal">&times;</button>
        </div>

        <form class="p-5 space-y-4" @submit.prevent="submitCreateForm">
          <div>
            <label for="sasaran" class="block text-sm font-medium text-slate-700 mb-1">Sasaran</label>
            <select id="sasaran" v-model="form.sasaran" class="field-input" required>
              <option value="" disabled>Pilih sasaran</option>
              <option v-for="sasaran in sasaranOptions" :key="sasaran" :value="sasaran">{{ sasaran }}</option>
            </select>
          </div>

          <div>
            <label for="indikator" class="block text-sm font-medium text-slate-700 mb-1">Indikator</label>
            <select id="indikator" v-model="form.indikator" class="field-input" :disabled="!form.sasaran" required>
              <option value="" disabled>{{ form.sasaran ? 'Pilih indikator' : 'Pilih sasaran terlebih dahulu' }}</option>
              <option v-for="indikator in indikatorOptions" :key="indikator" :value="indikator">{{ indikator }}</option>
            </select>
          </div>

          <div>
            <label for="rencana-aksi" class="block text-sm font-medium text-slate-700 mb-1">Rencana Aksi</label>
            <textarea
              id="rencana-aksi"
              v-model="form.rencanaAksi"
              class="field-input min-h-24 resize-y"
              placeholder="Tulis rencana aksi"
              required
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50" @click="closeCreateModal">
              Batal
            </button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailModal && activeRow" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" class="absolute inset-0 bg-slate-900/45" aria-label="Tutup modal detail" @click="closeDetailModal" />

      <div class="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-slate-800">Detail Rencana Aksi</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 text-xl leading-none" aria-label="Tutup" @click="closeDetailModal">&times;</button>
        </div>

        <div class="p-5 space-y-3 text-sm">
          <div><span class="text-slate-500">Sasaran:</span> <span class="text-slate-800 font-medium">{{ activeRow.sasaran }}</span></div>
          <div><span class="text-slate-500">Indikator:</span> <span class="text-slate-800 font-medium">{{ activeRow.indikator }}</span></div>
          <div><span class="text-slate-500">Rencana Aksi:</span> <span class="text-slate-800 font-medium">{{ activeRow.rencanaAksi }}</span></div>
          <div class="grid grid-cols-5 gap-2 pt-2">
            <div class="detail-metric"><div class="detail-metric-label">Target</div><div class="detail-metric-value">{{ activeRow.target }}</div></div>
            <div class="detail-metric"><div class="detail-metric-label">TW1</div><div class="detail-metric-value">{{ activeRow.tw1 }}</div></div>
            <div class="detail-metric"><div class="detail-metric-label">TW2</div><div class="detail-metric-value">{{ activeRow.tw2 }}</div></div>
            <div class="detail-metric"><div class="detail-metric-label">TW3</div><div class="detail-metric-value">{{ activeRow.tw3 }}</div></div>
            <div class="detail-metric"><div class="detail-metric-label">TW4</div><div class="detail-metric-value">{{ activeRow.tw4 }}</div></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal && activeRow" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" class="absolute inset-0 bg-slate-900/45" aria-label="Tutup modal edit" @click="closeEditModal" />

      <div class="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-slate-800">Edit Target Triwulan</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 text-xl leading-none" aria-label="Tutup" @click="closeEditModal">&times;</button>
        </div>

        <form class="p-5 space-y-4" @submit.prevent="submitEditForm">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Sasaran</label>
            <input :value="activeRow.sasaran" class="field-input" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Indikator</label>
            <input :value="activeRow.indikator" class="field-input" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Rencana Aksi</label>
            <textarea :value="activeRow.rencanaAksi" class="field-input min-h-20 resize-y" disabled />
          </div>

          <div class="grid grid-cols-5 gap-2">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Target</label>
              <input v-model.number="editForm.target" type="number" min="0" class="field-input" required />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">TW1</label>
              <input v-model.number="editForm.tw1" type="number" min="0" class="field-input" required />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">TW2</label>
              <input v-model.number="editForm.tw2" type="number" min="0" class="field-input" required />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">TW3</label>
              <input v-model.number="editForm.tw3" type="number" min="0" class="field-input" required />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">TW4</label>
              <input v-model.number="editForm.tw4" type="number" min="0" class="field-input" required />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50" @click="closeEditModal">
              Batal
            </button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref, watch } from 'vue'
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'

interface RencanaAksiRow {
  id: number
  sasaran: string
  indikator: string
  rencanaAksi: string
  target: number
  tw1: number
  tw2: number
  tw3: number
  tw4: number
  aksi: string
}

const columns = [
  { key: 'id', label: 'No', className: 'text-center w-14' },
  { key: 'sasaran', label: 'Sasaran' },
  { key: 'indikator', label: 'Indikator' },
  { key: 'rencanaAksi', label: 'Rencana Aksi' },
  { key: 'target', label: 'Target', className: 'text-center w-24' },
  { key: 'tw1', label: 'TW1', className: 'text-center w-20', group: 'Realisasi' },
  { key: 'tw2', label: 'TW2', className: 'text-center w-20', group: 'Realisasi' },
  { key: 'tw3', label: 'TW3', className: 'text-center w-20', group: 'Realisasi' },
  { key: 'tw4', label: 'TW4', className: 'text-center w-20', group: 'Realisasi' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-28' },
]

const tableRows = ref<RencanaAksiRow[]>([
  {
    id: 1,
    sasaran: 'Terwujudnya ASN yang Profesional dan Kompeten',
    indikator: 'Jumlah Peserta Pelatihan Dasar CPNS',
    rencanaAksi: 'Pelaksanaan Pelatihan Dasar CPNS Gelombang I',
    target: 200,
    tw1: 50,
    tw2: 50,
    tw3: 50,
    tw4: 50,
    aksi: '',
  },
  {
    id: 2,
    sasaran: 'Meningkatnya Kualitas Kurikulum Kediklatan ASN',
    indikator: 'Jumlah Modul Pelatihan Kepemimpinan Tersusun',
    rencanaAksi: 'Penyusunan Modul Pelatihan Kepemimpinan Tingkat III',
    target: 4,
    tw1: 1,
    tw2: 1,
    tw3: 1,
    tw4: 1,
    aksi: '',
  },
  {
    id: 3,
    sasaran: 'Terintegrasinya Sistem Pembelajaran Digital LAN',
    indikator: 'Jumlah Fitur Platform Pembelajaran Aktif',
    rencanaAksi: 'Pengembangan Platform Pembelajaran Digital LAN',
    target: 3,
    tw1: 1,
    tw2: 1,
    tw3: 1,
    tw4: 0,
    aksi: '',
  },
  {
    id: 4,
    sasaran: 'Meningkatnya Kualitas Asesmen Kompetensi ASN',
    indikator: 'Jumlah ASN yang Mengikuti Assessment Center',
    rencanaAksi: 'Pelaksanaan Assessment Center ASN',
    target: 150,
    tw1: 30,
    tw2: 40,
    tw3: 40,
    tw4: 40,
    aksi: '',
  },
  {
    id: 5,
    sasaran: 'Meningkatnya Akuntabilitas Kinerja Unit',
    indikator: 'Ketersediaan Laporan Kinerja Semesteran',
    rencanaAksi: 'Evaluasi dan Penyusunan Laporan Kinerja Semester I',
    target: 1,
    tw1: 0,
    tw2: 1,
    tw3: 0,
    tw4: 0,
    aksi: '',
  },
])

const showCreateModal = ref(false)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const activeRowId = ref<number | null>(null)

const sasaranIndicatorMap = {
  'Terwujudnya ASN yang Profesional dan Kompeten': [
    'Jumlah Peserta Pelatihan Dasar CPNS',
    'Indeks Kepuasan Peserta Pelatihan',
  ],
  'Meningkatnya Kualitas Kurikulum Kediklatan ASN': [
    'Jumlah Modul Pelatihan Kepemimpinan Tersusun',
    'Persentase Kurikulum yang Dimutakhirkan',
  ],
  'Terintegrasinya Sistem Pembelajaran Digital LAN': [
    'Jumlah Fitur Platform Pembelajaran Aktif',
    'Persentase Layanan Pembelajaran Digital Berjalan',
  ],
  'Meningkatnya Kualitas Asesmen Kompetensi ASN': [
    'Jumlah ASN yang Mengikuti Assessment Center',
    'Persentase Hasil Asesmen Tepat Waktu',
  ],
  'Meningkatnya Akuntabilitas Kinerja Unit': [
    'Ketersediaan Laporan Kinerja Semesteran',
    'Ketepatan Waktu Penyampaian Laporan Kinerja',
  ],
} as const

const form = ref({
  sasaran: '',
  indikator: '',
  rencanaAksi: '',
})

const editForm = ref({
  target: 0,
  tw1: 0,
  tw2: 0,
  tw3: 0,
  tw4: 0,
})

const sasaranOptions = computed(() => Object.keys(sasaranIndicatorMap))

const indikatorOptions = computed(() => {
  if (!form.value.sasaran) return []
  return sasaranIndicatorMap[form.value.sasaran as keyof typeof sasaranIndicatorMap] ?? []
})

const activeRow = computed(() => {
  if (activeRowId.value === null) return null
  return tableRows.value.find((row) => row.id === activeRowId.value) ?? null
})

watch(
  () => form.value.sasaran,
  () => {
    form.value.indikator = ''
  }
)

function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function openDetailModal(id: number) {
  activeRowId.value = id
  showDetailModal.value = true
}

function closeDetailModal() {
  showDetailModal.value = false
  activeRowId.value = null
}

function openEditModal(id: number) {
  const row = tableRows.value.find((item) => item.id === id)
  if (!row) return
  activeRowId.value = id
  editForm.value = {
    target: row.target,
    tw1: row.tw1,
    tw2: row.tw2,
    tw3: row.tw3,
    tw4: row.tw4,
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  activeRowId.value = null
}

function submitEditForm() {
  if (activeRowId.value === null) return
  tableRows.value = tableRows.value.map((row) =>
    row.id === activeRowId.value
      ? {
          ...row,
          target: Number(editForm.value.target) || 0,
          tw1: Number(editForm.value.tw1) || 0,
          tw2: Number(editForm.value.tw2) || 0,
          tw3: Number(editForm.value.tw3) || 0,
          tw4: Number(editForm.value.tw4) || 0,
        }
      : row
  )

  closeEditModal()
}

function removeRow(id: number) {
  const row = tableRows.value.find((item) => item.id === id)
  if (!row) return
  const confirmed = window.confirm(`Hapus rencana aksi \"${row.rencanaAksi}\"?`)
  if (!confirmed) return
  tableRows.value = tableRows.value.filter((item) => item.id !== id)
}

function submitCreateForm() {
  const sasaran = form.value.sasaran.trim()
  const indikator = form.value.indikator.trim()
  const rencanaAksi = form.value.rencanaAksi.trim()
  if (!sasaran || !indikator || !rencanaAksi) return

  const nextId = tableRows.value.length ? Math.max(...tableRows.value.map((row) => row.id)) + 1 : 1

  tableRows.value.push({
    id: nextId,
    sasaran,
    indikator,
    rencanaAksi,
    target: 0,
    tw1: 0,
    tw2: 0,
    tw3: 0,
    tw4: 0,
    aksi: '',
  })

  form.value = {
    sasaran: '',
    indikator: '',
    rencanaAksi: '',
  }
  closeCreateModal()
}
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(203 213 225);
  border-radius: 0.5rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background: rgb(255 255 255);
}

.field-input:focus {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(191 219 254 / 0.6);
}

.detail-metric {
  border: 1px solid rgb(191 219 254);
  background: rgb(239 246 255 / 0.7);
  border-radius: 0.5rem;
  padding: 0.5rem;
  text-align: center;
}

.detail-metric-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgb(30 64 175);
}

.detail-metric-value {
  margin-top: 0.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(30 58 138);
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

.action-btn-delete {
  color: rgb(220 38 38);
  border-color: rgb(254 202 202);
  background-color: rgb(254 242 242);
}

.action-btn-delete:hover {
  color: rgb(255 255 255);
  border-color: rgb(220 38 38);
  background-color: rgb(220 38 38);
}
</style>
